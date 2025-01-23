"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
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