"use client";

import { addExpense } from "@/actions/expenses";
import { getTravels } from "@/actions/travels";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { TransactionExpenseSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseCategory } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface BankAccountAddBudgetProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    transaction: IPlaidTransaction;
}

const BankAccountAddBudget = ({
    isModalOpen,
    setIsModalOpen,
    transaction
}: BankAccountAddBudgetProps) => {
    const [travels, setTravels] = useState<ITravel[]>([]);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof TransactionExpenseSchema>>({
        resolver: zodResolver(TransactionExpenseSchema),
        defaultValues: {
            title: transaction.merchantName || transaction.name || "",
            category: ExpenseCategory.OTHER,
            amount: Math.abs(transaction.amount),
            date: new Date(),
            travelId: "",
        }
    });

    const fetchTravels = useCallback(() => {
        startTransition(async () => {
            const result = await getTravels("", "", "desc");

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setTravels(result.data);
            }
        });
    }, []);

    useEffect(() => {
        fetchTravels();
    }, []);

    const onSubmit = async (values: z.infer<typeof TransactionExpenseSchema>) => {
        startTransition(async () => {
            const result = await addExpense(values.travelId, values);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Ajout de la dépense échoué !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Ajout de la dépense réussi !",
                    description: "Votre dépense a été créée avec succès.",
                });
                form.reset();
                setIsModalOpen(false);
            }
        });
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter une dépense à un voyage</DialogTitle>
                    <DialogDescription>
                        Remplissez les détails de votre dépense ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="travelId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Voyage de la dépense</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez un voyage" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {travels.map((travel) => (
                                                <SelectItem key={travel.id} value={travel.id}>
                                                    {travel.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre de la dépense</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Entrez le titre de la dépense..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catégorie de la dépense</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACCOMODATION">Hébergement</SelectItem>
                                                <SelectItem value="MEAL">Repas</SelectItem>
                                                <SelectItem value="ACTIVITY">Activité</SelectItem>
                                                <SelectItem value="TRANSPORT">Transport</SelectItem>
                                                <SelectItem value="OTHER">Autre</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Montant de la dépense</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            {...field} 
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date de la dépense</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "pl-3 text-left font-normal w-full",
                                                        !field.value &&
                                                        "text-muted-foreground"
                                                    )}
                                                >
                                                    { field.value 
                                                        ? format(field.value, "PPP", { locale: fr })
                                                        : <span>Choisissez une date</span>
                                                    }
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                initialFocus
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                locale={fr}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="mt-2 self-end"
                                        onClick={() => form.setValue("date", undefined)}
                                    >
                                        Réinitialiser la date
                                    </Button>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                                    Chargement...
                                </>
                            ) : "Ajouter au voyage"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default BankAccountAddBudget;