import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React, { Suspense } from "react";

import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/metric/Metric";
import SaveQuestion from "@/components/questions/SaveQuestion";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import { getQuestionAnswers } from "@/lib/actions/answer.action";
import { hasSaveQuestion } from "@/lib/actions/collection.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { getTimeStamp, formatNumber } from "@/lib/utils";

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, filter } = await searchParams;

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
      filter,
    });

  after(async () => {
    await incrementViews({
      questionId: id,
    });
  });

  if (!question || !success) return redirect("/404");
  const hasVotedPromise = hasVoted({
    targetId: question?._id,
    targetType: "question",
  });
  const hasSavedQuestionPromise = hasSaveQuestion({ questionId: question._id });
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
          <div className="flex items-center justify-end gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                targetType="question"
                targetId={question._id}
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>

            <Suspense fallback={<div>Loading...</div>}>
              <SaveQuestion
                questionId={question._id}
                hasSavedQuestionPromise={hasSavedQuestionPromise}
              />
            </Suspense>
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
          page={Number(page) || 1}
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
          isNext={answersResult?.isNext || false}
        />
      </section>
      <section className="my-5">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
