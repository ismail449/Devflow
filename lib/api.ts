import ROUTES from "@/constants/routes";
import { AccountDoc, IAccount } from "@/database/account.model";
import { IUser, UserDoc } from "@/database/user.model";

import { fetchHandler } from "./handlers/fetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const COUNTRIES_API_BASE_URL = process.env.COUNTRIES_API_BASE_URL || "";

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

    getById: async <T = UserDoc>(id: string) =>
      fetchHandler<T>(`${BASE_URL}/users/${id}`),

    getByEmail: async <T = UserDoc>(email: string) =>
      fetchHandler<T>(`${BASE_URL}/users/email`, {
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

  ai: {
    getAnswer: async (
      question: string,
      content: string,
      userAnswer?: string
    ): APIResponse<string> =>
      await fetchHandler(`${BASE_URL}/ai/answers`, {
        body: JSON.stringify({ question, content, userAnswer }),
        method: "POST",
        timeout: 100000,
      }),
  },

  jobs: {
    getJobs: async <T = { jobs: Job[]; isNext: boolean }>(
      data: GetJobsParams
    ): Promise<ActionResponse<T>> => {
      return fetchHandler<T>(
        `${BASE_URL}/job/get-jobs/?query=${data.query}&page=${data.page}&pageSize=${data.numberOfPages}&country=${data.country}`
      );
    },
  },

  countries: {
    getCountryDataUsingCode: async (code: string = "us") => {
      const response = await fetch(
        `${COUNTRIES_API_BASE_URL}/alpha?codes=${code}`
      );
      return await response.json();
    },

    getCountriesNames: async (): Promise<Country[]> => {
      const response = await fetch(
        `${COUNTRIES_API_BASE_URL}/all?fields=cca2,name`
      );
      return await response.json();
    },
  },

  ip: {
    getCurrentUserCountry: async () => {
      const response = await fetch(`http://ip-api.com/json/`);
      return await response.json();
    },
  },
};
