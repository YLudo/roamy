import { z } from "zod";

export const RegisterSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: "Votre nom d'utilisateur doit faire 3 caractères minimum.",
        }),
    email: z
        .string()
        .email({
            message: "Vous devez renseigner une adresse e-mail valide.",
        }),
    password: z
        .string()
        .min(8, {
            message: "Votre mot de passe doit faire 8 caractères minimum.",
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*.?&])[A-Za-z\d@$!%*.?&]{8,}$/, {
            message: "Votre mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial."
        }),
});

export const LoginSchema = z.object({
    email: z
        .string()
        .email({
            message: "Vous devez renseigner une adresse e-mail valide.",
        }),
    password: z
        .string()
        .min(8, {
            message: "Votre mot de passe doit faire 8 caractères minimum.",
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*.?&])[A-Za-z\d@$!%*.?&]{8,}$/, {
            message: "Votre mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial."
        }),
});

export const TravelSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: "Le titre du voyage doit contenir au moins 2 caractères.",
        }),
    dateRange: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .refine(
            (data) => (data.from && data.to) || (!data.from && !data.to),
            {
                message: "Vous devez sélectionner une date de début ET une date de fin.",
            }
        )
        .refine(
            (data) => (!data.from && !data.to) || (data.from && data.to && data.to > data.from),
            {
                message: "La date de fin doit être supérieure à la date de début.",
            }
        ),
});

export const ExpenseSchema = z.object({
    title: z
        .string()
        .min(3, {
            message: "Le titre de la dépense doit contenir au moins 3 caractères.",
        }),
    category: z
        .enum(["ACCOMODATION", "MEAL", "ACTIVITY", "TRANSPORT", "OTHER"], {
            message: "Vous devez spécifier une catégorie valide.",
        }),
    amount: z
        .number({
            message: "Vous devez spécifier un montant valide.",
        })
        .positive("Vous devez spécifier un montant positif."),
    date: z
        .date()
        .optional(),
});

export const ActivitySchema = z.object({
    title: z
        .string()
        .min(3, {
            message: "Le titre de l'activité doit contenir au moins 3 caractères.",
        }),
    description: z
        .string()
        .optional(),
    address: z
        .string()
        .optional(),
    date: z
        .date()
        .optional()
});

export const DocumentSchema = z.object({
    title: z
        .string()
        .min(3, {
            message: "Le titre du document doit contenir au moins 3 caractères.",
        }),
    description: z
        .string()
        .optional(),
});