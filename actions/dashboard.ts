"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export const getNextTravel = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const travels = await prisma.travel.findMany({
            where: { userId: session.user.id },
            orderBy: { startDate: "asc" },
        });

        if (travels.length === 0) {
            return {
                data: null,
            };
        }

        return {
            data: travels[0],
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer vos voyages. Veuillez réessayer plus tard.",
        };
    }
}