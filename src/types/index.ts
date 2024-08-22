export type pageReqObj = {
  params: {
    content_id?: string;
    chapter_id?: string;
  };
  searchParams: {
    content_id?: string;
  };
};

export type GenrePageReqObj = {
  params: { name: string; status: string };
};

// Header NavLink
export type LinkObject = {
  key: string;
  Icon?: any;
  sidebarOnly?: boolean;
  label: string;
  link: string;
};

// Nested Comment System's types
export type VoteType = "up" | "down";

export type Comment = {
  id: string;
  parentId: string;
  message: string;
  contentId: string;
  chapterId?: string;
  user: {
    id: string;
    username?: string;
    avatar: string;
  };
  upVotes: number;
  downVotes: number;
  isEdited: boolean;
  isReported: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  voteType?: VoteType;
};

export type SortKey = "BEST" | "NEWEST" | "OLDEST";

export type CommentsPayload = {
  loading: boolean;
  error: boolean;
  errorMessage?: string;
  totalPages: number;
  totalComments: number;
  pageNumber: number;
  comments: Comment[];
  sortKey: SortKey;
  loadMoreCommentsLoding: boolean;
};

// Content Page And CMS
export type Tags =
  | "BannerContent"
  | "ReadWithEditor"
  | "CompletedClassic"
  | "WeeklyNovel"
  | "FreeRead";

export type Status =
  | "Ongoing"
  | "Discontinued"
  | "Abandoned"
  | "Unscheduled"
  | "Completed";

type Genre = { id: string; name: string; createdAt: string; updatedAt: string };

export type Content = {
  id: string;
  tags: Tags[];
  thumbnail: string;
  poster: string;
  title: string;
  status: Status;
  genres: Genre[];
  rating: number;
  noOfViews: number;
  noOfSubscribers: number;
  author: string;
  synonyms: string[];
  description: string;
  imagesAndWallpapers: string[];
  createdAt: string;
  updatedAt: string;
};

export type GenresResponse = {
  error: boolean;
  genres?: Genre[];
  errorMessage?: string;
};
