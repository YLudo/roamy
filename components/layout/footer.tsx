import { Separator } from "../ui/separator";

const Footer = () => {
    return (
        <section className="mt-16">
            <div className="container mx-auto px-4">
                <footer>
                    <Separator />
                    <div className="py-8 flex items-center justify-between font-sans">
                        <p className="text-sm text-muted-foreground">
                            Built with ❤️ by Loud.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Roamy. Tous droits réservés.
                        </p>
                    </div>
                </footer>
            </div>
        </section>
    );
}

export default Footer;