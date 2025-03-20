"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BankAccountsTransactionsTable from "./bank-accounts-transactions-table";
import { useCallback, useEffect, useState, useTransition } from "react";
import { getUserTransactions } from "@/actions/plaid";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";

const BankAccountsHistory = () => {
    const { data: session } = useSession();
    const [transactions, setTransactions] = useState<IPlaidTransaction[]>([]);
    const [isPending, startTransition] = useTransition();

    const fetchTransactions = useCallback(() => {
        startTransition(async () => {
            const result = await getUserTransactions();

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else {
                setTransactions(result.data);
            }
        });
    }, []);

    useEffect(() => {
        if (!session?.user?.id) return;
        const channelName = `user-${session.user.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("bank:new", () => fetchTransactions());

        return () => {
            pusherClient.unbind("bank:new");
            pusherClient.unsubscribe(channelName);
        };
    }, [fetchTransactions, session?.user.id])

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Liste des transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <BankAccountsTransactionsTable 
                    transactions={transactions}
                    isLoading={isPending}
                />
            </CardContent>
        </Card>
    );
}

export default BankAccountsHistory;