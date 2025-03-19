import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface BankAccountsTransactionsTableProps {
    transactions: IPlaidTransaction[];
    isLoading: boolean;
}

const BankAccountsTransactionsTable = ({ transactions, isLoading }: BankAccountsTransactionsTableProps) => {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date));
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency || 'EUR'
        }).format(Math.abs(amount));
    };

    if (isLoading) {
        return <Skeleton className="w-full h-[300px] rounded-xl" />
    }

    if (transactions.length <= 0) {
        return (
            <div className="lg:col-span-2 mt-4 h-fit text-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">Aucune transactions disponible !</p>
            </div>
        );
    }

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
                {transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-muted/50">
                        <TableCell className="max-w-[250px]">
                            <div className="font-medium truncate">{transaction.merchantName || transaction.name}</div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1.5">
                                {transaction.amount < 0 ? (
                                    <ArrowUpIcon className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                    <ArrowDownIcon className="w-3.5 h-3.5 text-red-500" />
                                )}
                                <span className={`font-medium ${transaction.amount < 0 ? "text-green-500" : "text-red-500"}`}>
                                    {formatAmount(transaction.amount, transaction.isoCurrencyCode)}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={transaction.pending ? "secondary" : "default"}
                                className={!transaction.pending ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                            >
                                {transaction.pending ? "En attente" : "Validé"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(transaction.date)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default BankAccountsTransactionsTable;