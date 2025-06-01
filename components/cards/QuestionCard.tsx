import Link from "next/link";
import React from "react";

import Metric from "@/components/metric/Metric";
import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";

import TagCard from "./TagCard";
import EditDeleteActions from "../user/EditDeleteActions";

type Props = {
  question: Question;
  showActionBtns?: boolean;
};

const QuestionCard = ({
  question: {
    _id,
    title,
    tags,
    author,
    createdAt,
    upvotes,
    answerCount,
    views,
  },
  showActionBtns = false,
}: Props) => {
  const creationTimeStamp = getTimeStamp(createdAt);
  return (
    <div className="card-wrapper text-dark200_light900 background-light800_darkgradient w-full rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {creationTimeStamp}
          </span>

          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 ">
              {title}
            </h3>
          </Link>
        </div>
        {showActionBtns && <EditDeleteActions type="Question" itemId={_id} />}
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} name={tag.name} _id={tag._id} compact />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imageUrl={author.image}
          alt={author.name}
          value={author.name}
          additionalText={`• asked ${creationTimeStamp}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imageUrl="/icons/like.svg"
            alt="like"
            value={upvotes}
            additionalText=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imageUrl="/icons/message.svg"
            alt="answers"
            value={answerCount}
            additionalText=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imageUrl="/icons/eye.svg"
            alt="views"
            value={views}
            additionalText=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
