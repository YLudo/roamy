import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BankAccountsTransactionsTable from "./bank-accounts-transactions-table";

const BankAccountsHistory = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Liste des transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <BankAccountsTransactionsTable />
            </CardContent>
        </Card>
    );
}

export default BankAccountsHistory;