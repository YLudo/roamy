import { Construction } from "lucide-react";

const MaintenancePage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto px-4 space-y-8 text-center">
                <div className="space-y-6">
                    <Construction className="mx-auto h-16 w-16 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        Oops, nous avons fait nos valises un peu trop vite !
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        On est en train de réorganiser notre itinéraire pour que tout soit prêt à décoller !
                        Pas d'inquiétude, on revient très vite avec une plateforme encore plus incroyable.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;