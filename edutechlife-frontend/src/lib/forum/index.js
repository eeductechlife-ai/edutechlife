import { TABLES, VALIDATION } from "./config";
import {
  userProfileCache,
  getCachedUserProfiles,
  clearProfileCache,
} from "./cache";
import {
  getPosts,
  getPostsOptimized,
  createPost,
  updatePost,
  deletePost,
} from "./posts";
import { upvotePost, removeVote, checkUserVote } from "./votes";
import {
  getComments,
  getCommentsBatch,
  getPostDetails,
  addComment,
} from "./comments";
import { getForumStats, getUserStats, getPopularTags } from "./stats";
import { subscribeToForumUpdates } from "./realtime";

export { TABLES, VALIDATION };
export { userProfileCache, getCachedUserProfiles, clearProfileCache };
export { getPosts, getPostsOptimized, createPost, updatePost, deletePost };
export { upvotePost, removeVote, checkUserVote };
export { getComments, getCommentsBatch, getPostDetails, addComment };
export { getForumStats, getUserStats, getPopularTags };
export { subscribeToForumUpdates };

export const forumService = {
  getPosts,
  getPostsOptimized,
  createPost,
  updatePost,
  deletePost,
  upvotePost,
  removeVote,
  checkUserVote,
  getComments,
  getCommentsBatch,
  getPostDetails,
  addComment,
  getForumStats,
  getUserStats,
  getPopularTags,
  subscribeToForumUpdates,
  clearProfileCache,
};
