"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { TravelSchema } from "@/schemas";
import { getServerSession } from "next-auth";

export const getTravels = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const travels = await prisma.travel.findMany({
            where: { userId: session.user.id }
        });

        return {
            data: travels
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer vos voyages. Veuillez réessayer plus tard.",
        };
    }
};

export const filterTravels = async (title: string, status: string, order: "asc" | "desc") => {
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
                userId: session.user.id,
                title: { contains: title, mode: "insensitive" },
                ...dateFilter
            },
            orderBy: {
                startDate: order,
            }
        });

        await pusherServer.trigger(
            `user-${session.user.id}`,
            "travels:update-list",
            travels,
        );

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

        console.log(dateRange);

        const newTravel = await prisma.travel.create({
            data: {
                title,
                startDate: dateRange.from ? dateRange.from.toISOString() : null,
                endDate: dateRange.to ? dateRange.to.toISOString() : null,
                userId: session.user.id,
            },
        });

        return {
            data: newTravel,
        };
    } catch (error) {
        return {
            error: "Impossible d'ajouter votre voyage. Veuillez réessayer plus tard.",
        };
    }
};