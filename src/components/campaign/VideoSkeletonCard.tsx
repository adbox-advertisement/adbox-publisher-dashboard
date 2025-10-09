import { Clock } from "lucide-react";
import { type JSX } from "react";

export function VideoSkeletonCard(): JSX.Element {
  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden animate-pulse max-w-sm">
      {/* Video Thumbnail Skeleton */}
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden relative">
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite",
            }}
          />
          {/* Processing overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
              <div className="w-6 h-6 border-3 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          </div>
          {/* Duration badge skeleton */}
          <div className="absolute bottom-2 right-2 bg-black/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <div className="w-8 h-3 bg-gray-600 rounded"></div>
          </div>
          {/* Selection checkbox skeleton */}
          <div className="absolute top-2 right-2">
            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-white/70"></div>
          </div>
        </div>
      </div>
      {/* Video Info Skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
        {/* Date skeleton */}
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function SkeletonDemo() {
  return (
    <div>
      <VideoSkeletonCard />
    </div>
  );
}
