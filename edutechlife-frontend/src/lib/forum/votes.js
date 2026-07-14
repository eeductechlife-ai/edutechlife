import { supabase } from "../supabase";

export const upvotePost = async (postId, userId) => {
  try {
    if (!userId) {
      throw new Error(
        "Se requiere userId para votar posts (use Clerk authentication)",
      );
    }

    const { data: newUpvotes, error } = await supabase.rpc(
      "increment_post_upvote",
      { post_id: postId, user_id: userId },
    );

    if (error) throw error;

    return {
      success: true,
      data: { upvotes: newUpvotes },
      message: "Voto registrado exitosamente",
    };
  } catch (error) {
    console.error("Error al votar post:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const removeVote = async (postId, userId) => {
  try {
    if (!userId) {
      throw new Error(
        "Se requiere userId para remover votos (use Clerk authentication)",
      );
    }

    const { data: newUpvotes, error } = await supabase.rpc(
      "decrement_post_upvote",
      { post_id: postId, user_id: userId },
    );

    if (error) throw error;

    return {
      success: true,
      data: { upvotes: newUpvotes },
      message: "Voto removido exitosamente",
    };
  } catch (error) {
    console.error("Error al remover voto:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const checkUserVote = async (postId, userId) => {
  try {
    if (!userId) {
      return { success: true, data: { hasVoted: false } };
    }

    const { data: hasVoted, error } = await supabase.rpc("has_user_voted", {
      post_id: postId,
      user_id: userId,
    });

    if (error) throw error;

    return {
      success: true,
      data: { hasVoted: hasVoted || false },
    };
  } catch (error) {
    console.error("Error al verificar voto:", error);
    return {
      success: false,
      error: error.message,
      data: { hasVoted: false },
    };
  }
};
