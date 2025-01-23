"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";

export async function getTravels() {
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

export async function filterTravels(title: string, status: string, order: "asc" | "desc") {
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