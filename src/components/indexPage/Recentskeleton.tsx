// Skeleton component for loading posts
export function PostSkeleton() {
  return (
    <div className="group cursor-pointer animate-pulse">
      <div className="relative rounded-xl overflow-hidden mb-3 bg-gray-200 h-32 md:h-48 shadow-lg">
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]"></div>

        {/* Play button skeleton */}
        <div className="absolute bottom-2 left-2">
          <div className="bg-gray-300 rounded-full p-2 w-8 h-8 md:w-10 md:h-10"></div>
        </div>

        {/* Duration skeleton */}
        <div className="absolute bottom-2 right-2 bg-gray-300 text-transparent text-xs px-2 py-1 rounded-lg">
          00:00
        </div>
      </div>

      <div className="space-y-2">
        {/* Title skeleton */}
        <div className="space-y-1">
          <div className="h-3 md:h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Stats skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-6"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-6"></div>
            </div>
          </div>
        </div>

        {/* Date skeleton */}
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}
