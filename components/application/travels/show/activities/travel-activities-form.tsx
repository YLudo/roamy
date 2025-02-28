import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ActivitySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useTransition } from "react"
import { useForm } from "react-hook-form";
import { z } from "zod";

const TravelActivitiesForm = ({ travelId }: { travelId: string }) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ActivitySchema>>({
        resolver: zodResolver(ActivitySchema),
        defaultValues: {
            title: "",
            description: "",
            address: "",
            date: undefined,
        },
    });

    const onSubmit = async (values: z.infer<typeof ActivitySchema>) => {
        console.log(values);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ajouter une activité</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre de l'activité</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Entrez le titre de l'activité..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description de l'activité</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Entrez la description de l'activité..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse de l'activité</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Entrez l'adresse de l'activité..." {...field} />
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
                                    <FormLabel>Date de l'activité</FormLabel>
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
                            ) : "Ajouter une activité"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default TravelActivitiesForm;