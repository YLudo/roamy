"use server";

import prisma from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import Mailgun from "mailgun.js";
import formData from 'form-data';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY! });

export const register = async (values: any) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Les informations fournies sont invalides. Veuillez vérifier vos saisies.",
        };
    }

    const { name, email, password } = validatedFields.data;

    const existingEmail = await prisma.user.findUnique({
        where: { email },
    });

    if (existingEmail) {
        return {
            error: "Cette adresse e-mail est déjà utilisée. Veuillez en choisir une autre.",
        };
    }

    const existingName = await prisma.user.findUnique({
        where: { name },
    });

    if (existingName) {
        return {
            error: "Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.",
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    const token = await prisma.activateToken.create({
        data: {
            token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
            userId: user.id,
        },
    });

    const templateData = {
        username: user.name,
        link: `${process.env.NEXTAUTH_URL}/activate/${token.token}`,
    };

    const messageData = {
        from: "Roamy <hello@roamy.fr",
        to: user.email,
        subject: "Bienvenue sur Roamy - Activez votre compte dès maintenant !",
        template: "Mail d'activation",
        'h:X-Mailgun-Variables': JSON.stringify(templateData),
    };

    await mg.messages.create(process.env.MAILGUN_DOMAIN!, messageData);

    return {
        success: "Votre compte a été créé avec succès ! Un lien d'activation a été envoyé à votre adresse e-mail.",
    };
};

export const activate = async (token: string) => {
    if (!token) {
        return {
            error: "Le token est requis pour activer le compte.",
        };
    }

    const user = await prisma.user.findFirst({
        where: {
            activateTokens: {
                some: {
                    activatedAt: null,
                    createdAt: {
                        gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                    token
                },
            },
        },
    });

    if (!user) {
        console.log("ICIIIIIIII")
        return {
            error: "Le lien d'activation est invalide ou expiré.",
        };
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
        }),
        prisma.activateToken.updateMany({
            where: { token },
            data: { activatedAt: new Date() },
        }),
    ]);

    return {
        data: null,
    };
}