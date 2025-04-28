import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  id: string;
  imageUrl?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
};

const UserAvatar = async ({
  id,
  imageUrl,
  name,
  className = "h-9 w-9",
  fallbackClassName,
}: Props) => {
  const initials = name
    .split(" ")
    .map((word) => word[0].toLocaleUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={className}>
        <AvatarImage src={imageUrl} alt="user avatar" />
        <AvatarFallback
          className={cn(
            "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
            fallbackClassName
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
