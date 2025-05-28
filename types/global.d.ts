type Tag = {
  _id: string;
  name: string;
  questions?: number;
};

type Author = {
  _id: string;
  name: string;
  image: string;
};

type Question = {
  _id: string;
  title: string;
  content: string;
  description: string;
  tags: Tag[];
  author: Author;
  upvotes: number;
  downvotes: number;
  answerCount: number;
  views: number;
  createdAt: Date;
};

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

type RouteParams = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
};

type PaginatedSearchParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
};

type Answer = {
  _id: string;
  createdAt: Date;
  questionId: string;
  content: string;
  author: Author;
  upvotes: number;
  downvotes: number;
};

type Vote = {
  _id: string;
};

type User = {
  _id: string;
  name: string;
  userName: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  createdAt: Date;
};

type Collection = {
  _id: string;
  author: string | Author;
  question: Question;
};
