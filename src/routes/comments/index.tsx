import React, { useState, type JSX } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MessageCircle,
  TrendingUp,
  Heart,
  Reply,
  MoreHorizontal,
  Search,
  Filter,
  Eye,
  Users,
  ThumbsUp,
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

export const Route = createFileRoute("/comments/")({
  component: Comments,
});

// Types
interface Video {
  id: number;
  title: string;
  thumbnail: string;
  views: number;
  comments: number;
  likes: number;
  uploadDate: string;
  engagement: number;
}

interface Comment {
  id: number;
  videoId: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  sentiment: "positive" | "neutral" | "negative";
}

interface ChartDataPoint {
  name: string;
  comments: number;
  engagement: number;
}

interface SentimentData {
  name: string;
  value: number;
  color: string;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  trend?: number;
  color?: string;
}

interface CommentCardProps {
  comment: Comment;
}

interface VideoCardProps {
  video: Video;
  isSelected: boolean;
  onClick: () => void;
}

type TabType = "overview" | "videos" | "comments";
type SentimentFilter = "all" | "positive" | "neutral" | "negative";

// Mock data with proper typing
const mockVideos: Video[] = [
  {
    id: 1,
    title: "How to Build a React Dashboard",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
    views: 12500,
    comments: 187,
    likes: 892,
    uploadDate: "2024-01-15",
    engagement: 7.2,
  },
  {
    id: 2,
    title: "JavaScript Tips & Tricks 2024",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
    views: 8900,
    comments: 134,
    likes: 567,
    uploadDate: "2024-01-12",
    engagement: 8.1,
  },
  {
    id: 3,
    title: "Mobile App Design Principles",
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop",
    views: 15600,
    comments: 203,
    likes: 1204,
    uploadDate: "2024-01-10",
    engagement: 9.0,
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    videoId: 1,
    author: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=40&h=40&fit=crop&crop=face",
    content:
      "This tutorial is amazing! Really helped me understand React hooks better. Thank you for the clear explanation.",
    timestamp: "2 hours ago",
    likes: 12,
    replies: 3,
    sentiment: "positive",
  },
  {
    id: 2,
    videoId: 1,
    author: "Mike Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    content: "Could you make a follow-up video about advanced patterns?",
    timestamp: "4 hours ago",
    likes: 8,
    replies: 1,
    sentiment: "neutral",
  },
  {
    id: 3,
    videoId: 2,
    author: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    content:
      "The JavaScript ecosystem changes so fast, it's hard to keep up sometimes.",
    timestamp: "1 day ago",
    likes: 15,
    replies: 5,
    sentiment: "neutral",
  },
  {
    id: 4,
    videoId: 3,
    author: "Alex Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    content:
      "Great insights on mobile design! The accessibility tips were particularly helpful.",
    timestamp: "3 days ago",
    likes: 23,
    replies: 7,
    sentiment: "positive",
  },
  {
    id: 5,
    videoId: 1,
    author: "Lisa Park",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    content:
      "I'm having trouble implementing this in my project. The useState hook isn't working as expected.",
    timestamp: "5 hours ago",
    likes: 4,
    replies: 2,
    sentiment: "negative",
  },
  {
    id: 6,
    videoId: 2,
    author: "David Wilson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    content:
      "Excellent explanation of closures! This finally makes sense to me.",
    timestamp: "1 day ago",
    likes: 18,
    replies: 4,
    sentiment: "positive",
  },
];

const chartData: ChartDataPoint[] = [
  { name: "Mon", comments: 45, engagement: 6.2 },
  { name: "Tue", comments: 52, engagement: 7.1 },
  { name: "Wed", comments: 48, engagement: 6.8 },
  { name: "Thu", comments: 67, engagement: 8.3 },
  { name: "Fri", comments: 73, engagement: 9.1 },
  { name: "Sat", comments: 89, engagement: 8.7 },
  { name: "Sun", comments: 56, engagement: 7.4 },
];

const sentimentData: SentimentData[] = [
  { name: "Positive", value: 65, color: "#10B981" },
  { name: "Neutral", value: 25, color: "#6B7280" },
  { name: "Negative", value: 10, color: "#EF4444" },
];

