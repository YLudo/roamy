"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { PollSchema } from "@/schemas";
import { getServerSession } from "next-auth";

export const getPolls = async (travelId: string) => {
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
                error: "Vous n'avez pas l'autorisation de récupérer les activités de ce voyage.",
            };
        }

        const polls = await prisma.poll.findMany({
            where: { travelId },
            include: { 
                pollOptions: {
                    include: { votes: { include: { user: true } } },
                }, 
                user: true 
            }
        });

        return {
            data: polls,
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer les sondages. Veuillez réessayer."
        }
    }
}

export const addPoll = async (travelId: string, values: any) => {
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
                error: "Vous n'avez pas l'autorisation de récupérer les activités de ce voyage.",
            };
        }

        const validatedFields = PollSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: "Les informations fournies sont invalides. Veuillez vérifier vos saisies.",
            };
        }

        const { title, description, pollOptions } = validatedFields.data;

        const newPoll = await prisma.poll.create({
            data: {
                title,
                description,
                travelId,
                userId: session.user.id,
                pollOptions: {
                    createMany: {
                        data: pollOptions.map((option : { text: string }) => ({
                            text: option.text,
                        })),
                    },
                }
            }
        });

        await pusherServer.trigger(
            `travel-${travelId}`,
            "travel:new-poll",
            newPoll,
        );

        return {
            data: newPoll,
        };
    } catch (error) {
        return {
            error: "Impossible de créer le sondage. Veuillez réessayer.",
        };
    }
}