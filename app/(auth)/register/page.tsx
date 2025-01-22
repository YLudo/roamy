import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RegisterForm from "./form";

const RegisterPage = () => {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>S'inscrire</CardTitle>
                <CardDescription>Remplissez les champs ci-dessous pour vous créer un compte.</CardDescription>
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
        </Card>
    );
}

export default RegisterPage;