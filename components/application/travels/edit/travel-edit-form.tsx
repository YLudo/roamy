"use client";

import { updateTravel } from "@/actions/travels";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { TravelSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TravelEditFormProps {
    travel: ITravel;
    setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelEditForm = ({ travel, setIsEditModalOpen }: TravelEditFormProps) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof TravelSchema>>({
        resolver: zodResolver(TravelSchema),
        defaultValues: {
            title: travel.title,
            dateRange: {
                from: travel.startDate ? new Date(travel.startDate) : undefined,
                to: travel.endDate ? new Date(travel.endDate) : undefined,
            }
        },
    });

    const onSubmit = async (values: z.infer<typeof TravelSchema>) => {
        startTransition(async () => {
            const result = await updateTravel(travel.id, values);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Modification du voyage échoué !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Modification du voyage réussi !",
                    description: "Votre voyage a été modifié avec succès.",
                });
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
                            <FormLabel>Titre du voyage</FormLabel>
                            <FormControl>
                                <Input placeholder="Entrez le titre du voyage..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Période du voyage</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "pl-3 text-left font-normal w-full",
                                                !field.value?.from &&
                                                !field.value?.to &&
                                                "text-muted-foreground"
                                            )}
                                        >
                                            {field.value?.from ? (
                                                field.value.to ? (
                                                    <>
                                                        {format(
                                                            field.value.from,
                                                            "PPP",
                                                            { locale: fr }
                                                        )}{" "}
                                                        -{" "}
                                                        {format(
                                                            field.value.to,
                                                            "PPP",
                                                            { locale: fr }
                                                        )}
                                                    </>
                                                ) : (
                                                    format(
                                                        field.value.from,
                                                        "PPP",
                                                        { locale: fr }
                                                    )
                                                )
                                            ) : (
                                                <span>Choisissez une période</span>
                                            )}
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
                                        mode="range"
                                        selected={field.value as DateRange}
                                        onSelect={(range) => field.onChange(range)}
                                        disabled={(date) => date < new Date()}
                                        numberOfMonths={2}
                                        locale={fr}
                                    />
                                </PopoverContent>
                            </Popover>
                            <Button
                                type="button"
                                variant="ghost"
                                className="mt-2 self-end"
                                onClick={() => form.setValue("dateRange", { from: undefined, to: undefined })}
                            >
                                Réinitialiser les dates
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
                    ) : "Modifier votre voyage"}
                </Button>
            </form>
        </Form>
    );
}

export default TravelEditForm;