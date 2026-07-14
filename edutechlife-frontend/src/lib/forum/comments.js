import { supabase } from "../supabase";
import { TABLES, VALIDATION } from "./config";

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

export const getComments = async (postId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error al obtener comentarios", error);
    throw error;
  }
};

export const getCommentsBatch = async (postIds) => {
  try {
    if (!postIds || postIds.length === 0) {
      return {};
    }

    const batchSize = 20;
    const batches = [];

    for (let i = 0; i < postIds.length; i += batchSize) {
      batches.push(postIds.slice(i, i + batchSize));
    }

    const results = {};

    await Promise.all(
      batches.map(async (batch) => {
        const { data, error } = await supabase
          .from(TABLES.COMMENTS)
          .select("*")
          .in("post_id", batch)
          .order("created_at", { ascending: false });

        if (error) {
          logger.warn("Error obteniendo batch de comentarios", error);
          return;
        }

        data?.forEach((comment) => {
          if (!results[comment.post_id]) {
            results[comment.post_id] = [];
          }
          results[comment.post_id].push(comment);
        });
      }),
    );

    return results;
  } catch (error) {
    logger.error("Error en getCommentsBatch", error);
    return {};
  }
};

export const getPostDetails = async (postId, userId) => {
  try {
    const isBatch = Array.isArray(postId);
    const postIds = isBatch ? postId : [postId];

    const [commentsBatchPromise, votesPromise] = await Promise.allSettled([
      getCommentsBatch(postIds),

      userId
        ? supabase
            .from(TABLES.VOTES)
            .select("post_id")
            .in("post_id", postIds)
            .eq("user_id", userId)
        : Promise.resolve({ data: [], error: null }),
    ]);

    const commentsBatch =
      commentsBatchPromise.status === "fulfilled"
        ? commentsBatchPromise.value
        : {};

    const userVotes =
      votesPromise.status === "fulfilled" && votesPromise.value.data
        ? new Set(votesPromise.value.data.map((v) => v.post_id))
        : new Set();

    const results = postIds.map((id) => {
      const comments = commentsBatch[id] || [];
      const userVote = userVotes.has(id) ? "upvote" : null;

      return {
        comments,
        userVote,
        hasError:
          commentsBatchPromise.status === "rejected" ||
          votesPromise.status === "rejected",
      };
    });

    return isBatch ? results : results[0];
  } catch (error) {
    console.error("Error fetching post details:", error);
    const defaultResult = {
      comments: [],
      userVote: null,
      hasError: true,
    };

    return Array.isArray(postId)
      ? postId.map(() => defaultResult)
      : defaultResult;
  }
};

export const addComment = async (postId, content) => {
  try {
    if (!content || content.trim().length < VALIDATION.MIN_COMMENT_LENGTH) {
      throw new Error("El comentario no puede estar vacío");
    }

    if (content.length > VALIDATION.MAX_COMMENT_LENGTH) {
      throw new Error(
        `El comentario no puede exceder ${VALIDATION.MAX_COMMENT_LENGTH} caracteres`,
      );
    }

    if (!userId) {
      throw new Error(
        "Se requiere userId para crear comentarios (use Clerk authentication)",
      );
    }

    const { data: post } = await supabase
      .from(TABLES.POSTS)
      .select("id")
      .eq("id", postId)
      .maybeSingle();

    if (!post) {
      throw new Error("Post no encontrado");
    }

    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .insert({
        post_id: postId,
        user_id: userId,
        content: content.trim(),
      })
      .select(
        `
        *,
        user:profiles(id, display_name, avatar_url, role)
      `,
      )
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: "Comentario agregado exitosamente",
    };
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
