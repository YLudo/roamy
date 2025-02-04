"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export const getTotalExpenses = async (travelId: string) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const travel = await prisma.travel.findUnique({
            where: { id: travelId },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                expenses: {
                    select: {
                        amount: true,
                    },
                },
            }
        });

        if (!travel) {
            return {
                error: "Le voyage que vous tentez de consulter n'existe pas.",
            };
        }

        const isOwner = travel.userId === session.user.id;
        const isParticipant = travel.participants.some(participant => participant.user.id === session.user.id);

        if (!isParticipant && !isOwner) {
            return {
                error: "Vous n'avez pas l'autorisation d'accéder à ces dépenses.",
            };
        }

        const totalExpenses = travel.expenses.reduce((sum, expense) => sum + expense.amount, 0);

        return {
            data: {
                totalExpenses,
            }
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer les dépenses du voyage. Veuillez réessayer.",
        };
    }
}