import Image from "next/image";
import Link from "next/link";
import React from "react";

import ProfileLink from "../user/ProfileLink";

type Props = {
  job: Job;
  countryFlagInfo: {
    png: string;
    svg: string;
    alt: string;
  };
};

const JobCard = ({ job, countryFlagInfo }: Props) => {
  return (
    <article className="shadow-light100_darknone light-border background-light900_dark200 text-light400_light500 flex w-full flex-row items-start gap-6 rounded-2 border p-8 max-sm:gap-2 max-sm:p-3">
      <Image
        src={job.employer_logo || "/images/default-logo.svg"}
        width={64}
        height={64}
        alt="employer logo"
        className="rounded-2 object-contain"
      />
      <div className="flex flex-col">
        <div className="flex h-7 w-full justify-between">
          <h3 className="text-dark200_light900 line-clamp-1 flex-1 text-lg font-semibold">
            {job.job_title}
          </h3>
          <div className="background-light800_dark300 flex h-5 gap-1 rounded-md px-1">
            <Image
              src={countryFlagInfo.svg}
              width={16}
              height={10}
              alt={countryFlagInfo.alt}
              className="rounded-[100%] object-contain"
            />
            <span className="text-dark200_light900 line-clamp-1 font-inter text-sm font-medium">
              {job.job_location}
            </span>
          </div>
        </div>
        <p className="text-dark500_light700 max-h-24 overflow-auto whitespace-pre-wrap text-sm">
          {job.job_description}
        </p>
        <div className="mt-5 flex flex-row justify-between max-sm:flex-col">
          <div className="flex flex-row gap-6 max-sm:gap-2">
            <ProfileLink
              imgUrl="/icons/currency-dollar-circle.svg"
              title={job.job_salary || "Not specified"}
              imgHeight={16}
              imgWidth={16}
              titleClassNames="!text-sm text-light-500"
            />
            <ProfileLink
              imgUrl="/icons/clock-2.svg"
              title={job.job_employment_type}
              imgHeight={16}
              imgWidth={16}
              titleClassNames="!text-sm text-light-500"
            />
          </div>
          <Link
            href={job.job_apply_link}
            target="_blank"
            className="flex items-center"
          >
            <span className="text-sm font-semibold text-primary-500">
              View job
            </span>
            <Image
              src="/icons/arrow-up-right.svg"
              width={16}
              height={16}
              alt="link arrow"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default JobCard;
