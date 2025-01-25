import { useState } from "react";
import TravelCreateModal from "../create/travel-create-modal";

const TravelHeader = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    return (
        <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Mes voyages</h1>
            <TravelCreateModal 
                isCreateModalOpen={isCreateModalOpen} 
                setIsCreateModalOpen={setIsCreateModalOpen} 
            />
        </div>
    );
}

export default TravelHeader;