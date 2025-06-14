const ROUTES = {
  HOME: "/",
  SIGNIN: "/sign-in",
  SIGNUP: "/sign-up",
  ASK_QUESTION: "/ask-question",
  COLLECTION: "/collection",
  COMMUNITY: "/community",
  TAGS: "/tags",
  JOBS: "/jobs",
  PROFILE: (id: string) => `/profile/${id}`,
  TAG: (id: string) => `/tags/${id}`,
  QUESTION: (id: string) => `/questions/${id}`,
  EDIT_QUESTION: (id: string) => `/questions/${id}/edit`,
  SIGN_IN_WITH_OAUTH: "signin-with-oauth",
};

export default ROUTES;
