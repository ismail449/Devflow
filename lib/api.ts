import ROUTES from "@/constants/routes";
import { AccountDoc, IAccount } from "@/database/account.model";
import { IUser } from "@/database/user.model";

import { fetchHandler } from "./handlers/fetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  auth: {
    signInWithOAuth: async (data: SignInWithOAuthParams) =>
      await fetchHandler(`${BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  users: {
    getAll: async () => fetchHandler(`${BASE_URL}/users`),

    getById: async (id: string) => fetchHandler(`${BASE_URL}/users/${id}`),

    getByEmail: async (email: string) =>
      fetchHandler(`${BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    create: async (data: IUser) =>
      fetchHandler(`${BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: async (id: string, data: Partial<IUser>) =>
      fetchHandler(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: async (id: string) =>
      fetchHandler(`${BASE_URL}/users/${id}`, { method: "DELETE" }),
  },

  accounts: {
    getAll: async () => fetchHandler(`${BASE_URL}/accounts`),

    getById: async (id: string) => fetchHandler(`${BASE_URL}/accounts/${id}`),

    getByProvider: async <T = AccountDoc>(providerAccountId: string) =>
      fetchHandler<T>(`${BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),

    create: async (data: IAccount) =>
      fetchHandler(`${BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: async (id: string, data: Partial<IAccount>) =>
      fetchHandler(`${BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: async (id: string) =>
      fetchHandler(`${BASE_URL}/accounts/${id}`, { method: "DELETE" }),
  },
};
