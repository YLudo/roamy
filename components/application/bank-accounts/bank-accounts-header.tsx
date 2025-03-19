import PlaidLinkButton from "@/components/layout/plaid-link";

const BankAccountsHeader = () => {
    return (
        <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Comptes bancaires</h1>
            <PlaidLinkButton />
        </div>
    );
}

export default BankAccountsHeader;