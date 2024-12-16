import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const TravelDocuments = ({ travel }: { travel: Travel }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Liste des documents</CardTitle>
            </CardHeader>
        </Card>
    );
}

export default TravelDocuments;