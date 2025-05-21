import React from "react";

import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsers({
    filter,
    query,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });
  if (!success || !data) return;

  const { users } = data || {};
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          placeholder="There are some great devs here!"
          otherClasses="flex-1"
        />
      </div>

      <DataRenderer
        data={users}
        success={success}
        error={error}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default Community;
