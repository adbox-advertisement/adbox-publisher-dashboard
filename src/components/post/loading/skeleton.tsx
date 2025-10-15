import { type JSX } from "react";

// Skeleton Card Component
export function SkeletonCard({ index }: { index: number }): JSX.Element {
  const statuses = [
    "Uploading...",
    "Processing video...",
    "Transcoding...",
    "Generating thumbnail...",
    "Almost ready...",
  ];

  const status = statuses[index % statuses.length];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Skeleton Thumbnail */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse"></div>
            {/* Processing overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Skeleton Post Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 pr-2">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0 animate-pulse"></div>
            </div>

            {/* Processing Status */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                Processing
              </span>
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-yellow-600 text-xs font-medium ml-1">
                  {status}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-yellow-500 h-1.5 rounded-full animate-pulse"
                  style={{ width: `${20 + index * 15}%` }}
                ></div>
              </div>
            </div>

            {/* Skeleton Stats */}
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-1 opacity-50">
                  <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="bg-gray-200 h-3 w-8 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
