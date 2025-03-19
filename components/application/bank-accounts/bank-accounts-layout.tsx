"use client";

import { useEffect, useState, useTransition } from "react";
import BankAccountsBalance from "./bank-accounts-balance";
import BankAccountsHeader from "./bank-accounts-header";
import BankAccountsHistory from "./bank-accounts-history";
import BankAccountsInformations from "./bank-accounts-informations";
import { getUserBankAccounts } from "@/actions/plaid";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";

const BankAccountsLayout = () => {
    const { data: session } = useSession();

    const [accounts, setAccounts] = useState<IPlaidAccount[]>([]);
    const [isPending, startTransition] = useTransition();

    const fetchAccounts = () => {
        startTransition(async () => {
            const result = await getUserBankAccounts();

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (Array.isArray(result.data)) {
                const mappedAccounts = result.data.map(account => ({
                    ...account,
                    isCurrencyCode: account.isoCurrencyCode
                }));
                setAccounts(mappedAccounts);
            }
        });
    };

    useEffect(() => {
        if (!session?.user?.id) return;
            const channelName = `user-${session.user.id}`;
            const channel = pusherClient.subscribe(channelName);
    
            channel.bind("bank:new", () => fetchAccounts());
    
            return () => {
                pusherClient.unbind("bank:new");
                pusherClient.unsubscribe(channelName);
            };
    }, [])

    useEffect(() => {
        fetchAccounts();
    }, []);
    
    return (
        <section className="mt-4">
            <BankAccountsHeader />
            <div className="grid lg:grid-cols-3 mt-4 gap-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-4 h-fit">
                    <BankAccountsInformations
                        account={accounts.length > 0 ? accounts[0] : null} 
                        isLoading={isPending} 
                    />
                    <BankAccountsBalance 
                        accounts={accounts} 
                        isLoading={isPending} 
                    />
                </div>
                <div className="lg:col-span-2">
                    <BankAccountsHistory />
                </div>
            </div>
        </section>
    );
}

export default BankAccountsLayout;