import { createFileRoute } from "@tanstack/react-router";
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Video,
  MapPin,
  Clock,
  Calendar,
  Eye,
  Edit2,
  Play,
} from "lucide-react";

export const Route = createFileRoute("/campaignHistory/campaignHistory")({
  component: CampaignHistory,
});

// Mock data
const mockCampaigns = [
  {
    id: "1",
    name: "Summer Sale 2025",
    status: "active",
    videos: [
      { id: "v1", name: "Summer_Ad_30s.mp4", duration: 30, thumbnail: "" },
      { id: "v2", name: "Product_Showcase.mp4", duration: 45, thumbnail: "" },
    ],
    totalDuration: 75,
    budget: 5000,
    spent: 3200,
    regions: ["Greater Accra", "Ashanti", "Western"],
    startDate: "2025-09-15T00:00:00",
    endDate: "2025-10-15T23:59:59",
    impressions: 45230,
    clicks: 3421,
  },
  {
    id: "2",
    name: "Product Launch - New Collection",
    status: "completed",
    videos: [
      { id: "v3", name: "Launch_Video.mp4", duration: 60, thumbnail: "" },
    ],
    totalDuration: 60,
    budget: 3500,
    spent: 3500,
    regions: ["Greater Accra", "Central", "Eastern"],
    startDate: "2025-08-01T00:00:00",
    endDate: "2025-08-31T23:59:59",
    impressions: 32100,
    clicks: 2543,
  },
  {
    id: "3",
    name: "Back to School Campaign",
    status: "scheduled",
    videos: [
      { id: "v4", name: "School_Ad_15s.mp4", duration: 15, thumbnail: "" },
      { id: "v5", name: "School_Ad_30s.mp4", duration: 30, thumbnail: "" },
    ],
    totalDuration: 45,
    budget: 4200,
    spent: 0,
    regions: ["Greater Accra", "Ashanti", "Eastern", "Northern"],
    startDate: "2025-11-01T00:00:00",
    endDate: "2025-11-30T23:59:59",
    impressions: 0,
    clicks: 0,
  },
  {
    id: "4",
    name: "Holiday Special Promotion",
    status: "paused",
    videos: [
      { id: "v6", name: "Holiday_Promo.mp4", duration: 40, thumbnail: "" },
    ],
    totalDuration: 40,
    budget: 6000,
    spent: 1800,
    regions: ["Greater Accra", "Ashanti", "Western", "Central", "Volta"],
    startDate: "2025-09-20T00:00:00",
    endDate: "2025-12-25T23:59:59",
    impressions: 18500,
    clicks: 1230,
  },
];

export default function CampaignHistory() {
  const totalBudget = mockCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = mockCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = mockCampaigns.reduce(
    (sum, c) => sum + c.impressions,
    0
  );

  const getStatusConfig = () => ({
    bg: "bg-blue-500",
    text: "text-blue-700",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    icon: Target,
    label: "Completed",
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = (spent: number, budget: number) =>
    Math.min((spent / budget) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {/* Total Budget */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 rounded-xl p-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">
                Total Budget
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalBudget.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">GHS</p>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 rounded-xl p-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">Spent</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {((totalSpent / totalBudget) * 100).toFixed(0)}% of budget
            </p>
          </div>

          {/* Impressions */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 rounded-xl p-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">
                Impressions
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(totalImpressions / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-gray-500 mt-1">Total reach</p>
          </div>

          {/* Total Campaigns */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-100 rounded-xl p-2">
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">
                Total Campaigns
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {mockCampaigns.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">All completed</p>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {mockCampaigns.map((campaign) => {
            const statusConfig = getStatusConfig();
            const StatusIcon = statusConfig.icon;
            const ctr =
              campaign.impressions > 0
                ? (campaign.clicks / campaign.impressions) * 100
                : 0;

            return (
              <div
                key={campaign.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {campaign.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bgLight} border ${statusConfig.border}`}
                        >
                          <StatusIcon
                            className={`w-3.5 h-3.5 ${statusConfig.text}`}
                          />
                          <span
                            className={`text-xs font-semibold ${statusConfig.text}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(campaign.startDate)} -{" "}
                          {formatDate(campaign.endDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-white rounded-lg p-2 border border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Video className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-xs text-gray-600">Videos</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {campaign.videos.length}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs text-gray-600">Regions</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {campaign.regions.length}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs text-gray-600">Duration</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {campaign.totalDuration}s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="p-5 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Budget Progress
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      GHS {campaign.spent.toLocaleString()} /{" "}
                      {campaign.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${calculateProgress(
                          campaign.spent,
                          campaign.budget
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {calculateProgress(campaign.spent, campaign.budget).toFixed(
                      1
                    )}
                    % utilized
                  </p>
                </div>

                {/* Metrics */}
                <div className="px-5 pb-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
                      <p className="text-xs text-blue-700 font-medium mb-1">
                        Impressions
                      </p>
                      <p className="text-lg font-bold text-blue-900">
                        {(campaign.impressions / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                      <p className="text-xs text-purple-700 font-medium mb-1">
                        Clicks
                      </p>
                      <p className="text-lg font-bold text-purple-900">
                        {campaign.clicks.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-100">
                      <p className="text-xs text-emerald-700 font-medium mb-1">
                        CTR
                      </p>
                      <p className="text-lg font-bold text-emerald-900">
                        {ctr.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video + Regions Section */}
                <div className="border-t border-gray-100 bg-gray-50 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Campaign Video */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-600" />
                      Campaign Video
                    </h4>
                    {campaign.videos.length > 0 ? (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-colors">
                        <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg p-2">
                          <Video className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {campaign.videos[0].name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {campaign.videos[0].duration}s
                          </p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Play className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No videos</p>
                    )}
                  </div>

                  {/* Regions */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Target Regions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.regions.map((region) => (
                        <span
                          key={region}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
