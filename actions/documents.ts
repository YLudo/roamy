"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { DocumentSchema } from "@/schemas";
import { getServerSession } from "next-auth";

export const addDocument = async (travelId: string, values: any) => {
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
                error: "Vous n'avez pas l'autorisation d'ajouter un document à ce voyage.",
            };
        }

        const validatedFields = DocumentSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: "Les informations fournies sont invalides. Veuillez vérifier vos saisies.",
            };
        }

        const { title, description } = validatedFields.data;

        const newDocument = await prisma.document.create({
            data: {
                title,
                description,
                url: "",
                travelId,
            },
        });

        await pusherServer.trigger(
            `travel-${travelId}`,
            "travel:new-document",
            newDocument,
        );

        return {
            data: newDocument,
        }
    } catch (error) {
        return {
            error: "Impossible d'ajouter un document à ce voyage. Veuillez réessayer.",
        };
    }
}

export const getDocuments = async (
    travelId: string,
    titleFilter: string,
) => {
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

        const whereClause: any = {
            travelId,
            title: { contains: titleFilter, mode: "insensitive" },
        };

        const documents = await prisma.document.findMany({
            where: whereClause
        });

        return {
            data: documents,
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer les documents du voyage. Veuillez réessayer.",
        }
    }
}