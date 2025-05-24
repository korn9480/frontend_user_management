import { DefaultSession } from "next-auth"

interface Role {
  name: string,
  rolePermissions: RolePermissions[]
}

interface RolePermissions {
  permission: {
    name: string
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface DefaultUser {
    accessToken: string,
    role: Role
  }

  interface Session {
    user: {
      /** The user's postal address. */
      role: Role
    } & DefaultSession["user"],
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string,
    role: Role
  }
}