function Comments(): JSX.Element {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterSentiment, setFilterSentiment] =
    useState<SentimentFilter>("all");
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const filteredComments: Comment[] = mockComments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment =
      filterSentiment === "all" || comment.sentiment === filterSentiment;
    const matchesVideo = !selectedVideo || comment.videoId === selectedVideo.id;

    return matchesSearch && matchesSentiment && matchesVideo;
  });

  const getCommentsForVideo = (videoId: number): Comment[] => {
    return mockComments.filter((comment) => comment.videoId === videoId);
  };

  const getSentimentColor = (sentiment: Comment["sentiment"]): string => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    title,
    value,
    trend,
    color = "blue",
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend !== undefined && (
            <p
              className={`text-sm mt-1 ${trend > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}% vs last week
            </p>
          )}
        </div>
        <div className={`p-3 bg-${color}-50 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const CommentCard: React.FC<CommentCardProps> = ({ comment }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start space-x-3">
        <img
          src={comment.avatar}
          alt={comment.author}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}&background=random`;
          }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{comment.author}</h4>
              <p className="text-sm text-gray-500">{comment.timestamp}</p>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs ${getSentimentColor(comment.sentiment)}`}
            >
              {comment.sentiment}
            </div>
          </div>
          <p className="text-gray-700 mt-2">{comment.content}</p>
          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
            <button
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
              onClick={() => console.log("Like comment", comment.id)}
            >
              <Heart className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>
            <button
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
              onClick={() => console.log("Reply to comment", comment.id)}
            >
              <Reply className="w-4 h-4" />
              <span>{comment.replies} replies</span>
            </button>
            <button
              className="flex items-center space-x-1 hover:text-gray-600 transition-colors"
              onClick={() =>
                console.log("More options for comment", comment.id)
              }
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VideoCard: React.FC<VideoCardProps> = ({
    video,
    isSelected,
    onClick,
  }) => (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-100 hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <div className="flex space-x-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-20 h-12 rounded object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop";
          }}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
            {video.title}
          </h3>
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{video.views.toLocaleString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3" />
              <span>{video.comments}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{video.likes}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleVideoSelect = (video: Video): void => {
    setSelectedVideo(video);
  };

  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleSentimentFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setFilterSentiment(e.target.value as SentimentFilter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-between h-16">
            <div className=" items-center space-x-4 hidden sm:flex">
              <h1 className="text-xl font-bold text-gray-900">
                Comments Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search comments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(["overview", "videos", "comments"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={MessageCircle}
                title="Total Comments"
                value="1,247"
                trend={12}
                color="blue"
              />
              <StatCard
                icon={TrendingUp}
                title="Engagement Rate"
                value="7.8%"
                trend={3.2}
                color="green"
              />
              <StatCard
                icon={Users}
                title="Active Commenters"
                value="892"
                trend={8}
                color="purple"
              />
              <StatCard
                icon={ThumbsUp}
                title="Positive Sentiment"
                value="65%"
                trend={-2}
                color="emerald"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Comments Timeline */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Comments This Week
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sentiment Analysis */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sentiment Analysis
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {sentimentData.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`w-3 h-3 rounded-full`}
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {entry.name} ({entry.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video List */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Videos
              </h3>
              <div className="space-y-3">
                {mockVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    isSelected={selectedVideo?.id === video.id}
                    onClick={() => handleVideoSelect(video)}
                  />
                ))}
              </div>
            </div>

            {/* Video Details */}
            <div className="lg:col-span-2">
              {selectedVideo ? (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4 mb-6">
                    <img
                      src={selectedVideo.thumbnail}
                      alt={selectedVideo.title}
                      className="w-32 h-20 rounded object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop";
                      }}
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedVideo.title}
                      </h2>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>
                          {selectedVideo.views.toLocaleString()} views
                        </span>
                        <span>{selectedVideo.comments} comments</span>
                        <span>{selectedVideo.likes} likes</span>
                      </div>
                    </div>
                  </div>

                  {/* Video Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Views
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {selectedVideo.views.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">
                          Comments
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {selectedVideo.comments}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">
                          Engagement
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        {selectedVideo.engagement}%
                      </p>
                    </div>
                  </div>

                  {/* Recent Comments for Selected Video */}
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Comments
                  </h4>
                  <div className="space-y-4">
                    {getCommentsForVideo(selectedVideo.id)
                      .slice(0, 3)
                      .map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                      ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-100 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Video
                  </h3>
                  <p className="text-gray-500">
                    Choose a video from the list to view its comments and
                    analytics
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterSentiment}
                    onChange={handleSentimentFilterChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Sentiments</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
                <p className="text-sm text-gray-500">
                  Showing {filteredComments.length} of {mockComments.length}{" "}
                  comments
                </p>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {filteredComments.length > 0 ? (
                filteredComments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))
              ) : (
                <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-100 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Comments Found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
