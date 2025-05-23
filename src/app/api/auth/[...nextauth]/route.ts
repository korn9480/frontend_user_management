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
            const user = res.data.data.user
            const token = res.data.data.token
            return {
              id: user.id,
              email: user.email,
              image: "",
              name: user.name,
              accessToken: token,      // เพิ่ม field ที่ต้องการ
              role: user.role,
            }
          }  
          return null;
        } catch (e) {
          return null
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
        token.role = user.role;                  
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email
        session.user.name = token.name
        session.user.role = token.role
        session.accessToken = token.accessToken
      }
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
