"use server";

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { ActivitySchema } from "@/schemas";
import { getServerSession } from "next-auth"

export const addActivity = async (travelId: string, values: any) => {
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
                error: "Vous n'avez pas l'autorisation d'ajouter une activité à ce voyage.",
            };
        }

        const validatedFields = ActivitySchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: "Les informations fournies sont invalides. Veuillez vérifier vos saisies.",
            };
        }

        const { title, description, address, date } = validatedFields.data;

        const newActivity = await prisma.activity.create({
            data: {
                title,
                description,
                address,
                date: date ? date.toISOString() : null,
                travelId
            },
        });

        await pusherServer.trigger(
            `travel-${travelId}`,
            "travel:new-acitvity",
            newActivity,
        );

        return {
            data: newActivity,
        };
    } catch (error) {
        console.log(error);
        return {
            error: "Impossible d'ajouter une activité au voyage. Veuillez réessayer.",
        };
    }
}