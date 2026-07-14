const TABLES = {
  POSTS: "forum_posts",
  COMMENTS: "forum_comments",
  VOTES: "forum_votes",
  PROFILES: "profiles",
};

const VALIDATION = {
  MIN_POST_LENGTH: 10,
  MAX_POST_LENGTH: 500,
  MIN_COMMENT_LENGTH: 1,
  MAX_COMMENT_LENGTH: 300,
  MAX_TAGS: 3,
};

const CACHE_TTL = 5 * 60 * 1000;

export { TABLES, VALIDATION, CACHE_TTL };
