import Link from "next/link";

import SearchInput from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    description: "I want to learn React, can anyone help me?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "JavaScript" },
    ],
    author: { _id: "1", name: "John Doe" },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to learn JavaScript?",
    description: "I want to learn JavaScript, can anyone help me?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "JavaScript" },
    ],
    author: { _id: "1", name: "John Doe" },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
];

type SearchParams = Promise<{ [key: string]: string | undefined }>;

const Home = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { query = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const title = question.title.toLowerCase();
    const normalizedQuery = query?.toLowerCase();
    return title.includes(normalizedQuery);
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <SearchInput
          placeholder="Search for Questions Here..."
          imgSrc="/icons/search.svg"
          otherClasses="flex-1"
          route="/"
        />
      </section>
      Home Filter
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => {
          return (
            <div key={question._id} className="rounded-lg px-12 py-9">
              <h2 className="text-lg font-bold">{question.title}</h2>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
