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
  DollarSign,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

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
  responseData: { [key: string]: number };
}

export const Route = createFileRoute("/survey/")({
  component: SurveyApp,
});

export default function SurveyApp() {
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
      location: "Greater Accra",
      responseData: {
        Videos: 520,
        Photos: 312,
        Stories: 285,
        "Live Streams": 130,
      },
    },
    {
      id: 2,
      question: "What's your preferred shopping method?",
      options: ["Online", "In-Store", "Mobile App"],
      budget: 35,
      reach: 1750,
      responses: 892,
      status: "active",
      createdAt: "1 day ago",
      location: "Ashanti",
      responseData: { Online: 401, "In-Store": 356, "Mobile App": 135 },
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [step, setStep] = useState(1);

  // Form state
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [budget, setBudget] = useState(10);
  const [location, setLocation] = useState("All Ghana");

  const ghanaRegions = [
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
    "Bono",
  ];

  const calculateReach = (budgetAmount: number, loc: string): number => {
    const baseReach = budgetAmount * 50;
    const multiplier =
      loc === "All Ghana"
        ? 1.0
        : ["Greater Accra", "Ashanti"].includes(loc)
          ? 0.4
          : 0.25;
    return Math.round(baseReach * multiplier);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const canProceedToStep2 = () => {
    return (
      question.trim().length > 0 &&
      options.filter((opt) => opt.trim()).length >= 2
    );
  };

  const publishSurvey = () => {
    const newSurvey: Survey = {
      id: Date.now(),
      question,
      options: options.filter((opt) => opt.trim()),
      budget,
      reach: calculateReach(budget, location),
      responses: 0,
      status: "active",
      createdAt: "Just now",
      location,
      responseData: {},
    };
    setSurveys([newSurvey, ...surveys]);
    resetForm();
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", ""]);
    setBudget(10);
    setLocation("All Ghana");
    setStep(1);
    setShowCreateForm(false);
  };

  const toggleStatus = (id: number) => {
    setSurveys(
      surveys.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active" }
          : s
      )
    );
  };

  const deleteSurvey = (id: number) => {
    if (confirm("Delete this survey?")) {
      setSurveys(surveys.filter((s) => s.id !== id));
      if (selectedSurvey?.id === id) setSelectedSurvey(null);
    }
  };

  const totalResponses = surveys.reduce((sum, s) => sum + s.responses, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-slate-100 pb-8">
      {/* Simple Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Surveys</h1>
              <p className="text-xs text-gray-600">
                Ask your audience questions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Surveys</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{surveys.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Responses
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {totalResponses.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Create Button */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            Create New Survey
          </button>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Progress Steps */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white">New Survey</h2>
                <button
                  onClick={resetForm}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-white" : "bg-white/30"}`}
                />
                <div
                  className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-white" : "bg-white/30"}`}
                />
              </div>
              <p className="text-white/90 text-sm mt-2">Step {step} of 2</p>
            </div>

            <div className="p-6">
              {/* Step 1: Question & Options */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-base font-bold text-gray-900">
                        Your Question
                      </label>
                      <div className="group relative">
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded-lg p-2">
                          Ask something your audience will want to answer
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Example: What type of product would you like to see next?"
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none text-base"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {question.length}/200 characters
                    </p>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-900 mb-3 block">
                      Answer Choices
                    </label>
                    <div className="space-y-3">
                      {options.map((option, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="w-10 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 font-bold flex-shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(idx, e.target.value)}
                            placeholder={`Choice ${idx + 1}`}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-base"
                          />
                          {options.length > 2 && (
                            <button
                              onClick={() => removeOption(idx)}
                              className="w-12 h-12 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {options.length < 6 && (
                      <button
                        onClick={addOption}
                        className="w-full mt-3 py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Choice
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2()}
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                      canProceedToStep2()
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Budget & Location */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                    <label className="text-base font-bold text-gray-900 mb-4 block">
                      Budget (GHS)
                    </label>
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        type="range"
                        min="5"
                        max="500"
                        step="5"
                        value={budget}
                        onChange={(e) => setBudget(parseInt(e.target.value))}
                        className="flex-1 accent-purple-600"
                      />
                      <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-xl border-2 border-purple-300 min-w-[100px] justify-center">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                        <span className="text-2xl font-bold text-purple-700">
                          {budget}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Estimated Reach
                        </span>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <span className="text-2xl font-bold text-purple-700">
                            {calculateReach(budget, location).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        People who will see your survey
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-900 mb-2 block">
                      Target Area
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-base font-medium appearance-none bg-white"
                      >
                        {ghanaRegions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={publishSurvey}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Publish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Survey List */}
        <div className="space-y-4">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex-1 pr-4">
                    {survey.question}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(survey.id)}
                      className={`p-2 rounded-lg ${
                        survey.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {survey.status === "active" ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedSurvey(survey)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteSurvey(survey.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                    <p className="text-xs text-purple-700 mb-1">Reach</p>
                    <p className="text-xl font-bold text-purple-900">
                      {survey.reach.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                    <p className="text-xs text-green-700 mb-1">Responses</p>
                    <p className="text-xl font-bold text-green-900">
                      {survey.responses.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                    <p className="text-xs text-blue-700 mb-1">Rate</p>
                    <p className="text-xl font-bold text-blue-900">
                      {((survey.responses / survey.reach) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {survey.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {survey.location}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      survey.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {survey.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Modal */}
        {selectedSurvey && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Results</h2>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {selectedSurvey.question}
                </h3>

                {selectedSurvey.responses > 0 ? (
                  <div className="space-y-6">
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Total Responses
                      </p>
                      <p className="text-4xl font-bold text-purple-700">
                        {selectedSurvey.responses.toLocaleString()}
                      </p>
                    </div>

                    {selectedSurvey.options.map((option) => {
                      const count = selectedSurvey.responseData[option] || 0;
                      const percent = (
                        (count / selectedSurvey.responses) *
                        100
                      ).toFixed(1);
                      return (
                        <div key={option}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-900">
                              {option}
                            </span>
                            <span className="text-lg font-bold text-purple-600">
                              {percent}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {count.toLocaleString()} votes
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">No responses yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
