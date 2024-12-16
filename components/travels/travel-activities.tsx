import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const TravelActivites = ({ travel }: { travel: Travel }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Liste des activités</CardTitle>
            </CardHeader>
        </Card>
    );
}

export default TravelActivites;