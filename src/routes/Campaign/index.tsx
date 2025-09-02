import { createFileRoute } from "@tanstack/react-router";
import { useState, type JSX } from "react";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Calendar,
  DollarSign,
  Eye,
  Users,
  TrendingUp,
  AlertCircle,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/Campaign/")({
  component: Campaign,
});

// Types
interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  engagement: string;
  uploaded: string;
}

interface CampaignObjective {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}

type Step = "videos" | "details" | "budget" | "review" | "success";

// Mock user videos
const userVideos: Video[] = [
  {
    id: 1,
    title: "Amazing sunset timelapse",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop",
    duration: "0:45",
    views: 15420,
    engagement: "4.2%",
    uploaded: "2 days ago",
  },
  {
    id: 2,
    title: "Cooking tutorial: Perfect pasta",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=400&fit=crop",
    duration: "2:15",
    views: 8930,
    engagement: "3.8%",
    uploaded: "5 days ago",
  },
  {
    id: 3,
    title: "Dance challenge compilation",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop",
    duration: "1:30",
    views: 23100,
    engagement: "5.1%",
    uploaded: "1 week ago",
  },
  {
    id: 4,
    title: "Cat being adorable",
    thumbnail:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=400&fit=crop",
    duration: "0:30",
    views: 45600,
    engagement: "6.3%",
    uploaded: "2 weeks ago",
  },
  {
    id: 5,
    title: "Travel vlog: Mountain adventure",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
    duration: "3:20",
    views: 12000,
    engagement: "4.7%",
    uploaded: "3 weeks ago",
  },
  {
    id: 6,
    title: "DIY home decoration tips",
    thumbnail:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=400&fit=crop",
    duration: "1:45",
    views: 7800,
    engagement: "3.4%",
    uploaded: "1 month ago",
  },
];

const campaignObjectives: CampaignObjective[] = [
  {
    id: "awareness",
    name: "Brand Awareness",
    icon: Eye,
    desc: "Increase visibility and reach",
  },
  {
    id: "engagement",
    name: "Engagement",
    icon: Users,
    desc: "Boost likes, comments, shares",
  },
  {
    id: "traffic",
    name: "Traffic",
    icon: TrendingUp,
    desc: "Drive visits to your profile",
  },
];

