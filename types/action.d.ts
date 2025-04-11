type SignInWithOAuthParams = {
  provider: "google" | "github" | "credentials";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image?: string;
  };
};

type AuthCredentials = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type CreateQuestionParams = {
  title: string;
  content: string;
  tags: string[];
};
