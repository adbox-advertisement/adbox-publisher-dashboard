import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FiSearch,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiVideo,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiPlay,
} from "react-icons/fi";

export const Route = createFileRoute("/campaignHistory/campaignHistory")({
  component: RouteComponent,
});

// const ghanaRegions = [
//   "Greater Accra",
//   "Ashanti",
//   "Western",
//   "Central",
//   "Eastern",
//   "Volta",
//   "Northern",
//   "Upper East",
//   "Upper West",
//   "Bono",
//   "Bono East",
//   "Ahafo",
//   "Savannah",
//   "North East",
//   "Oti",
//   "Western North",
// ];

// Mock data - replace with actual API calls
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

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter campaigns
  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalBudget = mockCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = mockCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCampaigns = mockCampaigns.filter(
    (c) => c.status === "active"
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "scheduled":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateProgress = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Campaign History
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          View and manage all your advertising campaigns
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-700 text-sm font-medium">
              Total Budget
            </span>
            <div className="bg-purple-200 rounded-full p-2">
              <FiDollarSign className="w-4 h-4 text-purple-700" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-purple-900">
            GHS {totalBudget.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 text-sm font-medium">
              Total Spent
            </span>
            <div className="bg-green-200 rounded-full p-2">
              <FiDollarSign className="w-4 h-4 text-green-700" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-green-900">
            GHS {totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 text-sm font-medium">
              Active Campaigns
            </span>
            <div className="bg-blue-200 rounded-full p-2">
              <FiPlay className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-blue-900">
            {activeCampaigns}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="paused">Paused</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FiDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiVideo className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Campaign Header */}
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                        {campaign.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status.charAt(0).toUpperCase() +
                          campaign.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        {formatDate(campaign.startDate)} -{" "}
                        {formatDate(campaign.endDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <FiEye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <FiEdit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <FiTrash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Campaign Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Videos */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiVideo className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">
                        Videos
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {campaign.videos.length} video
                      {campaign.videos.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Total: {campaign.totalDuration}s
                    </p>
                  </div>

                  {/* Budget */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiDollarSign className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">
                        Budget
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      GHS {campaign.budget.toLocaleString()}
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#764ba2] to-[#667eea] h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${calculateProgress(campaign.spent, campaign.budget)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {calculateProgress(
                          campaign.spent,
                          campaign.budget
                        ).toFixed(0)}
                        % spent
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiClock className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">
                        Duration
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.ceil(
                        (new Date(campaign.endDate).getTime() -
                          new Date(campaign.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Campaign period
                    </p>
                  </div>

                  {/* Regions */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">
                        Locations
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {campaign.regions.length} region
                      {campaign.regions.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {campaign.regions.slice(0, 2).join(", ")}
                      {campaign.regions.length > 2 &&
                        ` +${campaign.regions.length - 2}`}
                    </p>
                  </div>
                </div>

                {/* Videos List */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Campaign Videos
                  </h4>
                  <div className="space-y-2">
                    {campaign.videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="bg-gradient-to-br from-[#764ba2] to-[#667eea] rounded-lg p-2">
                          <FiVideo className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {video.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {video.duration} seconds
                          </p>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-white transition-colors">
                          <FiPlay className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regions List */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Target Regions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.regions.map((region) => (
                      <span
                        key={region}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Stats */}
                {campaign.status !== "scheduled" && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Performance
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          Impressions
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {campaign.impressions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Clicks</p>
                        <p className="text-lg font-bold text-gray-900">
                          {campaign.clicks.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">CTR</p>
                        <p className="text-lg font-bold text-gray-900">
                          {campaign.impressions > 0
                            ? (
                                (campaign.clicks / campaign.impressions) *
                                100
                              ).toFixed(2)
                            : 0}
                          %
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Cost/Click</p>
                        <p className="text-lg font-bold text-gray-900">
                          GHS{" "}
                          {campaign.clicks > 0
                            ? (campaign.spent / campaign.clicks).toFixed(2)
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
