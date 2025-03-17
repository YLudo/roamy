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
        return {
            error: "Impossible d'ajouter une activité au voyage. Veuillez réessayer.",
        };
    }
}

export const getActivities = async (
    travelId: string,
    titleFilter: string,
    dateFilter: "asc" | "desc",
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

        const activities = await prisma.activity.findMany({
            where: whereClause,
            orderBy: {
                date: dateFilter,
            }
        });

        return {
            data: activities,
        };
    } catch (error) {
        return {
            error: "Impossible de récupérer les activités du voyage. Veuillez réessayer.",
        };
    }
}

export const updateActivity = async (travelId: string, activityId: string, values: any) => {
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
                error: "Vous n'avez pas l'autorisation de modifier une activité de ce voyage.",
            };
        }

        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
        });

        if (!activity || activity.travelId !== travelId) {
            return {
                error: "L'activité que vous tentez de modifier n'existe pas.",
            };
        }

        const validatedFields = ActivitySchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: "Les informations fournies sont invalides. Veuillez vérifier vos saisies.",
            };
        }

        const { title, description, address, date } = validatedFields.data;

        const updatedActivity = await prisma.activity.update({
            where: { id: activityId },
            data: {
                title,
                description: description || null,
                address: address || null,
                date: date ? date.toISOString() : null,
            },
        });

        await pusherServer.trigger(
            `travel-${travelId}`,
            "travel:update-activity",
            updatedActivity,
        );

        return {
            data: updatedActivity,
        };
    } catch (error) {
        return {
            error: "Impossible de modifier l'activité. Veuillez réessayer plus tard.",
        };
    }
}

export const deleteActivity = async (travelId: string, activityId: string) => {
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
                error: "Vous n'avez pas l'autorisation de supprimer une activité de ce voyage.",
            };
        }

        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
        });

        if (!activity || activity.travelId !== travelId) {
            return {
                error: "L'activité que vous tentez de supprimer n'existe pas.",
            };
        }

        await prisma.activity.delete({
            where: { id: activityId }
        });

        await pusherServer.trigger(
            `travel-${travel.id}`,
            "travel:delete-activity",
            null
        );

        return {
            data: "L'activité a été supprimée avec succès.",
        };
    } catch (error) {
        return {
            error: "Impossible de supprimer l'activité. Veuillez réessayer plus tard.",
        };
    }
}