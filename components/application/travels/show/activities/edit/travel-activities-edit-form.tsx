import { updateActivity } from "@/actions/activities";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ActivitySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TravelActivitiesEditFormProps {
    activity: IActivity;
    setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelActivitiesEditForm = ({
    activity,
    setIsEditModalOpen
}: TravelActivitiesEditFormProps) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ActivitySchema>>({
        resolver: zodResolver(ActivitySchema),
        defaultValues: {
            title: activity.title,
            description: activity.description || "",
            address: activity.address || "",
            date: activity.date ? new Date(activity.date) : undefined,
        },
    });

    const onSubmit = async (values: z.infer<typeof ActivitySchema>) => {
        startTransition(async () => {
            const result = await updateActivity(activity.travelId, activity.id, values);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Modification de l'activité échouée !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Modification de l'activité réussie !",
                    description: "Votre activité a été modifiée avec succès.",
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
                    ) : "Modifier l'activité"}
                </Button>
            </form>
        </Form>
    );
}

export default TravelActivitiesEditForm;