"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(async () => {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false
            });

            if (result?.error) {
                toast({
                    variant: "destructive",
                    title: "Connexion échouée !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Connexion réussie !",
                    description: "Vous vous êtes connecté avec succès.",
                });
                form.reset();
                router.push("/");
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresse e-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="Entrez votre adresse e-mail" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Entrez votre mot de passe" {...field} />         
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Se connecter</Button>
                <p className="text-sm text-center">Vous n'avez pas de compte ? <Link href="/register" className="text-primary">Inscrivez-vous</Link></p>
            </form>
        </Form>
    );
}

export default LoginForm;