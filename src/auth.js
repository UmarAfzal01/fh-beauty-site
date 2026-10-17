import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Patient from "@/models/Patient";
import dbConnect from "@/lib/dbConnect";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Check for Environment Variable Admin Credentials
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "env-admin-id",
            name: "Super Admin",
            email: process.env.ADMIN_EMAIL,
            role: "admin", // Explicit Admin Role
          };
        }

        // 2. Otherwise, check registered patients in MongoDB
        await dbConnect();
        const patient = await Patient.findOne({ email: credentials.email });

        if (!patient || !patient.password) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          patient.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: patient._id.toString(),
          name: patient.name,
          email: patient.email,
          role: "patient", // Explicit Patient Role
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Save role into token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // Pass role to session object
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});