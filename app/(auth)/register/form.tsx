"use client";

import { register } from "@/actions/authentication";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterForm = () => {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        startTransition(async () => {
            const result = await register(values);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Inscription échouée !",
                    description: result.error,
                });
            } else if (result.success) {
                toast({
                    title: "Inscription réussie !",
                    description: result.success,
                });
                form.reset();
                router.push("/login");
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom d'utilisateur</FormLabel>
                            <FormControl>
                                <Input placeholder="Entrez votre nom d'utilisateur" {...field} />         
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                <Button type="submit" className="w-full">S'inscrire</Button>
                <p className="text-sm text-center">Vous avez déjà un compte ? <Link href="/login" className="text-primary">Connectez-vous</Link></p>
            </form>
        </Form>
    );
}

export default RegisterForm;