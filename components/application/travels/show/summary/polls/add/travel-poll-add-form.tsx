import { addPoll } from "@/actions/polls";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { PollSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

interface TravelPollAddFormProps {
    travelId: string;
    setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelPollAddForm = ({ travelId, setIsAddModalOpen }: TravelPollAddFormProps) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof PollSchema>>({
        resolver: zodResolver(PollSchema),
        defaultValues: {
            title: "",
            description: "",
            pollOptions: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "pollOptions",
    });

    const onSubmit = async (values: z.infer<typeof PollSchema>) => {
        startTransition(async () => {
            const result = await addPoll(travelId, values);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Ajout du sondage échoué !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Ajout du sondage réussi !",
                    description: "Votre sondage a été créé avec succès.",
                });
            }
            form.reset();
            setIsAddModalOpen(false);
        })
    }

    const addOption = () => {
        append({ text: "" });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre du sondage</FormLabel>
                            <FormControl>
                                <Input placeholder="Entrez le titre du sondage..." {...field} />
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
                                <Textarea placeholder="Entrez la description du sondage..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <FormLabel>Options du sondage</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addOption}
                            className="h-8"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une option
                        </Button>
                    </div>
                    {fields.map((field, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name={`pollOptions.${index}.text`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                placeholder={`Option ${index + 1}`}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {fields.length > 2 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="h-10 w-10 text-destructive hover:text-destructive/90"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    {form.formState.errors.pollOptions?.message && (
                        <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.pollOptions?.message}
                        </p>
                    )}
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 size={20} className="animate-spin" /> &nbsp;
                            Chargement...
                        </>
                    ) : "Ajouter le sondage"}
                </Button>
            </form>
        </Form>
    );
}

export default TravelPollAddForm;