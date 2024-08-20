import { SortOrder } from "mongoose";

import connectToMongoDB from "../db/connectToMongoDB";
import Genre from "@/models/Genre";
import Content from "@/models/Content";

import { CONTENT_LIST_DEFAULT_LIMIT } from "@/constants";
import {
  partialContentForContentList,
  partialContentForContentListWithGenres,
} from "../mongooseSelect";
import formatMongooseDoc from "../db/formatMongooseDoc";

type Tags =
  | "BannerContent"
  | "ReadWithEditor"
  | "CompletedClassic"
  | "WeeklyNovel"
  | "FreeRead";

type Status =
  | "Ongoing"
  | "Discontinued"
  | "Abandoned"
  | "Unscheduled"
  | "Completed";

type ContentListFilter = {
  filterBy?: "tags" | "genres" | "status";
  sortBy?: "trending" | "new" | "updatedToday";
  tags?: Tags[];
  genres?: string[];
  status?: Status;
};

async function getFilterQuery(listFilter: ContentListFilter) {
  const { filterBy, tags, status } = listFilter;

  if (filterBy === "tags") return { tags: { $in: tags ?? [] } };
  if (filterBy === "status") return { status };

  if (filterBy === "genres") {
    const { genres } = listFilter;
    const genreIds = await Genre.find({ name: { $in: genres } }).select("_id");

    return { genres: { $in: genreIds } };
  }

  return {};
}

function getSortQuery(
  listFilter: ContentListFilter,
): Record<string, SortOrder> {
  const { sortBy } = listFilter;

  if (sortBy === "trending")
    return { rating: -1, noOfViews: -1, noOfSubscribers: -1 };
  if (sortBy === "new") return { createdAt: -1 };
  if (sortBy === "updatedToday") return { chaptersUpdatedOn: -1 };

  return {};
}

export default async function getContentList(
  listFilter: ContentListFilter,
  listLimit?: number,
) {
  try {
    await connectToMongoDB();
    const limit = listLimit ?? CONTENT_LIST_DEFAULT_LIMIT;
    const filterQuery = getFilterQuery(listFilter);
    const sortQuery = getSortQuery(listFilter);
    const partialContent =
      listFilter.filterBy === "genres"
        ? partialContentForContentListWithGenres
        : partialContentForContentList;

    const contentDocs = await Content.find(filterQuery)
      .sort(sortQuery)
      .limit(limit)
      .select(partialContent);

    const formatedContentDocs = contentDocs.map((content) =>
      formatMongooseDoc(content.toObject()),
    );

    return JSON.parse(JSON.stringify(formatedContentDocs));
  } catch (error: any) {
    return {
      error: true,
      errorMessage: error.message,
    };
  }
}
