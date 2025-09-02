import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  BarChart3,
  Eye,
  TrendingUp,
  Menu,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/analytics/")({
  component: Analytics,
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

const surveyData = [
  { name: "Very Satisfied", value: 45, color: "#10b981" },
  { name: "Satisfied", value: 32, color: "#3b82f6" },
  { name: "Neutral", value: 15, color: "#f59e0b" },
  { name: "Dissatisfied", value: 8, color: "#ef4444" },
];

function Analytics() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Menu className="w-5 h-5 text-gray-600 md:hidden" />
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                Analytics
              </h1>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">7d</option>
              <option value="30d">30d</option>
              <option value="90d">90d</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Stats Cards - Mobile First */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 border border-gray-200">
            <div className="text-center md:text-left">
              <div className="bg-pink-100 p-2 md:p-3 rounded-lg w-fit mx-auto md:mx-0 mb-2">
                <Heart className="w-4 h-4 md:w-6 md:h-6 text-pink-600" />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Likes</p>
              <p className="text-lg md:text-3xl font-bold text-gray-900">
                {formatNumber(totalLikes)}
              </p>
              <div className="flex items-center justify-center md:justify-start mt-1 md:mt-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1" />
                <span className="text-xs md:text-sm text-green-600">
                  +12.5%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 border border-gray-200">
            <div className="text-center md:text-left">
              <div className="bg-blue-100 p-2 md:p-3 rounded-lg w-fit mx-auto md:mx-0 mb-2">
                <MessageCircle className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Comments</p>
              <p className="text-lg md:text-3xl font-bold text-gray-900">
                {formatNumber(totalComments)}
              </p>
              <div className="flex items-center justify-center md:justify-start mt-1 md:mt-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1" />
                <span className="text-xs md:text-sm text-green-600">+8.3%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 border border-gray-200">
            <div className="text-center md:text-left">
              <div className="bg-purple-100 p-2 md:p-3 rounded-lg w-fit mx-auto md:mx-0 mb-2">
                <Eye className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Views</p>
              <p className="text-lg md:text-3xl font-bold text-gray-900">
                {formatNumber(totalViews)}
              </p>
              <div className="flex items-center justify-center md:justify-start mt-1 md:mt-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1" />
                <span className="text-xs md:text-sm text-green-600">
                  +15.7%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 border border-gray-200">
            <div className="text-center md:text-left">
              <div className="bg-orange-100 p-2 md:p-3 rounded-lg w-fit mx-auto md:mx-0 mb-2">
                <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-orange-600" />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">
                Engagement
              </p>
              <p className="text-lg md:text-3xl font-bold text-gray-900">
                4.2%
              </p>
              <div className="flex items-center justify-center md:justify-start mt-1 md:mt-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1" />
                <span className="text-xs md:text-sm text-green-600">+2.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Trends - Full Width on Mobile */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            Engagement Trends
          </h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={engagementData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={{ fill: "#ec4899", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Mobile Legend */}
          <div className="flex justify-center space-x-4 mt-3 md:hidden">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-1"></div>
              <span>Likes</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span>Comments</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span>Views</span>
            </div>
          </div>
        </div>

        {/* Survey Results */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            User Satisfaction
          </h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={surveyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {surveyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {surveyData.map((item, index) => (
              <div key={index} className="flex items-center text-xs md:text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-600 truncate">{item.name}</span>
                <span className="font-semibold ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
