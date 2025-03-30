"use client";

import { activate } from "@/actions/authentication";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

const ActivatePage = ({ params }: { params: { token: string } }) => {
    const router = useRouter();
    const { token } = params;
    
    const activateUser = useCallback(async () => {
        const result = await activate(token);
        console.log(result)

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Activation de votre compte échouée !",
                description: result.error,
            });
        } else {
            toast({
                title: "Activation de votre réussie !",
                description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
            });
        }

        router.push("/login");
    }, [router, token]);

    useEffect(() => {
        activateUser();
    }, [activateUser]);

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
    )
}

export default ActivatePage;