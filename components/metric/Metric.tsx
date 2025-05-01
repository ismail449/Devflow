import Image from "next/image";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

type Props = {
  imageUrl: string;
  alt: string;
  imageWidth?: number;
  imageHeight?: number;
  value: string | number;
  additionalText?: string;
  additionalTextStyles?: string;
  imageStyles?: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
};

const Metric = ({
  imageHeight = 20,
  imageWidth = 20,
  additionalText,
  additionalTextStyles,
  alt,
  imageUrl,
  value,
  imageStyles,
  href,
  textStyles,
  isAuthor,
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={imageUrl}
        width={imageWidth}
        height={imageHeight}
        alt={alt}
        className={`rounded-full object-contain ${imageStyles}`}
      />

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}

        {additionalText ? (
          <span
            className={cn(
              `small-regular line-clamp-1`,
              isAuthor ? "max-sm:hidden" : "",
              additionalTextStyles
            )}
          >
            {additionalText}
          </span>
        ) : null}
      </p>
    </>
  );
  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
