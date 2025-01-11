import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";

import TagCard from "../cards/TagCard";

const hotQuestions = [
  {
    _id: "1",
    title:
      "Would it be appropriate to point out an error in another paper during a referee report?",
  },
  {
    _id: "2",
    title: "How can an airconditioning machine exist?",
  },
  {
    _id: "3",
    title: "Interrogated every time crossing UK Border as citizen",
  },
  {
    _id: "4",
    title: "Low digit addition generator",
  },
  {
    _id: "5",
    title: "What is an example of 3 numbers that do not make up a vector?",
  },
];

const popularTags = [
  { _id: "1", name: "react", questions: 100 },
  { _id: "2", name: "javascript", questions: 200 },
  { _id: "3", name: "typescript", questions: 150 },
  { _id: "4", name: "nextjs", questions: 50 },
  { _id: "5", name: "react-query", questions: 75 },
];

const RightSidebar = () => {
  return (
    <section className="light-border background-light900_dark200 sticky right-0 top-0 flex h-screen flex-col justify-between gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden max-sm:hidden lg:w-[330px]">
      <div>
        <h3 className="h3-bold">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => {
            return (
              <Link
                href={ROUTES.PROFILE(_id)}
                key={_id}
                className="flex items-center justify-between gap-7"
              >
                <p className="text-dark500_light700 body-medium">{title}</p>
                <Image
                  src="/icons/chevron-right.svg"
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="h3-bold">Popular Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => {
            return (
              <TagCard
                key={_id}
                _id={_id}
                name={name}
                questionsCount={questions}
                showCount
                isCompact
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
