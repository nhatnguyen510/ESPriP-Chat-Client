import { User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
  }
}

declare module "next-auth" {
  interface Session {
    user: NextAuthUser & User;
  }
}

interface User {
  id: UserId;
  username: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  access_token: string;
  refresh_token: string;
  refresh_token_id: string;
  master_key: string;
  conversation_ids: UserId[];
}
