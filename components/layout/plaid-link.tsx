"use client";

import { createLinkToken, exchangePublicToken, getUserBankAccounts } from "@/actions/plaid";
import { usePlaidLink } from "react-plaid-link";
import { toast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const PlaidLinkButton = () => {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [hasAccount, setHasAccount] = useState<boolean>(false);

    const checkExistingAccounts = () => {
        startTransition(async () => {
            const result = await getUserBankAccounts();

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: "Impossible de vérifier vos comptes.",
                });
            } else {
                if (Array.isArray(result.data) && result.data.length > 0) {
                    setHasAccount(true);
                }
            }
        })
    }

    const generateLinkToken = useCallback(async () => {
        startTransition(async () => {
            const result = await createLinkToken();

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: "Impossible de créer le lien avec votre banque.",
                });
            } else if (result.data) {
                setLinkToken(result.data);
            }
        });
    }, []);

    const onSuccess = useCallback(async (publicToken: string) => {
        startTransition(async () => {
            const result = await exchangePublicToken(publicToken);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Compte bancaire connecté !",
                    description: "Votre compte bancaire a été connecté avec succès.",
                });
                setHasAccount(true);
            }
        })
    }, []);

    const onExit = useCallback((error) => {
        if (error) {
            toast({
                variant: "destructive",
                title: "Oups !",
                description: error.display_message || "Une erreur s'est produite lors de la connexion à votre banque.",
            });
        }
        
        if (error && error.error_code === 'INVALID_LINK_TOKEN') {
            setLinkToken(null);
        }
    }, []);

    useEffect(() => {
        checkExistingAccounts();
    }, [])

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess,
        onExit,
        language: "fr",
    });

    const handleClick = useCallback(async () => {
        if (linkToken) {
            open();
        } else {
            await generateLinkToken();
        }
    }, [linkToken, open, generateLinkToken]);

    if (hasAccount) {
        return (
            <Button disabled>
                Compte déjà connecté
            </Button>
        );
    }

    return (
        <Button
            onClick={handleClick}
            disabled={isPending || (!!linkToken && !ready)}
        >
            {isPending ? (
                <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Chargement...
                </>
            ) : "Ajouter un compte"}
        </Button>
    )
}

export default PlaidLinkButton;