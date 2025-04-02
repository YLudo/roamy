import { updateExpense } from "@/actions/expenses";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ExpenseSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TravelExpensesEditFormProps {
    expense: IExpense;
    setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelExpensesEditForm = ({
    expense,
    setIsEditModalOpen
}: TravelExpensesEditFormProps) => {
    const [isPending, startTransition] = useTransition();
    
    const form = useForm<z.infer<typeof ExpenseSchema>>({
        resolver: zodResolver(ExpenseSchema),
        defaultValues: {
            title: expense.title,
            category: expense.category,
            amount: expense.amount,
            date: expense.date ? new Date(expense.date) : undefined,
        },
    });

    const onSubmit = async (values: z.infer<typeof ExpenseSchema>) => {
        startTransition(async () => {
            const result = await updateExpense(expense.travelId, expense.id, values);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Modification de la dépense échouée !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Modification de la dépense réussie !",
                    description: "Votre dépense a été modifiée avec succès.",
                });
                form.reset();
                setIsEditModalOpen(false);
            }
        })
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre de la dépense</FormLabel>
                            <FormControl>
                                <Input placeholder="Entrez le titre de la dépense" {...field} />
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
                    ) : "Modifier la dépense"}
                </Button>
            </form>
        </Form>
    );
}

export default TravelExpensesEditForm;