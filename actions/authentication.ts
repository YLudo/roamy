"use server";

import prisma from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";

export const register = async (values: any) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Les informations fournies sont invalides. Veuillez vérifier vos saisies.",
        };
    }

    const { username, email, password } = validatedFields.data;

    const existingEmail = await prisma.user.findUnique({
        where: { email },
    });

    if (existingEmail) {
        return {
            error: "Cette adresse e-mail est déjà utilisée. Veuillez en choisir une autre.",
        };
    }

    const existingUsername = await prisma.user.findUnique({
        where: { username },
    });

    if (existingUsername) {
        return {
            error: "Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.",
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });

    return {
        success: "Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.",
    };
};