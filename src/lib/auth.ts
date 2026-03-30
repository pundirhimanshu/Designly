import { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      bio?: string | null;
      skills?: string[];
      works?: any[];
      background?: string | null;
      backgroundBlur?: number;
      backgroundMotion?: boolean;
      customCursor?: string | null;
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("=== SIGNIN ===", {
        oauthEmail: (profile as any)?.email,
        resolvedEmail: user.email,
        providerAccountId: account?.providerAccountId
      });

      // Check if user already has a linked account (returning user)
      const existingAccount = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account?.provider as string,
            providerAccountId: account?.providerAccountId as string
          }
        }
      });

      if (existingAccount) {
        // Check if they came from the signup flow (intent cookie present)
        try {
          const cookieStore = cookies();
          const signupIntent = cookieStore.get("designly_signup_intent");
          if (signupIntent?.value === "true") {
            console.warn("=== BLOCKED === Existing user tried to signup via signup flow");
            return "/login?error=EmailAlreadyInUse";
          }
        } catch { /* ignore cookie errors in test/edge cases */ }

        console.log("=== ALLOWED === Returning user login");
        return true;
      }

      // NEW user — only allow if they came from the signup flow
      try {
        const cookieStore = cookies();
        const signupIntent = cookieStore.get("designly_signup_intent");
        if (signupIntent?.value === "true") {
          console.log("=== ALLOWED === New user signup");
          return true;
        }
      } catch { /* ignore cookie errors */ }

      // New user tried to login directly without signing up
      console.warn("=== BLOCKED === Direct login without signup");
      return "/login?error=SignupRequired";
    },

    async session({ session, user }: any) {
      if (user && session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.bio = user.bio;
        session.user.skills = user.skills;
        session.user.background = user.background;
        session.user.backgroundBlur = user.backgroundBlur;
        session.user.backgroundMotion = user.backgroundMotion;
        session.user.customCursor = user.customCursor;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/onboard/role",
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("NEXTAUTH ERROR:", code, metadata);
    },
    warn(code) {
      console.warn("NEXTAUTH WARN:", code);
    },
    debug(code, metadata) {
      console.log("NEXTAUTH DEBUG:", code, metadata);
    },
  },
};
