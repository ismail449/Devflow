import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface Props {
  imgUrl: string;
  href?: string;
  title: string;
  titleClassNames?: string;
  imgWidth?: number;
  imgHeight?: number;
}

const ProfileLink = ({
  imgUrl,
  href,
  title,
  imgHeight,
  imgWidth,
  titleClassNames,
}: Props) => {
  return (
    <div className="flex-center gap-1">
      <Image
        src={imgUrl}
        alt={title}
        width={imgWidth || 20}
        height={imgHeight || 20}
      />

      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("paragraph-medium text-link-100", titleClassNames)}
        >
          {title}
        </Link>
      ) : (
        <p
          className={cn(
            "paragraph-medium text-dark400_light700",
            titleClassNames
          )}
        >
          {title}
        </p>
      )}
    </div>
  );
};

export default ProfileLink;