function Campaign(): JSX.Element {
  const [step, setStep] = useState<Step>("videos");
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [campaignName, setCampaignName] = useState<string>("");
  const [duration, setDuration] = useState<number>(1); // months
  const [budget, setBudget] = useState<string>("");
  const [objective, setObjective] = useState<string>("");
  const [walletBalance] = useState<number>(125.5);

  const formatCurrency = (amount: number): string => `GH₵${amount.toFixed(2)}`;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const toggleVideoSelection = (videoId: number): void => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const calculateEstimatedReach = (): number => {
    const budgetNum: number = parseFloat(budget) || 0;
    const durationMonths: number = duration;
    const dailyBudget: number = budgetNum / (durationMonths * 30);
    console.log("dailyBudget : ", dailyBudget);
    // Rough estimation: GH₵1 = ~100 impressions
    return Math.round(budgetNum * 100);
  };

  const goToNextStep = (): void => {
    const steps: Step[] = ["videos", "details", "budget", "review"];
    const currentIndex: number = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const goToPrevStep = (): void => {
    const steps: Step[] = ["videos", "details", "budget", "review"];
    const currentIndex: number = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case "videos":
        return selectedVideos.length > 0;
      case "details":
        return campaignName.trim() !== "" && objective !== "" && duration >= 1;
      case "budget":
        return parseFloat(budget) > 0 && parseFloat(budget) <= walletBalance;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const launchCampaign = (): void => {
    setStep("success");
    // Here you would typically send the campaign data to your backend
  };

  const handleBackNavigation = (): void => {
    if (step === "videos") {
      window.history.back();
    } else {
      goToPrevStep();
    }
  };

  const handleDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setDuration(parseInt(e.target.value));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setBudget(e.target.value);
  };

  const handleCampaignNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCampaignName(e.target.value);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4">
        <div className="max-w-md mx-auto pt-16">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Campaign Launched!
              </h2>
              <p className="text-gray-600">
                Your campaign "{campaignName}" is now active and promoting your
                selected videos.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Campaign Budget</span>
                <span className="font-bold">
                  {formatCurrency(parseFloat(budget))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-bold">
                  {duration} month{duration > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Videos Selected</span>
                <span className="font-bold">{selectedVideos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Reach</span>
                <span className="font-bold">
                  {formatNumber(calculateEstimatedReach())}
                </span>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              }}
            >
              Create Another Campaign
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackNavigation}
                className="p-2 rounded-full hover:bg-white/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-lg font-bold text-gray-800">
                Create Campaign
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Wallet className="w-4 h-4" />
              <span className="font-semibold">
                {formatCurrency(walletBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2">
            {(["videos", "details", "budget", "review"] as const).map(
              (stepName, index) => (
                <div
                  key={stepName}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    (
                      ["videos", "details", "budget", "review"] as const
                    ).indexOf(step) >= index
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "bg-gray-200"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Step 1: Video Selection */}
        {step === "videos" && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Select Videos to Promote
              </h2>
              <p className="text-gray-600">
                Choose which videos you want to include in your campaign
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {userVideos.map((video: Video) => (
                <div
                  key={video.id}
                  className="relative group cursor-pointer"
                  onClick={() => toggleVideoSelection(video.id)}
                >
                  <div
                    className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedVideos.includes(video.id)
                        ? "ring-4 ring-purple-400 transform scale-105"
                        : "hover:scale-105"
                    }`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                    {/* Play button */}
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                      {video.duration}
                    </div>

                    {/* Selection indicator */}
                    {selectedVideos.includes(video.id) && (
                      <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    <h4 className="font-medium text-gray-800 text-sm line-clamp-2 leading-tight">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatNumber(video.views)} views</span>
                      <span>{video.engagement} engagement</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedVideos.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <p className="text-sm text-gray-600 mb-2">Selected Videos:</p>
                <p className="font-semibold text-purple-600">
                  {selectedVideos.length} video
                  {selectedVideos.length > 1 ? "s" : ""} selected
                </p>
              </div>
            )}
          </>
        )}

        {/* Step 2: Campaign Details */}
        {step === "details" && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Campaign Details
              </h2>
              <p className="text-gray-600">
                Set your campaign name, objective, and duration
              </p>
            </div>

            <div className="space-y-6">
              {/* Campaign Name */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Campaign Name
                </h3>
                <input
                  type="text"
                  placeholder="Enter campaign name"
                  value={campaignName}
                  onChange={handleCampaignNameChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* Campaign Objective */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Campaign Objective
                </h3>
                <div className="space-y-3">
                  {campaignObjectives.map((obj: CampaignObjective) => (
                    <button
                      key={obj.id}
                      onClick={() => setObjective(obj.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                        objective === obj.id
                          ? "border-purple-400 bg-purple-50/50 transform scale-105"
                          : "border-gray-200 bg-white/30 hover:bg-white/50"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <obj.icon className="w-6 h-6 text-purple-600" />
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">
                            {obj.name}
                          </p>
                          <p className="text-sm text-gray-600">{obj.desc}</p>
                        </div>
                        {objective === obj.id && (
                          <CheckCircle className="w-5 h-5 text-purple-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Campaign Duration
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={duration}
                      onChange={handleDurationChange}
                      className="flex-1"
                    />
                    <span className="font-semibold text-gray-800 min-w-[80px]">
                      {duration} month{duration > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Minimum duration is 1 month
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Budget */}
        {step === "budget" && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Set Campaign Budget
              </h2>
              <p className="text-gray-600">
                Choose how much to spend on your campaign
              </p>
            </div>

            <div className="space-y-6">
              {/* Wallet Balance */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-6 h-6 text-purple-600" />
                    <span className="text-gray-600">Available Balance</span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {formatCurrency(walletBalance)}
                  </span>
                </div>
              </div>

              {/* Budget Input */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Campaign Budget
                </h3>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    placeholder="Enter budget amount"
                    value={budget}
                    onChange={handleBudgetChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
                  />
                  <div className="absolute right-3 top-3 text-gray-500 text-sm">
                    GH₵
                  </div>
                </div>

                {budget && parseFloat(budget) > walletBalance && (
                  <div className="mt-2 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">
                      Insufficient balance. Please top up your wallet.
                    </span>
                  </div>
                )}
              </div>

              {/* Budget Estimation */}
              {budget &&
                parseFloat(budget) > 0 &&
                parseFloat(budget) <= walletBalance && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Estimated Performance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Budget</span>
                        <span className="font-semibold">
                          {formatCurrency(parseFloat(budget) / (duration * 30))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Reach</span>
                        <span className="font-semibold">
                          {formatNumber(calculateEstimatedReach())} people
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-semibold">
                          {duration} month{duration > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </>
        )}

        {/* Step 4: Review */}
        {step === "review" && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Review Campaign
              </h2>
              <p className="text-gray-600">
                Double-check your campaign details before launching
              </p>
            </div>

            <div className="space-y-6">
              {/* Campaign Summary */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Campaign Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campaign Name</span>
                    <span className="font-semibold">{campaignName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Objective</span>
                    <span className="font-semibold">
                      {
                        campaignObjectives.find((obj) => obj.id === objective)
                          ?.name
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">
                      {duration} month{duration > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-semibold">
                      {formatCurrency(parseFloat(budget))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Videos</span>
                    <span className="font-semibold">
                      {selectedVideos.length} selected
                    </span>
                  </div>
                </div>
              </div>

              {/* Selected Videos Preview */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Selected Videos
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {userVideos
                    .filter((video: Video) => selectedVideos.includes(video.id))
                    .map((video: Video) => (
                      <div
                        key={video.id}
                        className="relative rounded-lg overflow-hidden"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        <div className="absolute bottom-1 left-1">
                          <Play className="w-3 h-3 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={step === "review" ? launchCampaign : goToNextStep}
            disabled={!canProceed()}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
              !canProceed()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "text-white transform hover:scale-105"
            }`}
            style={
              canProceed()
                ? {
                    background:
                      "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  }
                : {}
            }
          >
            {step === "review" ? "Launch Campaign" : "Continue"}
          </button>

          {step !== "videos" && (
            <button
              onClick={goToPrevStep}
              className="w-full py-3 rounded-xl font-semibold text-gray-700 bg-white/50 backdrop-blur-sm border border-gray-200 hover:bg-white/70 transition-all duration-300"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
