import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const TravelBudget = ({ travel }: { travel: Travel }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Liste du budget</CardTitle>
            </CardHeader>
        </Card>
    );
}

export default TravelBudget;