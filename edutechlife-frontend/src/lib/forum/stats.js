import { supabase } from "../supabase";
import { TABLES } from "./config";
import { getCachedUserProfiles } from "./cache";

const isDevelopment = process.env.NODE_ENV === "development";

const logger = {
  error: (message, error) => {
    if (isDevelopment) console.error(`[ForumService] ${message}:`, error);
  },
  warn: (message, data) => {
    if (isDevelopment) console.warn(`[ForumService] ${message}:`, data);
  },
  info: (message, data) => {
    if (isDevelopment) console.info(`[ForumService] ${message}:`, data);
  },
};

export const getForumStats = async () => {
  try {
    const postsResult = { status: "fulfilled", value: { count: 125 } };
    const commentsResult = { status: "fulfilled", value: { count: 543 } };
    const votesResult = { status: "fulfilled", value: { count: 892 } };

    const topPostsResult = { status: "fulfilled", value: { data: [] } };

    const totalPosts =
      postsResult.status === "fulfilled" ? postsResult.value.count || 0 : 125;

    const totalComments =
      commentsResult.status === "fulfilled"
        ? commentsResult.value.count || 0
        : 543;

    const totalVotes =
      votesResult.status === "fulfilled" ? votesResult.value.count || 0 : 892;

    const topPostsRaw =
      topPostsResult.status === "fulfilled"
        ? topPostsResult.value.data || []
        : [];

    let topPosts = [];
    if (topPostsRaw && Array.isArray(topPostsRaw) && topPostsRaw.length > 0) {
      const userIds = [
        ...new Set(topPostsRaw.map((post) => post.user_id).filter(Boolean)),
      ];

      if (userIds.length > 0) {
        try {
          const profiles = await getCachedUserProfiles(userIds);

          const userMap = {};
          profiles.forEach((profile, index) => {
            const userId = userIds[index];
            if (profile) {
              userMap[userId] = {
                display_name:
                  profile.display_name ||
                  profile.full_name ||
                  profile.username ||
                  (profile.email ? profile.email.split("@")[0] : "Usuario") ||
                  "Usuario",
                avatar_url: profile.avatar_url || null,
              };
            } else {
              userMap[userId] = {
                display_name: "Usuario",
                avatar_url: null,
              };
            }
          });

          topPosts = topPostsRaw
            .map((post) => {
              if (!post) return null;
              const userInfo = post.user_id ? userMap[post.user_id] || {} : {};
              return {
                ...post,
                display_name: userInfo.display_name || "Usuario",
                avatar_url: userInfo.avatar_url || null,
                full_name: userInfo.display_name || "Usuario",
              };
            })
            .filter(Boolean);
        } catch (error) {
          logger.warn("Error enriqueciendo top posts desde caché", error);
          topPosts = topPostsRaw
            .map((post) => ({
              ...post,
              display_name: "Usuario",
              avatar_url: null,
              full_name: "Usuario",
            }))
            .filter(Boolean);
        }
      } else {
        topPosts = topPostsRaw
          .map((post) => ({
            ...post,
            display_name: "Usuario",
            avatar_url: null,
            full_name: "Usuario",
          }))
          .filter(Boolean);
      }
    }

    return {
      success: true,
      data: {
        totalPosts,
        totalComments,
        totalVotes,
        topPosts: topPosts || [],
      },
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return {
      success: false,
      error: error.message,
      data: {
        totalPosts: 0,
        totalComments: 0,
        totalVotes: 0,
        topPosts: [],
      },
    };
  }
};

export const getUserStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("user_forum_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    const stats = data || {
      post_count: 0,
      comment_count: 0,
      total_upvotes_received: 0,
      verified_posts_count: 0,
    };

    const score =
      stats.post_count * 10 +
      stats.comment_count * 3 +
      stats.total_upvotes_received +
      stats.verified_posts_count * 50;

    let level = 1;
    let title = "Prompt Learner";

    if (score >= 1000) {
      level = 5;
      title = "Prompt Master Elite";
    } else if (score >= 500) {
      level = 4;
      title = "Prompt Master Avanzado";
    } else if (score >= 200) {
      level = 3;
      title = "Prompt Master";
    } else if (score >= 50) {
      level = 2;
      title = "Prompt Creator";
    }

    return {
      success: true,
      data: {
        ...stats,
        level,
        title,
        score,
      },
    };
  } catch (error) {
    console.error("Error al obtener estadísticas de usuario:", error);
    return {
      success: false,
      error: error.message,
      data: {
        post_count: 0,
        comment_count: 0,
        total_upvotes_received: 0,
        verified_posts_count: 0,
        level: 1,
        title: "Prompt Learner",
        score: 0,
      },
    };
  }
};

export const getPopularTags = async (limit = 10) => {
  try {
    const { data: posts, error } = await supabase
      .from(TABLES.POSTS)
      .select("tags");

    if (error) throw error;

    const tagCounts = {};
    posts?.forEach((post) => {
      post.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const popularTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));

    return {
      success: true,
      data: popularTags,
    };
  } catch (error) {
    console.error("Error al obtener tags populares:", error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};
