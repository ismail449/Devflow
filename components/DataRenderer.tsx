import Image from "next/image";
import Link from "next/link";
import React from "react";

import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/states";

import { Button } from "./ui/button";

type Props<T> = {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data?: T[] | null;
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
};

type StateSkeletonProps = {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
};

const StateSkeleton = ({
  image,
  title,
  button,
  message,
}: StateSkeletonProps) => (
  <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
    <>
      <Image
        alt={image.alt}
        src={image.dark}
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />
      <Image
        alt={image.alt}
        src={image.light}
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
    </>
    <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
    <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
      {message}
    </p>
    {button && (
      <Link href={button.href}>
        <Button className="paragraph-medium mt-5 min-h-[45px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500">
          {button.text}
        </Button>
      </Link>
    )}
  </div>
);

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: Props<T>) => {
  if (!success)
    return (
      <StateSkeleton
        image={{
          dark: "/images/dark-error.png",
          light: "/images/light-error.png",
          alt: "error state illustration",
        }}
        title={error?.message || DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={DEFAULT_ERROR.button}
      />
    );
  if (!data || !data.length)
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );

  return <div>{render(data)}</div>;
};

export default DataRenderer;
