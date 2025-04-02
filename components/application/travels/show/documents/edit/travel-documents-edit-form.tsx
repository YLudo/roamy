import { updateDocument } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { DocumentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TravelDocumentsEditFormProps {
    document: IDocument;
    setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
}

const TravelDocumentsEditForm = ({
    document,
    setIsEditModalOpen
}: TravelDocumentsEditFormProps) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof DocumentSchema>>({
        resolver: zodResolver(DocumentSchema),
        defaultValues: {
            title: document.title,
            description: document.description || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof DocumentSchema>) => {
        startTransition(async () => {
            const result = await updateDocument(document.travelId, document.id, values);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Modification du document échoué !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Modification du document réussie !",
                    description: "Votre document a été modifié avec succès.",
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
                            <FormLabel>Titre du document</FormLabel>
                            <FormControl>
                                <Input placeholder="Entrez le titre du document..." {...field} />
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
                            <FormLabel>Description du document</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Entrez la description du document..." {...field} />
                            </FormControl>
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
                    ) : "Modifier le document"}
                </Button>
            </form>
        </Form>
    );
}

export default TravelDocumentsEditForm;
