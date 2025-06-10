import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "email", type: "email", placeholder: "jsmith" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/auth/login`,
            {
              email: credentials?.username,
              password: credentials?.password,
            },
            {
              validateStatus: () => true
            }
          );
          if (res.data && res.data.data) {
            const token = res.data.data.token
            const user = res.data.data.user;
            return {
              id: user?.id || "",
              email: user?.email || "",
              image: user?.image || "",
              name: user?.name || "",
              accessToken: token,
              role: user?.role || "", // Ensure role is provided
            }
          } 
          throw new Error(res.data?.message || "Invalid credentials");

        } catch(e:any) {
          throw new Error(e)
        }
      },
      type: "credentials",
    }),
  ],
  callbacks: {
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      const decodedToken = JSON.parse(
          Buffer.from(token.accessToken.split(".")[1], "base64").toString()
      );
      session.user.email = decodedToken.email
      session.user.role = decodedToken.role
      session.accessToken = token.accessToken
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    error: '/login'
  }
});
// Export handlers for HTTP methods
export { handler as GET, handler as POST };
