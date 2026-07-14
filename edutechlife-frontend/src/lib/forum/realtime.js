import { supabase } from "../supabase";
import { TABLES } from "./config";

export const subscribeToForumUpdates = (onUpdate, onError) => {
  try {
    const channel = supabase.channel("forum-updates");

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLES.POSTS,
        },
        (payload) => {
          const update = {
            type: `${payload.table}_${payload.eventType}`,
            data: payload.new || payload.old,
            oldData: payload.old,
            eventType: payload.eventType,
            table: payload.table,
            timestamp: new Date().toISOString(),
          };
          onUpdate(update);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLES.COMMENTS,
        },
        (payload) => {
          const update = {
            type: `${payload.table}_${payload.eventType}`,
            data: payload.new || payload.old,
            oldData: payload.old,
            eventType: payload.eventType,
            table: payload.table,
            timestamp: new Date().toISOString(),
          };
          onUpdate(update);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLES.VOTES,
        },
        (payload) => {
          const update = {
            type: `${payload.table}_${payload.eventType}`,
            data: payload.new || payload.old,
            oldData: payload.old,
            eventType: payload.eventType,
            table: payload.table,
            timestamp: new Date().toISOString(),
          };
          onUpdate(update);
        },
      );

    const subscription = channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
      } else if (status === "CHANNEL_ERROR") {
        console.error("❌ Error en canal del foro");
        if (onError) onError(new Error("Channel error"));
      } else if (status === "TIMED_OUT") {
        console.warn("⚠️ Timeout en canal del foro");
        if (onError) onError(new Error("Channel timeout"));
      }
    });

    return {
      unsubscribe: () => {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.warn("Error al desuscribirse:", err);
        }
      },
      channel,
      subscription,
    };
  } catch (error) {
    console.error("Error al suscribirse a updates:", error);
    if (onError) onError(error);

    return {
      unsubscribe: () => {},
      error: error.message,
    };
  }
};
