"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";

export const getMessages = async (travelId: string) => {
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
                            }
                        }
                    }
                }
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
                error: "Vous n'avez pas l'autorisation de récupérer les messages de ce voyage.",
            };
        }

        const messages = await prisma.message.findMany({
            where: { travelId },
        });

        return {
            data: messages,
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer les messages du voyages. Veuillez réessayer.",
        };
    }
}

export const sendMessage = async (travelId: string, text: string) => {
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
                            select: { id: true },
                        },
                    },
                },
            },
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
                error: "Vous n'avez pas l'autorisation d'envoyer des messages pour ce voyage.",
            };
        }

        const message = await prisma.message.create({
            data: {
                text,
                username: session.user.name || "Utilisateur inconnu",
                travelId,
            },
        });

        await pusherServer.trigger(
            `travel-${travelId}`,
            "travel:new-message",
            message,
        );

        return {
            data: message,
        };
    } catch (error) {
        return {
            error: "Impossible d'envoyer le message. Veuillez réessayer.",
        };
    }
}