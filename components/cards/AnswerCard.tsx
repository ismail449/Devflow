import Link from "next/link";
import React, { Suspense } from "react";

import ROUTES from "@/constants/routes";
import { hasVoted } from "@/lib/actions/vote.action";
import { cn, getTimeStamp } from "@/lib/utils";

import Preview from "../editor/Preview";
import EditDeleteActions from "../user/EditDeleteActions";
import UserAvatar from "../UserAvatar";
import Votes from "../votes/Votes";

type Props = {
  containerClasses?: string;
  showReadMore?: boolean;
  showActionBtns?: boolean;
} & Answer;

function AnswerCard({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  questionId,
  containerClasses,
  showReadMore = false,
  showActionBtns = false,
}: Props) {
  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "answer",
  });
  return (
    <article
      className={cn("light-border border-b py-10 relative", containerClasses)}
    >
      <span id={`answer-${_id}`} className="hash-span" />
      {showActionBtns && (
        <div className="background-light800_dark200 flex-center absolute -right-2 -top-5 size-9 rounded-full">
          <EditDeleteActions itemId={_id} type="Answer" />
        </div>
      )}
      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />
          <Link
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
            href={ROUTES.PROFILE(author._id)}
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>
            <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              targetType="answer"
              targetId={_id}
              upvotes={upvotes}
              downvotes={downvotes}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
        </div>
      </div>
      <Preview content={content} />
      {showReadMore && (
        <Link
          href={`${ROUTES.QUESTION(questionId)}#answer-${_id}`}
          className="body-semibold relative z-10 font-space-grotesk text-primary-500"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      )}
    </article>
  );
}

export default AnswerCard;
