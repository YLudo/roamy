import { addDocument } from "@/actions/documents"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { DocumentSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const TravelDocumentsForm = ({ travelId }: { travelId: string }) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof DocumentSchema>>({
        resolver: zodResolver(DocumentSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof DocumentSchema>) => {
        startTransition(async () => {
            const result = await addDocument(travelId, values);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Ajout du document échoué !",
                    description: result.error,
                });
            } else {
                toast({
                    title: "Ajout du document réussi !",
                    description: "Votre document a été créé avec succès.",
                });
                form.reset();
            }
        });
    }

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Ajouter un document</CardTitle>
            </CardHeader>
            <CardContent>
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
                            ) : "Ajouter un document"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default TravelDocumentsForm;