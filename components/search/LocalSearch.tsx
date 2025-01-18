"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

import { Input } from "../ui/input";

type Props = {
  placeholder?: string;
  onSearch?: (value: string) => void;
  imgSrc?: string;
  route: string;
  otherClasses?: string;
};

const LocalSearch = ({ placeholder, imgSrc, route, otherClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const debouncedFunc = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          key: "query",
          value: searchQuery,
          params: searchParams.toString(),
        });

        router.push(newUrl, { scroll: false });
      } else if (pathname === route) {
        const newUrl = removeKeysFromUrlQuery({
          keysToRemove: ["query"],
          params: searchParams.toString(),
        });

        router.push(newUrl, { scroll: false });
      }
    }, 600);
    return () => clearTimeout(debouncedFunc);
  }, [searchQuery, searchParams, router, route, pathname]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center rounded-[10px] p-4 ${otherClasses ?? ""}`}
    >
      <Image
        src={imgSrc || "./icons/search.svg"}
        alt="search icon"
        width={20}
        height={20}
      />
      <Input
        type="search"
        placeholder={placeholder ?? ""}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
        onChange={handleSearch}
        value={searchQuery}
      />
    </div>
  );
};

export default LocalSearch;
