import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import connectDB from "@/lib/db-server";
import User from "@/models/User";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
          if (
      credentials.email === "demo@gmail.com" &&
      credentials.password === "Demo@123"
    ) {
      return {
        id: "demo-user-id",
        email: "demo@careio.com",
        name: "Demo User",
        role: "USER",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
      };
    }
          
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter email and password");
          }

          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if user has password (OAuth users might not)
          if (!user.password) {
            throw new Error("Please use your OAuth provider to login");
          }

          // Import bcrypt dynamically since it's server-only
          const bcrypt = (await import('bcryptjs')).default;
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isCorrectPassword) {
            throw new Error("Incorrect password");
          }

          if (!user.emailVerified) {
            throw new Error("Please verify your email address");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.avatar,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Only handle OAuth providers
        if (account.provider === "credentials") {
          return true;
        }

        await connectDB();
        
        if (account.provider === "google") {
          const { email, name, picture } = profile;
          
          // Find existing user by email or OAuth ID
          let dbUser = await User.findOne({ 
            $or: [
              { email },
              { oauthProvider: 'GOOGLE', oauthId: account.providerAccountId }
            ]
          });
          
          if (!dbUser) {
            // Create new OAuth user
            dbUser = new User({
              email,
              name,
              avatar: picture,
              oauthProvider: 'GOOGLE',
              oauthId: account.providerAccountId,
              emailVerified: true,
            });
            await dbUser.save();
          } else {
            // Update existing user with OAuth info
            dbUser.oauthProvider = 'GOOGLE';
            dbUser.oauthId = account.providerAccountId;
            dbUser.emailVerified = true;
            dbUser.avatar = picture || dbUser.avatar;
            dbUser.name = name || dbUser.name;
            await dbUser.save();
          }
          
          user.id = dbUser._id.toString();
          user.role = dbUser.role;
          user.email = dbUser.email;
          user.name = dbUser.name;
        }
        
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.provider = account.provider;
      }
      
      // Update token with user data on each request
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/login", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };