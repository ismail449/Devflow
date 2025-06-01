import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { CollectionFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

const Collections = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { query = "", filter = "", page, pageSize } = await searchParams;

  const { success, data, error } = await getSavedQuestions({
    filter: filter || "",
    query: query || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const { collection: collections, isNext } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          placeholder="Search for Questions Here..."
          imgSrc="/icons/search.svg"
          otherClasses="flex-1"
          route={ROUTES.COLLECTION}
        />
        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <DataRenderer
        success={success}
        error={error}
        data={collections}
        empty={EMPTY_QUESTION}
        render={(collections) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collections.map((collection) => (
              <QuestionCard
                key={collection.question._id}
                question={collection.question}
              />
            ))}
          </div>
        )}
      />
      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default Collections;
