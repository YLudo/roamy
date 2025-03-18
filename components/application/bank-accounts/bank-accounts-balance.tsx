import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BankAccountsBalance = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Solde actuel</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-4xl font-bold">
                    1200.00€
                </p>
            </CardContent>
        </Card>
    );
}

export default BankAccountsBalance;