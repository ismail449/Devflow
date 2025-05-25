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

type EditQuestionParams = CreateQuestionParams & { questionId: string };

type GetQuestionParams = {
  questionId: string;
};

type GetTagQuestionsParams = {
  tagId: string;
} & PaginatedSearchParams;

type IncrementViewsParams = {
  questionId: string;
};

type CreateAnswerParams = {
  questionId: string;
  content: string;
};

interface GetQuestionAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

type CreateVoteParams = {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
};

type UpdateVoteCountParams = CreateVoteParams & {
  change: 1 | -1;
};

type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

type HasVotedResponse = {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
};

type CollectionBaseParams = {
  questionId: string;
};
