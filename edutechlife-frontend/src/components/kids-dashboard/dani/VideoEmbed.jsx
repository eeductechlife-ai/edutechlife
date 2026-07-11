import { memo, useState } from "react";
import { motion } from "framer-motion";

const VideoEmbed = memo(({ videoData, darkMode }) => {
  const [loaded, setLoaded] = useState(false);
  if (!videoData?.url) return null;

  const getId = (url) => {
    const m = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    );
    return m?.[1] || null;
  };

  const videoId = getId(videoData.url);
  if (!videoId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl overflow-hidden my-2 ${loaded ? "" : "cursor-pointer"}`}
      onClick={() => !loaded && setLoaded(true)}
    >
      {loaded ? (
        <div className="relative" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={videoData.title || "Video"}
            className="absolute inset-0 w-full h-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border ${darkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
        >
          <div className="w-12 h-12 rounded-lg bg-[#FF0000] flex items-center justify-center text-white text-xl flex-shrink-0">
            ▶️
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {videoData.title || "Ver video"}
            </p>
            <p className="text-xs text-[#64748B]">YouTube · Toca para cargar</p>
          </div>
        </div>
      )}
    </motion.div>
  );
});
VideoEmbed.displayName = "VideoEmbed";

export default VideoEmbed;
