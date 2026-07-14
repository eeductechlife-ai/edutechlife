import { supabase } from "../supabase";
import { TABLES, VALIDATION } from "./config";
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

export const getPosts = async ({
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "desc",
  tag = null,
  verifiedOnly = false,
} = {}) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let postsQuery = supabase.from(TABLES.POSTS).select("*").range(from, to);

    if (tag) {
      postsQuery = postsQuery.contains("tags", [tag]);
    }

    if (verifiedOnly) {
      postsQuery = postsQuery.eq("is_verified", true);
    }

    postsQuery = postsQuery.order(sortBy, { ascending: sortOrder === "asc" });

    const { data: posts, error: postsError } = await postsQuery;
    if (postsError) throw postsError;

    if (!posts || posts.length === 0) {
      return {
        success: true,
        data: { posts: [], total: 0 },
        page,
        limit,
        hasMore: false,
      };
    }

    const userIds = [...new Set(posts.map((post) => post.user_id))];

    const userMap = {};

    try {
      const profiles = await getCachedUserProfiles(userIds);

      profiles.forEach((profile, index) => {
        const userId = userIds[index];
        if (profile) {
          userMap[userId] = {
            id: profile.id,
            display_name:
              profile.display_name ||
              profile.full_name ||
              profile.username ||
              profile.email?.split("@")[0] ||
              "Usuario",
            avatar_url: profile.avatar_url || null,
            role: profile.role || "user",
          };
        } else {
          userMap[userId] = {
            id: userId,
            display_name: "Usuario",
            avatar_url: null,
            role: "user",
          };
        }
      });
    } catch (error) {
      logger.warn("Error obteniendo perfiles desde caché", error);
      userIds.forEach((userId) => {
        userMap[userId] = {
          id: userId,
          display_name: "Usuario",
          avatar_url: null,
          role: "user",
        };
      });
    }

    const postIds = posts.map((post) => post.id);
    const { data: commentCounts, error: commentsError } = await supabase
      .from(TABLES.COMMENTS)
      .select("post_id")
      .in("post_id", postIds);

    if (commentsError) {
      console.warn(
        "Error obteniendo contadores de comentarios:",
        commentsError,
      );
    }

    const commentCountMap = {};
    if (commentCounts) {
      commentCounts.forEach((item) => {
        commentCountMap[item.post_id] =
          (commentCountMap[item.post_id] || 0) + 1;
      });
    }

    const enrichedPosts = posts.map((post) => {
      const userInfo = userMap[post.user_id] || {};
      const commentCount = commentCountMap[post.id] || 0;

      return {
        ...post,
        display_name: userInfo.display_name || "Usuario",
        avatar_url: userInfo.avatar_url || null,
        user_role: userInfo.role || "member",
        comment_count: commentCount,
        full_name: userInfo.display_name || "Usuario",
        username: userInfo.display_name
          ? userInfo.display_name.split(" ")[0]
          : "Usuario",
        user_reputation: 0,
        has_voted: false,
      };
    });

    const count = enrichedPosts.length;

    return {
      success: true,
      data: {
        posts: enrichedPosts,
        total: count || enrichedPosts.length,
      },
      page,
      limit,
      hasMore: enrichedPosts.length === limit,
    };
  } catch (error) {
    console.error("Error al obtener posts:", error);
    return {
      success: false,
      error: error.message,
      data: { posts: [], total: 0 },
    };
  }
};

