import React from "react";

import { AnswerFilters } from "@/constants/filters";
import { EMPTY_ANSWERS } from "@/constants/states";

import AnswerCard from "../cards/AnswerCard";
import DataRenderer from "../DataRenderer";
import CommonFilter from "../filters/CommonFilter";
import Pagination from "../Pagination";

interface Props extends ActionResponse<Answer[]> {
  totalAnswers: number;
  isNext: boolean;
  page: number;
}

const AllAnswers = ({
  success,
  totalAnswers,
  data,
  error,
  isNext,
  page,
}: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <CommonFilter filters={AnswerFilters} otherClasses="sm:min-w-32" />
      </div>
      <DataRenderer
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
        }
        data={data}
        success={success}
        error={error}
      />
      <Pagination page={page} isNext={isNext || false} />
    </div>
  );
};

export default AllAnswers;
