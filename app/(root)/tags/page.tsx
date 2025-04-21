import React from "react";

import DataRenderer from "@/components/DataRenderer";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tag.actions";

const Tags = async () => {
  const { success, data, error } = await getTags({
    query: "",
    page: 1,
    pageSize: 10,
  });
  const { tags } = data || {};
  return (
    <DataRenderer
      empty={EMPTY_TAGS}
      render={(tags) => tags.map((tag) => <div key={tag._id}>{tag.name}</div>)}
      success={success}
      data={tags}
      error={error}
    />
  );
};

export default Tags;
