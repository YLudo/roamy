"use server";

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db";
import { plaidClient } from "@/lib/plaid";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache";
import { CountryCode, Products } from "plaid";

export const createLinkToken = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const clientUserId = session.user.id;

        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: clientUserId },
            client_name: 'Roamy App',
            products: ["transactions"] as Products[],
            country_codes: ['FR'] as CountryCode[],
            language: 'fr',
        });

        return { 
            data: response.data.link_token 
        };
    } catch (error) {
        return {
            error: "Impossible de créer le token de lien Plaid. Veuillez réessayer."
        };
    }
}

export const exchangePublicToken = async (publicToken: string) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = exchangeResponse.data.access_token;
        const itemId = exchangeResponse.data.item_id;

        const itemResponse = await plaidClient.itemGet({
            access_token: accessToken,
        });

        const institutionId = itemResponse.data.item.institution_id || "";

        let institutionName = "Institution financière";
        if (institutionId) {
            const institutionResponse = await plaidClient.institutionsGetById({
                institution_id: institutionId,
                country_codes: ["FR"] as CountryCode[],
            });
            institutionName = institutionResponse.data.institution.name;
        }

        const plaidItem = await prisma.plaidItem.create({
            data: {
                userId: session.user.id,
                accessToken,
                itemId,
                institutionId,
                institutionName,
            },
        });

        await syncAccounts(plaidItem.id, accessToken);
        await syncTransactions(accessToken);

        await pusherServer.trigger(
            `user-${session.user.id}`,
            "bank:new",
            plaidItem.id,
        );

        return {
            data: plaidItem.id,
        };
    } catch (error) {
        return {
            error: "Impossible d'échanger le token public. Veuillez réessayer.",
        };
    }
}

export const syncAccounts = async (itemId: string, accessToken: string) => {
    try {
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accounts = accountsResponse.data.accounts;

        for (const account of accounts) {
            await prisma.plaidAccount.upsert({
                where: { accountId: account.account_id },
                update: {
                    name: account.name,
                    mask: account.mask || "",
                    type: account.type,
                    subtype: account.subtype || "",
                    balanceAvailable: account.balances.available || null,
                    balanceCurrent: account.balances.current || 0,
                    isoCurrencyCode: account.balances.iso_currency_code || "EUR",
                },
                create: {
                    itemId,
                    accountId: account.account_id,
                    name: account.name,
                    mask: account.mask || "",
                    type: account.type,
                    subtype: account.subtype || "",
                    balanceAvailable: account.balances.available || null,
                    balanceCurrent: account.balances.current || 0,
                    isoCurrencyCode: account.balances.iso_currency_code || "EUR",
                },
            });
        }
    } catch (error) {
        return {
            error: "Impossible de synchroniser les comptes. Veuillez réessayer.",
        };
    }
}

export const syncTransactions = async (accessToken: string) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const startDate = thirtyDaysAgo.toISOString().split("T")[0];
        const endDate = now.toISOString().split("T")[0];

        const transactionsResponse = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: startDate,
            end_date: endDate,
        });

        const transactions = transactionsResponse.data.transactions;

        const accounts = await prisma.plaidAccount.findMany({
            where: {
                item: {
                    accessToken,
                },
            },
        });

        const accountMap = new Map(accounts.map(account => [account.accountId, account.id]));

        for (const transaction of transactions) {
            const dbAccountId = accountMap.get(transaction.account_id);

            if (!dbAccountId) continue;

            const locationJson = transaction.location ? JSON.parse(JSON.stringify(transaction.location)) : null;

            await prisma.plaidTransaction.upsert({
                where: { transactionId: transaction.transaction_id },
                update: {
                    amount: transaction.amount,
                    date: new Date(transaction.date),
                    name: transaction.name,
                    merchantName: transaction.merchant_name,
                    category: transaction.category || [],
                    location: locationJson,
                    paymentChannel: transaction.payment_channel,
                    isoCurrencyCode: transaction.iso_currency_code || "EUR",
                    pending: transaction.pending,
                },
                create: {
                    accountId: dbAccountId,
                    transactionId: transaction.transaction_id,
                    amount: transaction.amount,
                    date: new Date(transaction.date),
                    name: transaction.name,
                    merchantName: transaction.merchant_name,
                    category: transaction.category || [],
                    location: locationJson,
                    paymentChannel: transaction.payment_channel,
                    isoCurrencyCode: transaction.iso_currency_code || "EUR",
                    pending: transaction.pending,
                },
            });
        }
    } catch (error) {
        return {
            error: "Impossible de synchroniser les transactions. Veuillez réessayer.",
        };
    }
}

export const getUserBankAccounts = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const accounts = await prisma.plaidAccount.findMany({
            where: {
                item: {
                    userId: session.user.id,
                },
            },
            include: {
                item: {
                    select: {
                        institutionName: true,
                    },
                },
            },
        });

        return {
            data: accounts,
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer les comptes bancaires. Veuillez réessayer."
        }
    }
}

export const getUserTransactions = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const transactions = await prisma.plaidTransaction.findMany({
            where: {
                account: {
                    item: {
                        userId: session.user.id,
                    },
                },
            },
            orderBy: {
                date: "desc"
            },
            take: 20,
            include: {
                account: true,
            },
        });

        return {
            data: transactions,
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer vos transactions. Veuillez réessayer.",
        };
    }
}