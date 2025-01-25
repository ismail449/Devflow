import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

const useUpdateUrlQuery = (key: string, delay: number = 0) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = searchParams.get(key) || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const updateUrlQuery = useCallback(
    (searchQuery: string) => {
      let newUrl;
      if (searchQuery) {
        newUrl = formUrlQuery({
          key,
          value: searchQuery,
          params: searchParams.toString(),
        });
      } else {
        newUrl = removeKeysFromUrlQuery({
          keysToRemove: [key],
          params: searchParams.toString(),
        });
      }
      router.push(newUrl, { scroll: false });
    },
    [key, router, searchParams]
  );

  useEffect(() => {
    if (delay) {
      const debouncedFunc = setTimeout(() => updateUrlQuery(searchQuery), 600);
      return () => clearTimeout(debouncedFunc);
    }
  }, [searchQuery, searchParams, pathname, router, key, updateUrlQuery, delay]);

  return { searchQuery, setSearchQuery, updateUrlQuery };
};

export default useUpdateUrlQuery;
