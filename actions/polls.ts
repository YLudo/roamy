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

export const votePoll = async (pollOptionId: string) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return {
                error: "Votre session a expiré. Veuillez vous reconnecter.",
            };
        }

        const pollOption = await prisma.pollOption.findUnique({
            where: { id: pollOptionId },
            include: { poll: true },
        });

        if (!pollOption) {
            return {
                error: "L'option de sondage spécifié n'existe pas.",
            };
        }

        const travel = await prisma.travel.findUnique({
            where: { id: pollOption.poll.travelId },
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
                error: "Le voyage associé à ce sondage n'existe pas.",
            };
        }
      
        const isOwner = travel.userId === session.user.id;
        const isParticipant = travel.participants.some(participant => participant.user.id === session.user.id);
      
        if (!isParticipant && !isOwner) {
            return {
                error: "Vous n'avez pas l'autorisation de voter à ce sondage.",
            };
        }

        const existingVote = await prisma.vote.findFirst({
            where: {
                userId: session.user.id,
                pollOption: {
                    pollId: pollOption.pollId,
                }
            }
        });

        if (existingVote) {
            const updatedVote = await prisma.vote.update({
                where: { id: existingVote.id },
                data: { pollOptionId },
                include: {
                    user: true,
                    pollOption: {
                        include: {
                            poll: true
                        }
                    }
                }
            });


            await pusherServer.trigger(
                `travel-${travel.id}`,
                "travel:vote-updated",
                updatedVote,
            );
      
            return {
                data: updatedVote,
            };
        } else {
            const newVote = await prisma.vote.create({
                data: {
                    pollOptionId,
                    userId: session.user.id,
                },
                include: {
                    user: true,
                    pollOption: {
                        include: {
                            poll: true
                        }
                    }
                }
            });
      
            await pusherServer.trigger(
                `travel-${travel.id}`,
                "travel:new-vote",
                newVote,
            );
      
            return {
              data: newVote,
            };
        }
    } catch (error) {
        return {
            error: "Impossible de voter pour ce sondage. Veuillez réessayer.",
        };
    }
}

export const deletePoll = async (travelId: string, pollId: string) => {
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

        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
        });

        if (!poll || poll.travelId !== travelId) {
            return {
                error: "Le sondage que vous tentez de supprimer n'existe pas.",
            };
        }

        await prisma.poll.delete({
            where: { id: pollId },
        });

        await pusherServer.trigger(
            `travel-${travel.id}`,
            "travel:delete-poll",
            null
        );

        return {
            data: "Le sondage a été supprimé avec succès.",
        };
    } catch (error) {
        return {
            error: "Impossible de supprimer le sondage. Veuillez réessayer plus tard.",
        };
    }
}