"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";

export const addParticipant = async (travelId: string, participantName: string) => {
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
                error: "Le voyage que vous tentez de rejoindre n'existe pas.",
            };
        }

        if (travel.userId !== session.user.id) {
            return {
                error: "Vous n'avez pas l'autorisation d'ajouter des participants à ce voyage.",
            };
        }

        const participant = await prisma.user.findUnique({
            where: { name: participantName },
        });

        if (!participant) {
            return {
                error: "L'utilisateur avec ce nom n'existe pas.",
            };
        }

        if (participant.name === session.user.name) {
            return {
                error: "Vous ne pouvez pas vous ajouter vous-même au voyage.",
            };
        }

        const existingParticipant = await prisma.participant.findUnique({
            where: {
                userId_travelId: {
                    userId: participant.id,
                    travelId: travelId,
                },
            },
        });

        if (existingParticipant) {
            return {
                error: "Cet utilisateur est déjà un participant à ce voyage.",
            };
        }

        const newParticipant = await prisma.participant.create({
            data: {
                userId: participant.id,
                travelId: travelId,
            },
        });

        await pusherServer.trigger(
            `travel-${travel.id}`,
            "travel:new-participant",
            newParticipant,
        );

        const participants = [...travel.participants.map(p => p.userId), participant.id];
        await Promise.all(
            participants.map(async (participant) => {
                await pusherServer.trigger(
                    `user-${participant}`,
                    "travels:update-list",
                    newParticipant
                );
            })
        );

        return {
            data: newParticipant,
        };
    } catch (error) {
        return {
            error: "Impossible d'ajouter le participant. Veuillez réessayer plus tard.",
        };
    }
};

export const getParticipants = async (travelId: string) => {
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
                error: "Vous n'avez pas l'autorisation d'accéder à cette liste de participants.",
            };
        }

        return {
            data: travel.participants.map(participant => ({
                id: participant.user.id,
                name: participant.user.name
            })),
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer les participants du voyage. Veuillez réessayer.",
        };
    }
}

export const deleteParticipant = async (travelId: string, participantId: string) => {
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
                error: "Le voyage que vous tentez d'utiliser n'existe pas.",
            };
        }

        if (travel.userId !== session.user.id) {
            return {
                error: "Vous n'avez pas l'autorisation de supprimer un participant de ce voyage.",
            };
        }

        const participant = await prisma.participant.findUnique({
            where: {
                userId_travelId: {
                    userId: participantId,
                    travelId: travelId,
                },
            },
        });

        if (!participant) {
            return {
                error: "Le participant que vous tentez de supprimer n'existe pas.",
            }
        }

        await prisma.participant.delete({
            where: {
                userId_travelId: {
                    userId: participantId,
                    travelId: travelId,
                },
            },
        });

        await pusherServer.trigger(
            `travel-${travelId}`,
            "participants:delete",
            null
        );

        return {
            data: "Le participant a été supprimé avec succès.",
        };
    } catch (error) {
        return {
            error: "Impossible de supprimer le participant. Veuillez réessayer plus tard.",
        };
    }
}