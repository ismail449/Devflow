import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React from "react";

import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/metric/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getQuestionAnswers } from "@/lib/actions/answer.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { getTimeStamp, formatNumber } from "@/lib/utils";

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  const {
    success,
    data: question,
    error: answersError,
  } = await getQuestion({ questionId: id });
  const { data: answersResult, success: areAnswersLoaded } =
    await getQuestionAnswers({
      questionId: id,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      filter: "latest",
    });

  after(async () => {
    await incrementViews({
      questionId: id,
    });
  });

  if (!question || !success) return redirect("/404");

  const { author, createdAt, answerCount, views, tags, title, content } =
    question;
  const createdAtDate = new Date(createdAt);

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
              imageUrl={author.image}
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              {" "}
              <p className="paragraph-semibold text-dark300_light700"></p>{" "}
              {author.name}
            </Link>
          </div>
          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imageUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(createdAtDate)}`}
          additionalText=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imageUrl="/icons/message.svg"
          alt="message icon"
          value={answerCount}
          additionalText=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imageUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          additionalText=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>
      <Preview content={content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <section className="my-5">
        <AllAnswers
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>
      <section className="my-5">
        <AnswerForm questionId={question._id} />
      </section>
    </>
  );
};

export default QuestionDetails;
