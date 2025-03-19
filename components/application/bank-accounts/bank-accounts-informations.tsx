import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface BankAccountsInformationsProps {
    account: IPlaidAccount | null;
    isLoading: boolean;
}

const BankAccountsInformations = ({ account, isLoading }: BankAccountsInformationsProps) => {
    if (isLoading) {
        return <Skeleton className="w-full h-[150px] rounded-xl" />
    }

    return (
        <Card className="bg-primary">
            <CardHeader>
                <CardTitle className="text-muted">Mon compte</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-4 rounded-lg">
                {account ? (
                    <div className="flex flex-col gap-2">
                        <h2 className="text-base font-bold text-muted">{account.item.institutionName}</h2>
                        <p className="text-sm text-muted">
                            {account.name}
                        </p>
                        <p className="text-sm font-semibold tracking-[1.1px] text-muted">
                            {account.mask ? `●●●● ●●●● ●●●● ${account.mask}` : 'Compte connecté via Plaid'}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <h2 className="text-base font-bold text-muted">Aucun compte connecté !</h2>
                        <p className="text-sm text-muted">Utilisez le bouton "Ajouter un compte" pour connecter votre banque.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default BankAccountsInformations;