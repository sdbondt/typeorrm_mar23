import { Post } from "../entity/Post";

export interface GetPostsResults {
    posts: Post[];
    page: number;
    totalCount: number;
    maxPage: number;
}

export interface GetPostsQuery {
    q?: string;
    direction?: string;
    limit?: string;
    page?: string;
  }