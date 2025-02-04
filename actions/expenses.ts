"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { ExpenseSchema } from "@/schemas";
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
            data: totalExpenses
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer les dépenses du voyage. Veuillez réessayer.",
        };
    }
}

export const addExpense = async (travelId: string, values: any) => {
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
                error: "Vous n'avez pas l'autorisation d'ajouter une dépense à ce voyage.",
            };
        }

        const validatedFields = ExpenseSchema.safeParse(values);
    
        if (!validatedFields.success) {
            return {
                error: "Les informations fournies sont invalides. Veuillez vérifier vos saisies.",
            };
        }
        
        const { category, amount, date } = validatedFields.data;

        const newExpense = await prisma.expense.create({
            data: {
                category,
                amount,
                date: date ? date.toISOString() : null,
                travelId
            },
        });

        await pusherServer.trigger(
            `travel-${travelId}`,
            "travel:new-expense",
            newExpense
        );

        return {
            data: newExpense,
        };
    } catch (error) {
        return {
            error: "Impossible d'ajouter une dépense au voyage. Veuillez réessayer.",
        };
    }
}