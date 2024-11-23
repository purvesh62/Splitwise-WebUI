import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { LoginSchema } from "@/schema/login-schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET,
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }) {
            return session
        },
        async jwt({ token, user }) {
            return { ...token, ...user }
        },
    },
    providers: [
        Credentials({
            authorize: async (credentials) => {
                const validatedFields = LoginSchema.safeParse(credentials)
                if (!validatedFields.success) return null;
                const { email, password } = validatedFields.data;
                console.log(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
                console.log(email, password);
                if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                    return {
                        email: process.env.ADMIN_EMAIL,
                        name: "Purvesh",
                        image: "",
                        roles: ["ADMIN"],
                    };
                }
                return null;
            },
        }),
    ],
})
