import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  BarChart3,
  Eye,
  TrendingUp,
  Play,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/")({
  component: Index,
});

// Mock data for analytics
const engagementData = [
  { date: "Jan 1", likes: 1200, comments: 340, views: 5600 },
  { date: "Jan 2", likes: 1800, comments: 520, views: 7200 },
  { date: "Jan 3", likes: 1400, comments: 380, views: 6100 },
  { date: "Jan 4", likes: 2200, comments: 680, views: 8900 },
  { date: "Jan 5", likes: 1900, comments: 590, views: 7800 },
  { date: "Jan 6", likes: 2600, comments: 750, views: 10200 },
  { date: "Jan 7", likes: 2100, comments: 640, views: 8500 },
];

const recentPosts = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop",
    title: "Amazing sunset timelapse",
    likes: 15420,
    comments: 892,
    views: 156000,
    duration: "0:45",
    posted: "2h ago",
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=400&fit=crop",
    title: "Cooking tutorial: Perfect pasta",
    likes: 8930,
    comments: 445,
    views: 89000,
    duration: "2:15",
    posted: "5h ago",
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop",
    title: "Dance challenge compilation",
    likes: 23100,
    comments: 1240,
    views: 234000,
    duration: "1:30",
    posted: "1d ago",
  },
  {
    id: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=400&fit=crop",
    title: "Cat being adorable",
    likes: 45600,
    comments: 2180,
    views: 445000,
    duration: "0:30",
    posted: "2d ago",
  },
];

function Index() {
  const [timeRange, setTimeRange] = useState("7d");

  const totalLikes = engagementData.reduce((sum, day) => sum + day.likes, 0);
  const totalComments = engagementData.reduce(
    (sum, day) => sum + day.comments,
    0
  );
  const totalViews = engagementData.reduce((sum, day) => sum + day.views, 0);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="px-4 py-4 space-y-6">
        {/* Time Range Selector - Floating */}
        <div className="flex justify-end">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/80 backdrop-blur-sm border-0 rounded-xl px-4 py-2 text-sm font-medium shadow-lg shadow-purple-500/10 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)",
            }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Stats Cards with Gradient Theme */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          <div
            className="rounded-2xl shadow-xl p-4 md:p-6 border-0 transform hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            }}
          >
            <div className="text-center md:text-left">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl w-fit mx-auto md:mx-0 mb-3">
                <Heart className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <p className="text-xs md:text-sm text-white/80 mb-1 font-medium">
                Likes
              </p>
              <p className="text-xl md:text-3xl font-bold text-white">
                {formatNumber(totalLikes)}
              </p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-300 mr-1" />
                <span className="text-xs md:text-sm text-emerald-200 font-semibold">
                  +12.5%
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl shadow-xl p-4 md:p-6 border-0 transform hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="text-center md:text-left">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl w-fit mx-auto md:mx-0 mb-3">
                <MessageCircle className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <p className="text-xs md:text-sm text-white/80 mb-1 font-medium">
                Comments
              </p>
              <p className="text-xl md:text-3xl font-bold text-white">
                {formatNumber(totalComments)}
              </p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-300 mr-1" />
                <span className="text-xs md:text-sm text-emerald-200 font-semibold">
                  +8.3%
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl shadow-xl p-4 md:p-6 border-0 transform hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            }}
          >
            <div className="text-center md:text-left">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl w-fit mx-auto md:mx-0 mb-3">
                <Eye className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <p className="text-xs md:text-sm text-white/80 mb-1 font-medium">
                Views
              </p>
              <p className="text-xl md:text-3xl font-bold text-white">
                {formatNumber(totalViews)}
              </p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-300 mr-1" />
                <span className="text-xs md:text-sm text-emerald-200 font-semibold">
                  +15.7%
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl shadow-xl p-4 md:p-6 border-0 transform hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="text-center md:text-left">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl w-fit mx-auto md:mx-0 mb-3">
                <BarChart3 className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <p className="text-xs md:text-sm text-white/80 mb-1 font-medium">
                Engagement
              </p>
              <p className="text-xl md:text-3xl font-bold text-white">4.2%</p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-300 mr-1" />
                <span className="text-xs md:text-sm text-emerald-200 font-semibold">
                  +2.1%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Trends */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/20">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Engagement Trends
          </h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={engagementData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis
                  dataKey="date"
                  stroke="#6366f1"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#6366f1"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                    border: "1px solid rgba(118, 75, 162, 0.2)",
                    borderRadius: "12px",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    fontSize: "12px",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#764ba2"
                  strokeWidth={3}
                  dot={{
                    fill: "#764ba2",
                    r: 4,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, stroke: "#764ba2", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{
                    fill: "#667eea",
                    r: 4,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, stroke: "#667eea", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    fill: "#10b981",
                    r: 4,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Mobile Legend */}
          <div className="flex justify-center space-x-6 mt-4 md:hidden">
            <div className="flex items-center text-xs">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: "#764ba2" }}
              ></div>
              <span className="font-medium text-gray-700">Likes</span>
            </div>
            <div className="flex items-center text-xs">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: "#667eea" }}
              ></div>
              <span className="font-medium text-gray-700">Comments</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              <span className="font-medium text-gray-700">Views</span>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="p-4 md:p-6 border-b border-purple-100/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Recent Posts
              </h3>
              <button
                className="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  color: "white",
                }}
              >
                View all
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6">
            {recentPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="relative rounded-xl overflow-hidden mb-3 transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-32 md:h-48 object-cover"
                  />
                  <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    }}
                  ></div>
                  <div className="absolute top-2 right-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                      <MoreHorizontal className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-semibold">
                    {post.duration}
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Play className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 text-xs md:text-sm line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
                    {post.title}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1 text-red-400" />
                        <span className="font-medium">
                          {formatNumber(post.likes)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1 text-blue-400" />
                        <span className="font-medium">
                          {formatNumber(post.comments)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="truncate font-medium">{post.posted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
