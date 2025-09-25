import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Play,
  Pause,
  Eye,
  Trash2,
  BarChart3,
  Plus,
  X,
  Clock,
  Users,
  Send,
  Target,
  DollarSign,
} from "lucide-react";

// Define interfaces for TypeScript
interface SurveyOption {
  [key: string]: number;
}

interface Survey {
  id: number;
  question: string;
  options: string[];
  budget: number;
  reach: number;
  responses: number;
  status: "active" | "paused";
  createdAt: string;
  location: string;
  responseData: SurveyOption;
}

interface NewSurvey {
  question: string;
  options: string[];
  budget: number;
  location: string;
}

interface Errors {
  question?: string;
  options?: string;
  budget?: string;
}

export const Route = createFileRoute("/survey/")({
  component: StreamlinedSurveyApp,
});

export default function StreamlinedSurveyApp() {
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: 1,
      question: "Which type of content do you enjoy most?",
      options: ["Videos", "Photos", "Stories", "Live Streams"],
      budget: 50,
      reach: 2500,
      responses: 1247,
      status: "active",
      createdAt: "2 hours ago",
      location: "Ashanti Region",
      responseData: {
        Videos: 400,
        Photos: 300,
        Stories: 347,
        "Live Streams": 200,
      },
    },
  ]);

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [newSurvey, setNewSurvey] = useState<NewSurvey>({
    question: "",
    options: ["", ""],
    budget: 10,
    location: "All Ghana",
  });
  const [errors, setErrors] = useState<Errors>({});

  const ghanaRegions: string[] = [
    "All Ghana",
    "Greater Accra",
    "Ashanti",
    "Western",
    "Central",
    "Eastern",
    "Volta",
    "Northern",
    "Upper East",
    "Upper West",
  ];

  const calculateReach = (budget: number, location: string): number => {
    const baseReach = budget * 50;
    const locationMultiplier =
      location === "All Ghana"
        ? 1.0
        : ["Greater Accra", "Ashanti"].includes(location)
          ? 0.4
          : 0.25;
    return Math.round(baseReach * locationMultiplier);
  };

  const addOption = () => {
    if (newSurvey.options.length < 6) {
      setNewSurvey((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setNewSurvey((prev) => ({
      ...prev,
      options: prev.options.map((opt, idx) => (idx === index ? value : opt)),
    }));
  };

  const removeOption = (index: number) => {
    if (newSurvey.options.length > 2) {
      setNewSurvey((prev) => ({
        ...prev,
        options: prev.options.filter((_, idx) => idx !== index),
      }));
    }
  };

  const validateSurvey = (): boolean => {
    const newErrors: Errors = {};
    if (!newSurvey.question.trim())
      newErrors.question = "Survey question is required";
    if (newSurvey.options.filter((opt) => opt.trim()).length < 2) {
      newErrors.options = "At least two valid options are required";
    }
    if (newSurvey.budget < 1) newErrors.budget = "Budget must be at least $1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const publishSurvey = () => {
    if (validateSurvey()) {
      const survey: Survey = {
        id: Date.now(),
        question: newSurvey.question,
        options: newSurvey.options.filter((opt) => opt.trim()),
        budget: newSurvey.budget,
        reach: calculateReach(newSurvey.budget, newSurvey.location),
        responses: 0,
        status: "active",
        createdAt: "Just now",
        location: newSurvey.location,
        responseData: {},
      };
      setSurveys((prev) => [survey, ...prev]);
      setNewSurvey({
        question: "",
        options: ["", ""],
        budget: 10,
        location: "All Ghana",
      });
      setIsCreating(false);
      setErrors({});
    }
  };

  const toggleSurveyStatus = (id: number) => {
    setSurveys((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active" }
          : s
      )
    );
  };

  const deleteSurvey = (id: number) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      setSurveys((prev) => prev.filter((s) => s.id !== id));
      if (selectedSurvey?.id === id) setSelectedSurvey(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-purple-100 p-4 pb-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          {/* <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div> */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quick Survey
          </h1>
          <p className="text-gray-600 text-base">
            Create engaging surveys and connect with your audience
          </p>
        </div>

        {/* Create Survey Button */}
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-5 rounded-2xl font-semibold text-lg mb-6 shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Plus className="w-6 h-6" />
            Create New Survey
          </button>
        )}

        {/* Survey Creation Form */}
        {isCreating && (
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">New Survey</h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewSurvey({
                    question: "",
                    options: ["", ""],
                    budget: 10,
                    location: "All Ghana",
                  });
                  setErrors({});
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Input */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-3">
                Survey Question
              </label>
              <textarea
                value={newSurvey.question}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewSurvey((prev) => ({
                    ...prev,
                    question: e.target.value,
                  }))
                }
                placeholder="What would you like to ask your audience?"
                className={`w-full px-4 py-4 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-base ${
                  errors.question ? "border-red-300" : "border-gray-200"
                }`}
                rows={3}
              />
              {errors.question && (
                <p className="text-red-500 text-xs mt-2">{errors.question}</p>
              )}
            </div>

            {/* Answer Options */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-3">
                Answer Options
              </label>
              <div className="space-y-3">
                {newSurvey.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full flex-shrink-0 mt-4"></div>
                    <input
                      type="text"
                      value={option}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateOption(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className={`flex-1 px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base ${
                        errors.options ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                    {newSurvey.options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {errors.options && (
                  <p className="text-red-500 text-xs mt-2">{errors.options}</p>
                )}
                {newSurvey.options.length < 6 && (
                  <button
                    onClick={addOption}
                    className="w-full py-3 text-purple-600 hover:text-purple-700 text-base flex items-center justify-center gap-2 transition-colors border-2 border-dashed border-purple-200 hover:border-purple-300 rounded-xl hover:bg-purple-50"
                  >
                    <Plus className="w-5 h-5" />
                    Add Option
                  </button>
                )}
              </div>
            </div>

            {/* Budget & Location */}
            <div className="mb-6 space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-gray-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700 text-base font-semibold">
                      Budget
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">$</span>
                    <input
                      type="number"
                      value={newSurvey.budget}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewSurvey((prev) => ({
                          ...prev,
                          budget: Math.max(1, parseInt(e.target.value) || 1),
                        }))
                      }
                      min="1"
                      className={`w-20 px-3 py-2 bg-white border rounded-lg text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.budget ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700 text-base font-semibold">
                      Est. Reach
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-600 font-bold text-lg">
                    <Users className="w-5 h-5" />
                    <span>
                      {calculateReach(
                        newSurvey.budget,
                        newSurvey.location
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 text-base font-semibold">
                    Target Location
                  </span>
                </div>
                <select
                  value={newSurvey.location}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewSurvey((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  {ghanaRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={publishSurvey}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Send className="w-5 h-5" />
              Publish Survey
            </button>
          </div>
        )}

        {/* Active Surveys */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Surveys</h3>
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800 flex-1 pr-4">
                  {survey.question}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSurveyStatus(survey.id)}
                    className={`p-2 rounded-full transition-colors ${
                      survey.status === "active"
                        ? "text-green-600 bg-green-100 hover:bg-green-200"
                        : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {survey.status === "active" ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedSurvey(survey)}
                    className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSurvey(survey.id)}
                    className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-purple-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-purple-700">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Reach</span>
                  </div>
                  <p className="text-lg font-bold text-purple-800">
                    {survey.reach.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Responses</span>
                  </div>
                  <p className="text-lg font-bold text-green-800">
                    {survey.responses.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{survey.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{survey.location}</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    survey.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {survey.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Modal */}
        {selectedSurvey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Survey Results
                </h2>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {selectedSurvey.question}
              </h3>

              {selectedSurvey.responses > 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Total Responses: {selectedSurvey.responses.toLocaleString()}
                  </p>
                  {selectedSurvey.options.map((option, __) => {
                    const count = selectedSurvey.responseData[option] || 0;
                    const percentage =
                      selectedSurvey.responses > 0
                        ? ((count / selectedSurvey.responses) * 100).toFixed(1)
                        : 0;
                    return (
                      <div key={option} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">
                            {option}
                          </span>
                          <span className="text-purple-600 font-bold">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {count.toLocaleString()} responses
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    No responses yet
                  </h4>
                  <p className="text-gray-500">
                    Results will appear here once people start responding to
                    your survey.
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
