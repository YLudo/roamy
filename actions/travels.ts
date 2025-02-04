"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { TravelSchema } from "@/schemas";
import { getServerSession } from "next-auth";

export const getTravels = async (title: string, status: string, order: "asc" | "desc") => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const now = new Date().toISOString();
        let dateFilter = {};

        switch(status) {
            case "non_planned":
                dateFilter = { startDate: null };
                break;
            case "upcoming":
                dateFilter = { startDate: { gt: now } };
                break;
            case "ongoing":
                dateFilter = {
                    startDate: { lte: now },
                    endDate: { gte: now },
                };
                break;
            case "completed":
                dateFilter = { endDate: { lt: now } };
                break;
            default:
                dateFilter = {};
                break;
        }

        const travels = await prisma.travel.findMany({
            where: {
                OR: [
                    { userId: session.user.id },
                    { participants: { some: { userId: session.user.id } } },
                ],
                title: { contains: title, mode: "insensitive" },
                ...dateFilter
            },
            orderBy: {
                startDate: order,
            },
            include: { participants: { include: { user: true } } },
        });

        return {
            data: travels
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer vos voyages. Veuillez réessayer plus tard.",
        };
    }
}

export const addTravel = async (values: any) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const validatedFields = TravelSchema.safeParse(values);
    
        if (!validatedFields.success) {
            return {
                error: "Les informations fournies sont invalides. Veuillez vérifier vos saisies.",
            };
        }
        
        const { title, dateRange } = validatedFields.data;

        const newTravel = await prisma.travel.create({
            data: {
                title,
                startDate: dateRange.from ? dateRange.from.toISOString() : null,
                endDate: dateRange.to ? dateRange.to.toISOString() : null,
                userId: session.user.id,
            },
        });

        await pusherServer.trigger(
            `user-${session.user.id}`,
            "travels:new",
            newTravel
        );

        return {
            data: newTravel,
        };
    } catch (error) {
        return {
            error: "Impossible d'ajouter votre voyage. Veuillez réessayer plus tard.",
        };
    }
};

export const getTravel = async (travelId: string) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const travel = await prisma.travel.findUnique({
            where: { id: travelId },
            include: { participants: { include: { user: true } } },
        });

        if (!travel) {
            return {
                error: "Le voyage que vous recherchez n'existe pas.",
            };
        }

        const isOwner = travel.userId === session.user.id;
        const isParticipant = travel.participants.some(participant => participant.user.id === session.user.id);

        if (!isOwner && !isParticipant) {
            return {
                error: "Vous n'avez pas l'autorisation d'accéder à ce voyage.",
            };
        }

        return {
            data: travel,
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer votre voyage. Veuillez réessayer plus tard."
        };
    }
}

export const updateTravel = async (travelId: string, values: any) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const validatedFields = TravelSchema.safeParse(values);
    
        if (!validatedFields.success) {
            return {
                error: "Les informations fournies sont invalides. Veuillez vérifier vos saisies.",
            };
        }

        const { title, dateRange } = validatedFields.data;

        const travel = await prisma.travel.findUnique({
            where: { id: travelId },
            include: { participants: true },
        });

        if (!travel) {
            return {
                error: "Le voyage que vous tentez de modifier n'existe pas.",
            };
        }

        if (travel.userId !== session.user.id) {
            return {
                error: "Vous n'avez pas l'autorisation de modifier ce voyage.",
            };
        }

        const updatedTravel = await prisma.travel.update({
            where: { id: travelId },
            data: {
                title,
                startDate: dateRange.from ? dateRange.from.toISOString() : null,
                endDate: dateRange.to ? dateRange.to.toISOString() : null,
            },
        });

        await pusherServer.trigger(
            `travel-${travel.id}`,
            "travel:update",
            updatedTravel
        );

        const participants = travel.participants.map(p => p.userId);
        await Promise.all(
            participants.map(async (participant) => {
                await pusherServer.trigger(
                    `user-${participant}`,
                    "travels:update-list",
                    updatedTravel
                );
            })
        );

        return {
            data: updatedTravel,
        };
    } catch (error) {
        return {
            error: "Impossible de modifier votre voyage. Veuillez réessayer plus tard.",
        };
    }
}

export const deleteTravel = async (travelId: string) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const travel = await prisma.travel.findUnique({
            where: { id: travelId },
            include: { participants: true },
        });

        if (!travel) {
            return {
                error: "Le voyage que vous tentez de supprimer n'existe pas.",
            };
        }

        if (travel.userId !== session.user.id) {
            return {
                error: "Vous n'avez pas l'autorisation de supprimer ce voyage.",
            };
        }

        await prisma.travel.delete({
            where: { id: travelId },
        });

        const participants = travel.participants.map(p => p.userId);
        await Promise.all(
            participants.map(async (participant) => {
                await pusherServer.trigger(
                    `user-${participant}`,
                    "travels:update-list",
                    null
                );
            })
        );

        return {
            data: "Le voyage a été supprimé avec succès.",
        };
    } catch (error) {
        return {
            error: "Impossible de supprimer votre voyage. Veuillez réessayer plus tard.",
        };
    }
}