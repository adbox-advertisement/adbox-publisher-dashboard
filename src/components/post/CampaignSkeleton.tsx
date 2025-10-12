import { Clock, MapPin, Video, DollarSign } from "lucide-react";
import { type JSX } from "react";

export function CampaignSkeletonCard(): JSX.Element {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse  mx-auto">
      {/* Campaign Header */}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Videos */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-4 h-4 text-gray-400" />
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
          </div>

          {/* Budget */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <div className="h-3 w-14 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 w-full bg-gray-200 rounded-full"></div>
            <div className="h-3 w-16 bg-gray-200 rounded mt-1"></div>
          </div>

          {/* Duration */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div className="h-3 w-14 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>

          {/* Regions */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
          </div>
        </div>

        {/* Videos Accordion */}
        <div className="border-t border-gray-200 pt-4 mt-2">
          <div className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-gray-400" />
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
          </div>

          {/* Placeholder for expanding videos */}
          <div className="mt-4 space-y-3">
            {Array.from({ length: 1 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-gray-50 rounded-xl shadow-sm"
              >
                <div className="relative flex-shrink-0 w-full sm:w-32 md:w-40 bg-gray-200 aspect-video rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="flex gap-3">
                    <div className="h-3 w-10 bg-gray-200 rounded"></div>
                    <div className="h-3 w-10 bg-gray-200 rounded"></div>
                    <div className="h-3 w-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 w-14 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="px-3 py-1 bg-gray-100 rounded-full h-6 w-20"
              ></div>
            ))}
          </div>
        </div>

        {/* Performance Section */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default function CampaignSkeletonDemo() {
  return (
    <div className="space-y-6">
      {[1].map((i) => (
        <CampaignSkeletonCard key={i} />
      ))}
    </div>
  );
}
