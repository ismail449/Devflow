import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getDeviconClassName } from "@/lib/utils";

import { Badge } from "../ui/badge";

type Props = {
  _id: string;
  name: string;
  questionsCount?: number;
  showCount?: boolean;
  isCompact?: boolean;
};

const TagCard = ({ _id, name, questionsCount, showCount }: Props) => {
  const deviconClassName = getDeviconClassName(name);
  return (
    <Link
      href={ROUTES.TAGS(_id)}
      key={_id}
      className="flex items-center justify-between gap-2"
    >
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${deviconClassName} text-sm`}></i>
          <span>{name}</span>
        </div>
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{questionsCount}</p>
      )}
    </Link>
  );
};

export default TagCard;
