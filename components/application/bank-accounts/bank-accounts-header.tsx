import { Button } from "@/components/ui/button"

const BankAccountsHeader = () => {
    return (
        <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Comptes bancaires</h1>
            <Button>Ajouter un compte</Button>
        </div>
    );
}

export default BankAccountsHeader;