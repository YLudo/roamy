import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

const BankAccountsTransactionsTable = () => {
    const transactions = [
        {
            name: "Réservation Hôtel Mercure Paris",
            amount: "189,50 €",
            isCredit: false,
            status: "Validé",
            date: "15/03/2025",
        },
        {
            name: "Billets d'avion Air France",
            amount: "356,80 €",
            isCredit: false,
            status: "Validé",
            date: "10/03/2025",
        },
        {
            name: "Restaurant Le Petit Bistro",
            amount: "78,25 €",
            isCredit: false,
            status: "En attente",
            date: "18/03/2025",
        },
        {
            name: "Remboursement Thomas",
            amount: "45,00 €",
            isCredit: true,
            status: "Validé",
            date: "12/03/2025",
        },
        {
            name: "Location voiture Europcar",
            amount: "120,75 €",
            isCredit: false,
            status: "Validé",
            date: "16/03/2025",
        },
    ]

    return (
        <Table>
            <TableHeader className="bg-secondary">
                <TableRow>
                    <TableHead className="font-medium text-secondary-foreground">Transaction</TableHead>
                    <TableHead className="font-medium text-secondary-foreground">Montant</TableHead>
                    <TableHead className="font-medium text-secondary-foreground">Status</TableHead>
                    <TableHead className="font-medium text-secondary-foreground">Date</TableHead>
                    </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="max-w-[250px]">
                            <div className="font-medium truncate">{transaction.name}</div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1.5">
                                {transaction.isCredit ? (
                                    <ArrowUpIcon className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                    <ArrowDownIcon className="w-3.5 h-3.5 text-red-500" />
                                )}
                                <span className={`font-medium ${transaction.isCredit ? "text-green-500" : "text-red-500"}`}>
                                    {transaction.isCredit ? transaction.amount : `-${transaction.amount}`}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={transaction.status === "Validé" ? "default" : "secondary"}
                                className={transaction.status === "Validé" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                            >
                                {transaction.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default BankAccountsTransactionsTable;