import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getHotQuestions } from "@/lib/actions/question.action";

import DataRenderer from "../DataRenderer";

const RightSidebar = async () => {
  const { success, data: hotQuestions, error } = await getHotQuestions();

  return (
    <section className="light-border background-light900_dark200 sticky right-0 top-0 flex h-screen flex-col justify-between gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden max-sm:hidden lg:w-[330px]">
      <div>
        <h3 className="h3-bold">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          <DataRenderer
            success={success}
            error={error}
            data={hotQuestions}
            empty={{
              title: "No questions found",
              message: "No questions have been asked yet",
            }}
            render={(hotQuestions) => {
              return (
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                  {hotQuestions.map(({ _id, title }) => (
                    <Link
                      href={ROUTES.QUESTION(_id)}
                      key={_id}
                      className="flex items-center justify-between gap-7"
                    >
                      <p className="text-dark500_light700 body-medium line-clamp-2">
                        {title}
                      </p>
                      <Image
                        src="/icons/chevron-right.svg"
                        alt="chevron right"
                        width={20}
                        height={20}
                        className="invert-colors"
                      />
                    </Link>
                  ))}
                </div>
              );
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="h3-bold">Popular Tags</h3>
        {/* <div className="mt-7 flex w-full flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => {
            return (
              <TagCard
                key={_id}
                _id={_id}
                name={name}
                questionsCount={questions}
                showCount
                compact
              />
            );
          })}
        </div> */}
      </div>
    </section>
  );
};

export default RightSidebar;
