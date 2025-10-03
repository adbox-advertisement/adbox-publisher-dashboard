import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FiSearch,
  FiDownload,
  FiArrowUp,
  FiArrowDown,
  FiCreditCard,
  FiTrendingUp,
  FiCalendar,
} from "react-icons/fi";

export const Route = createFileRoute("/transactions/transactions")({
  component: RouteComponent,
});

// Mock data - replace with actual API calls
const mockTransactions = [
  {
    id: "1",
    type: "mobile_money",
    status: "completed",
    amount: 250.0,
    currency: "GHS",
    direction: "credit",
    description: "Mobile Money Deposit",
    date: "2025-10-02T10:30:00",
    reference: "MM-2025-001234",
    method: "MTN Mobile Money",
  },
  {
    id: "2",
    type: "campaign",
    status: "completed",
    amount: 150.0,
    currency: "GHS",
    direction: "debit",
    description: "Campaign: Summer Sale 2025",
    date: "2025-10-01T14:20:00",
    reference: "CMP-2025-005678",
    campaignId: "camp_123",
  },
  {
    id: "3",
    type: "mobile_money",
    status: "pending",
    amount: 500.0,
    currency: "GHS",
    direction: "credit",
    description: "Mobile Money Deposit",
    date: "2025-10-02T16:45:00",
    reference: "MM-2025-001235",
    method: "Vodafone Cash",
  },
  {
    id: "4",
    type: "campaign",
    status: "completed",
    amount: 320.0,
    currency: "GHS",
    direction: "debit",
    description: "Campaign: Product Launch",
    date: "2025-09-30T09:15:00",
    reference: "CMP-2025-005679",
    campaignId: "camp_124",
  },
  {
    id: "5",
    type: "mobile_money",
    status: "failed",
    amount: 100.0,
    currency: "GHS",
    direction: "debit",
    description: "Mobile Money Withdrawal",
    date: "2025-09-29T11:30:00",
    reference: "MM-2025-001236",
    method: "AirtelTigo Money",
  },
];

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<
    "all" | "mobile_money" | "campaign"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Filter transactions based on active tab and search
  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesTab = activeTab === "all" || transaction.type === activeTab;
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Calculate summary stats
  const totalCredit = filteredTransactions
    .filter((t) => t.direction === "credit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = filteredTransactions
    .filter((t) => t.direction === "debit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = filteredTransactions.filter(
    (t) => t.status === "pending"
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Transactions
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Track your mobile money and campaign transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 text-sm font-medium">
              Total Received
            </span>
            <div className="bg-green-200 rounded-full p-2">
              <FiArrowDown className="w-4 h-4 text-green-700" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-green-900">
            GHS {totalCredit.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-700 text-sm font-medium">
              Total Spent
            </span>
            <div className="bg-purple-200 rounded-full p-2">
              <FiArrowUp className="w-4 h-4 text-purple-700" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-purple-900">
            GHS {totalDebit.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 text-sm font-medium">Pending</span>
            <div className="bg-blue-200 rounded-full p-2">
              <FiCreditCard className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-blue-900">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "all"
                ? "bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setActiveTab("mobile_money")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === "mobile_money"
                ? "bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiCreditCard className="w-4 h-4" />
            Mobile Money
          </button>
          <button
            onClick={() => setActiveTab("campaign")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === "campaign"
                ? "bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiTrendingUp className="w-4 h-4" />
            Campaigns
          </button>
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by description or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FiDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiCreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left side - Icon and Details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`rounded-full p-3 flex-shrink-0 ${
                      transaction.type === "mobile_money"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {transaction.type === "mobile_money" ? (
                      <FiCreditCard className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FiTrendingUp className="w-5 h-5 text-purple-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {transaction.description}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {formatDate(transaction.date)}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="font-mono">{transaction.reference}</span>
                      {transaction.method && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span>{transaction.method}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Amount */}
                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-lg md:text-xl font-bold ${
                      transaction.direction === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.direction === "credit" ? "+" : "-"}
                    {transaction.currency} {transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Load More Transactions
          </button>
        </div>
      )}
    </div>
  );
}
