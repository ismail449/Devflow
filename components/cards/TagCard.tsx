import Image from "next/image";
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
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
};

const TagCard = ({
  _id,
  name,
  questionsCount,
  showCount,
  handleRemove,
  isButton,
  isCompact,
  remove,
}: Props) => {
  const deviconClassName = getDeviconClassName(name);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };
  const Content = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex flex-row gap-2 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${deviconClassName} text-sm`}></i>
          <span>{name}</span>
        </div>
        {remove && (
          <Image
            src="/icons/close.svg"
            alt="close"
            width={16}
            height={16}
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={handleRemove}
          />
        )}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{questionsCount}</p>
      )}
    </>
  );
  if (isCompact) {
    if (isButton) {
      return (
        <button onClick={handleClick} className="flex justify-between gap-2">
          {Content}
        </button>
      );
    }
    return (
      <Link
        href={ROUTES.TAG(_id)}
        key={_id}
        className="flex items-center justify-between gap-2"
      >
        {Content}
      </Link>
    );
  }
  return (
    <Link
      href={ROUTES.TAG(_id)}
      key={_id}
      className="flex items-center justify-between gap-2"
    >
      {Content}
    </Link>
  );
};

export default TagCard;
