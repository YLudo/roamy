import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BankAccountsInformations = () => {
    return (
        <Card className="bg-primary">
            <CardHeader>
                <CardTitle className="text-muted">Mon compte</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-4 rounded-lg">
                <div className="flex flex-col gap-2">
                    <h2 className="text-base font-bold text-muted">Plaid Checking</h2>
                    <p className="text-sm text-muted">
                        Plaid Gold Standard 0% Interest Checking
                    </p>
                    <p className="text-sm font-semibold tracking-[1.1px] text-muted">
                        ●●●● ●●●● ●●●● 0000
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default BankAccountsInformations;