export const getPostsOptimized = async ({
  page = 1,
  limit = 10,
  sortBy = "recent",
  tag = null,
} = {}) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("forum_posts_with_users")
      .select("*")
      .range(from, to);

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    if (sortBy === "recent") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "popular") {
      query = query.order("upvotes", { ascending: false });
    } else if (sortBy === "trending") {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query;

    if (error) {
      logger.error("Error en getPostsOptimized", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: { posts: [], total: 0 },
        page,
        limit,
        hasMore: false,
      };
    }

    const postIds = data.map((post) => post.id);

    const [commentsResult, votesResult] = await Promise.allSettled([
      supabase.from("forum_comments").select("post_id").in("post_id", postIds),
      supabase.from("forum_votes").select("post_id").in("post_id", postIds),
    ]);

    const commentCountMap = {};
    if (commentsResult.status === "fulfilled" && commentsResult.value.data) {
      commentsResult.value.data.forEach((item) => {
        commentCountMap[item.post_id] =
          (commentCountMap[item.post_id] || 0) + 1;
      });
    }

    const voteCountMap = {};
    if (votesResult.status === "fulfilled" && votesResult.value.data) {
      votesResult.value.data.forEach((item) => {
        voteCountMap[item.post_id] = (voteCountMap[item.post_id] || 0) + 1;
      });
    }

    const enrichedPosts = data.map((post) => {
      const commentCount = commentCountMap[post.id] || 0;
      const voteCount = voteCountMap[post.id] || 0;

      return {
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        tags: post.tags || [],
        upvotes: post.upvotes || 0,
        created_at: post.created_at,
        updated_at: post.updated_at,
        is_verified: post.is_verified || false,
        view_count: post.view_count || 0,
        display_name: post.display_name || "Usuario",
        avatar_url: post.avatar_url || null,
        user_role: post.user_role || "member",
        full_name: post.display_name || "Usuario",
        username: post.display_name
          ? post.display_name.split(" ")[0]
          : "Usuario",
        comment_count: commentCount,
        upvote_count: voteCount,
        user_reputation: 0,
        has_voted: false,
      };
    });

    return {
      success: true,
      data: {
        posts: enrichedPosts,
        total: count || enrichedPosts.length,
      },
      page,
      limit,
      hasMore: enrichedPosts.length === limit,
    };
  } catch (error) {
    logger.error("Error en getPostsOptimized", error);
    logger.info("Fallback a getPosts original");
    return getPosts({
      page,
      limit,
      sortBy: sortBy === "recent" ? "created_at" : "upvotes",
      tag,
    });
  }
};

export const createPost = async (content, tags = []) => {
  try {
    if (!content || content.trim().length < VALIDATION.MIN_POST_LENGTH) {
      throw new Error(
        `El contenido debe tener al menos ${VALIDATION.MIN_POST_LENGTH} caracteres`,
      );
    }

    if (content.length > VALIDATION.MAX_POST_LENGTH) {
      throw new Error(
        `El contenido no puede exceder ${VALIDATION.MAX_POST_LENGTH} caracteres`,
      );
    }

    if (tags.length > VALIDATION.MAX_TAGS) {
      throw new Error(`Máximo ${VALIDATION.MAX_TAGS} etiquetas permitidas`);
    }

    if (!userId) {
      throw new Error(
        "Se requiere userId para crear posts (use Clerk authentication)",
      );
    }

    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .insert({
        user_id: userId,
        content: content.trim(),
        tags: tags.map((tag) => tag.trim().toLowerCase()),
        upvotes: 0,
        is_verified: false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: "Post creado exitosamente",
    };
  } catch (error) {
    console.error("Error al crear post:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updatePost = async (postId, updates, userId) => {
  try {
    if (!userId) {
      throw new Error(
        "Se requiere userId para actualizar posts (use Clerk authentication)",
      );
    }

    const { data: post } = await supabase
      .from(TABLES.POSTS)
      .select("user_id")
      .eq("id", postId)
      .maybeSingle();

    if (!post) {
      throw new Error("Post no encontrado");
    }

    if (post.user_id !== userId) {
      throw new Error("No tienes permiso para editar este post");
    }

    if (updates.content) {
      if (updates.content.length < VALIDATION.MIN_POST_LENGTH) {
        throw new Error(
          `El contenido debe tener al menos ${VALIDATION.MIN_POST_LENGTH} caracteres`,
        );
      }
      if (updates.content.length > VALIDATION.MAX_POST_LENGTH) {
        throw new Error(
          `El contenido no puede exceder ${VALIDATION.MAX_POST_LENGTH} caracteres`,
        );
      }
      updates.content = updates.content.trim();
    }

    if (updates.tags && updates.tags.length > VALIDATION.MAX_TAGS) {
      throw new Error(`Máximo ${VALIDATION.MAX_TAGS} etiquetas permitidas`);
    }

    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .update(updates)
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: "Post actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar post:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const deletePost = async (postId, userId) => {
  try {
    if (!userId) {
      throw new Error(
        "Se requiere userId para eliminar posts (use Clerk authentication)",
      );
    }

    const { data: post } = await supabase
      .from(TABLES.POSTS)
      .select("user_id")
      .eq("id", postId)
      .maybeSingle();

    if (!post) {
      throw new Error("Post no encontrado");
    }

    if (post.user_id !== userId) {
      throw new Error("No tienes permiso para eliminar este post");
    }

    const { error } = await supabase
      .from(TABLES.POSTS)
      .delete()
      .eq("id", postId);

    if (error) throw error;

    return {
      success: true,
      message: "Post eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar post:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
