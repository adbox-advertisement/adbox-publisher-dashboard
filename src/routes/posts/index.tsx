import { createFileRoute } from "@tanstack/react-router";
import { useState, type JSX } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Play,
  Search,
  Edit3,
  Trash2,
  BarChart3,
  Download,
  Copy,
} from "lucide-react";

// Type definitions
interface Post {
  id: number;
  title: string;
  thumbnail: string;
  type: "video" | "image";
  duration: string | null;
  status: "published" | "scheduled" | "draft";
  publishDate: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  isPrivate: boolean;
}

type FilterStatus = "all" | "published" | "scheduled" | "draft";
type SortBy = "publishDate" | "views" | "likes" | "comments" | "engagement";

export const Route = createFileRoute("/posts/")({
  component: Posts,
});

function Posts(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Summer vibes and good times",
      thumbnail:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop&crop=center",
      type: "video",
      duration: "0:45",
      status: "published",
      publishDate: "2024-09-01",
      views: 125400,
      likes: 8930,
      comments: 542,
      shares: 186,
      engagement: 7.8,
      isPrivate: false,
    },
    {
      id: 2,
      title: "Quick cooking hack you need to try",
      thumbnail:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
      type: "video",
      duration: "0:32",
      status: "published",
      publishDate: "2024-08-30",
      views: 89200,
      likes: 6750,
      comments: 328,
      shares: 445,
      engagement: 8.4,
      isPrivate: false,
    },
    {
      id: 3,
      title: "Behind the scenes of our photoshoot",
      thumbnail:
        "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=400&fit=crop&crop=center",
      type: "image",
      duration: null,
      status: "scheduled",
      publishDate: "2024-09-05",
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0,
      isPrivate: false,
    },
    {
      id: 4,
      title: "Monday motivation quote",
      thumbnail:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center",
      type: "image",
      duration: null,
      status: "draft",
      publishDate: null,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0,
      isPrivate: true,
    },
    {
      id: 5,
      title: "Live stream highlights",
      thumbnail:
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&crop=center",
      type: "video",
      duration: "2:15",
      status: "published",
      publishDate: "2024-08-28",
      views: 45600,
      likes: 3240,
      comments: 189,
      shares: 87,
      engagement: 7.7,
      isPrivate: false,
    },
  ]);

  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("publishDate");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getStatusColor = (status: Post["status"]): string => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const filteredPosts: Post[] = posts.filter((post) => {
    const matchesStatus: boolean =
      filterStatus === "all" || post.status === filterStatus;
    const matchesSearch: boolean = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const togglePostSelection = (postId: number): void => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="px-4 py-6">
        {/* Mobile Search and Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["all", "published", "scheduled", "draft"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    filterStatus === status
                      ? "bg-[#764ba2] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status === "all"
                    ? "All Posts"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Mobile Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Post Header */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                    {post.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {post.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {post.duration}
                      </div>
                    )}
                  </div>

                  {/* Post Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900 font-medium text-sm leading-tight pr-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <button
                        onClick={() =>
                          setExpandedPost(
                            expandedPost === post.id ? null : post.id
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}
                      >
                        {post.status}
                      </span>
                      {post.publishDate && (
                        <span className="text-gray-500 text-xs">
                          {new Date(post.publishDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Mobile Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(post.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{formatNumber(post.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{formatNumber(post.comments)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        <span>{formatNumber(post.shares)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Actions */}
              {expandedPost === post.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50/70">
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 rounded-lg text-gray-700 text-sm hover:bg-gray-200 transition-all">
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 rounded-lg text-gray-700 text-sm hover:bg-gray-200 transition-all">
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 rounded-lg text-gray-700 text-sm hover:bg-gray-200 transition-all">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 rounded-lg text-gray-700 text-sm hover:bg-gray-200 transition-all">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>

                  {/* Detailed Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-gray-800 text-sm font-medium mb-3">
                      Performance Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Engagement Rate
                        </span>
                        <span className="text-gray-900 font-medium">
                          {post.engagement}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Views</span>
                        <span className="text-gray-900 font-medium">
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Likes</span>
                        <span className="text-gray-900 font-medium">
                          {post.likes.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Comments</span>
                        <span className="text-gray-900 font-medium">
                          {post.comments.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Shares</span>
                        <span className="text-gray-900 font-medium">
                          {post.shares.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-100 rounded-lg text-red-700 text-sm hover:bg-red-200 transition-all">
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">No posts found</p>
              <p className="text-gray-500 text-sm">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>

        {/* Mobile Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl p-4 border border-gray-300 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 text-sm font-medium">
                {selectedPosts.length} selected
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm hover:bg-gray-200 transition-all">
                  Export
                </button>
                <button className="px-3 py-2 bg-red-100 rounded-lg text-red-700 text-sm hover:bg-red-200 transition-all">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
