import BankAccountsBalance from "./bank-accounts-balance";
import BankAccountsHeader from "./bank-accounts-header";
import BankAccountsHistory from "./bank-accounts-history";
import BankAccountsInformations from "./bank-accounts-informations";

const BankAccountsLayout = () => {
    return (
        <section className="mt-4">
            <BankAccountsHeader />
            <div className="grid lg:grid-cols-3 mt-4 gap-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-4">
                    <BankAccountsInformations />
                    <BankAccountsBalance />
                </div>
                <div className="lg:col-span-2">
                    <BankAccountsHistory />
                </div>
            </div>
        </section>
    );
}

export default BankAccountsLayout;