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

type GetUserParams = {
  userId: string;
};

type GetUserQuestionsParams = {
  userId: string;
} & Omit<PaginatedSearchParams, "query" | "filter" | "sort">;

type GetUserAnswersParams = {
  userId: string;
} & Omit<PaginatedSearchParams, "query" | "filter" | "sort">;

type GetUserTopTagsParams = {
  userId: string;
};

type DeleteItemParams = {
  itemId: string;
};

type CreateInteractionParams = {
  actionId: string;
  actionType: "question" | "answer";
  action:
    | "view"
    | "upvote"
    | "downvote"
    | "bookmark"
    | "post"
    | "edit"
    | "delete"
    | "search";
  authorId: string;
};

interface UpdateReputationParams {
  interaction: InteractionDoc;
  session: mongoose.ClientSession;
  performerId: string;
  authorId: string;
}

type GetUserStatsParams = {
  userId: string;
};

interface RecommendationParams {
  userId: string;
  query?: string;
  skip: number;
  limit: number;
}

type GetJobsParams = PaginatedSearchParams & {
  country?: string;
  numberOfPages?: number;
};
type GlobalSearchTypes = "Question" | "Answer" | "User" | "Tag";

type GlobalSearchParams = {
  query: string;
  searchTypes?: GlobalSearchTypes[];
};
