import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "./form";

const LoginPage = () => {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Se connecter</CardTitle>
                <CardDescription>Remplissez les champs ci-dessous pour vous connecter à votre compte.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
    );
}

export default LoginPage;