import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";

import UserAvatar from "../UserAvatar";

function UserCard({ _id, image, name, userName }: User) {
  return (
    <div className="shadow-light100_darknone w-full xs:w-[230px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <UserAvatar
          imageUrl={image}
          id={_id}
          name={name}
          className="size-[100px] rounded-full object-cover"
          fallbackClassName="text-3xl tracking-widest"
        />
        <Link href={ROUTES.PROFILE(_id)}>
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {name}
            </h3>
            {userName && (
              <p className="body-regular text-dark500_light500 mt-2">
                @{userName}
              </p>
            )}
          </div>
        </Link>
      </article>
    </div>
  );
}

export default UserCard;
