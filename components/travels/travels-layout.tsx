"use client";

import { Button } from "@/components/ui/button";
import TravelCard from "./travel-card";
import TravelsFilters from "./travels-filters";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import TravelCreateForm from "./travel-create-form";

const TravelsLayout = ({ travels }: { travels: Travel[] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="mt-6">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-xl">Mes voyages</h1>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button>Créer un voyage</Button>
                    </DialogTrigger>
                    <DialogContent className="sm: max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Créer un nouveau voyage</DialogTitle>
                            <DialogDescription>
                                Remplissez les détails de votre nouveau voyage ci-dessous.
                            </DialogDescription>
                        </DialogHeader>
                        <TravelCreateForm onSuccess={() => setIsModalOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
            <TravelsFilters />
            {travels.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
                    {travels.map((travel: Travel) => (
                        <TravelCard
                            key={travel.id}
                            id={travel.id}
                            name={travel.name}
                            startDate={travel.startDate}
                            endDate={travel.endDate}
                            destination={travel.destination}
                            image={travel.image}
                            status={travel.status}
                            participants={travel.participants}
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-4 text-center py-8 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Vous n'avez pas encore de voyage planifié.</p>
                    <p className="text-muted-foreground">Cliquez sur "Créer un voyage" pour commencer votre aventure !</p>
                </div>
            )}
        </section>
    );
}

export default TravelsLayout;