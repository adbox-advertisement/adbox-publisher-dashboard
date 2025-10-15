import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface HLSPlayerProps {
  src?: string; // optional initial URL
  autoPlay?: boolean;
}

export default function HLSPlayer({
  src = "",
  autoPlay = false,
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [url, setUrl] = useState(src);

  useEffect(() => {
    if (!url || !videoRef.current) return;
    const video = videoRef.current;

    // If the browser supports HLS natively (Safari, iOS)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      if (autoPlay) video.play();
      return;
    }

    // Otherwise, use hls.js
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play();
      });

      return () => hls.destroy();
    }
  }, [url, autoPlay]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-xl font-semibold text-gray-800">HLS Test Player</h2>

      <video
        ref={videoRef}
        controls
        className="w-full max-w-2xl bg-black rounded-lg shadow-md"
      />

      <div className="flex gap-2 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Enter .m3u8 URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={() => setUrl(url.trim())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Load
        </button>
      </div>
    </div>
  );
}
