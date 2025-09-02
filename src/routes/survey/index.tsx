import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  X,
  Eye,
  Share2,
  BarChart3,
  Users,
  Trash2,
  Edit3,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/survey/")({
  component: Survey,
});

function Survey() {
  const [surveys, setSurveys] = useState([
    {
      id: 1,
      title: "What's your favorite social media feature?",
      questions: [
        {
          id: 1,
          text: "Which feature do you use most?",
          type: "multiple",
          options: ["Stories", "Posts", "Live Streaming", "Messages"],
        },
        {
          id: 2,
          text: "How often do you share content?",
          type: "single",
          options: ["Daily", "Weekly", "Monthly", "Rarely"],
        },
      ],
      responses: 847,
      isActive: true,
      createdAt: "2 days ago",
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [expandedSurvey, setExpandedSurvey] = useState<any>(null);
  const [newSurvey, setNewSurvey] = useState({
    title: "",
    questions: [
      { id: Date.now(), text: "", type: "single", options: ["", ""] },
    ],
  });

  const addQuestion = () => {
    setNewSurvey((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { id: Date.now(), text: "", type: "single", options: ["", ""] },
      ],
    }));
  };

  const updateQuestion = (questionId: number, field: string, value: string) => {
    setNewSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    }));
  };

  const addOption = (questionId: number) => {
    setNewSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      ),
    }));
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setNewSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const removeOption = (questionId: number, optionIndex: number) => {
    setNewSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, idx) => idx !== optionIndex),
            }
          : q
      ),
    }));
  };

  const removeQuestion = (questionId: number) => {
    setNewSurvey((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const saveSurvey = () => {
    if (
      newSurvey.title.trim() &&
      newSurvey.questions.some((q) => q.text.trim())
    ) {
      const survey = {
        ...newSurvey,
        id: Date.now(),
        responses: 0,
        isActive: true,
        createdAt: "Just now",
        questions: newSurvey.questions.filter((q) => q.text.trim()),
      };
      setSurveys((prev) => [survey, ...prev]);
      setNewSurvey({
        title: "",
        questions: [
          { id: Date.now(), text: "", type: "single", options: ["", ""] },
        ],
      });
      setIsCreating(false);
    }
  };

  const toggleSurveyStatus = (surveyId: number) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const deleteSurvey = (surveyId: number) => {
    setSurveys((prev) => prev.filter((s) => s.id !== surveyId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 text-slate-800">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Survey Studio
          </h1>
          <p className="text-slate-600 text-sm px-2">
            Create engaging surveys for your audience
          </p>
        </div>

        {/* Stats - Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 min-w-[140px] flex-shrink-0 shadow-sm">
            <div className="text-center">
              <BarChart3 className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-500 text-xs mb-1">Total Surveys</p>
              <p className="text-2xl font-bold text-slate-900">
                {surveys.length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 min-w-[140px] flex-shrink-0 shadow-sm">
            <div className="text-center">
              <Users className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-500 text-xs mb-1">Responses</p>
              <p className="text-2xl font-bold text-slate-900">
                {surveys.reduce((acc, s) => acc + s.responses, 0)}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 min-w-[140px] flex-shrink-0 shadow-sm">
            <div className="text-center">
              <Eye className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-500 text-xs mb-1">Active</p>
              <p className="text-2xl font-bold text-slate-900">
                {surveys.filter((s) => s.isActive).length}
              </p>
            </div>
          </div>
        </div>

        {/* Create Button */}
        {!isCreating && (
          <div className="mb-6">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full bg-[#764ba2] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#6a3f97] transition-all duration-300 shadow"
            >
              <span className="inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Survey
              </span>
            </button>
          </div>
        )}

        {/* Survey Creation Form */}
        {isCreating && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">New Survey</h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewSurvey({
                    title: "",
                    questions: [
                      {
                        id: Date.now(),
                        text: "",
                        type: "single",
                        options: ["", ""],
                      },
                    ],
                  });
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Survey Title
              </label>
              <input
                type="text"
                value={newSurvey.title}
                onChange={(e) =>
                  setNewSurvey((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="What's your survey about?"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#764ba2]/20 focus:border-[#764ba2] text-base"
              />
            </div>

            {/* Questions */}
            <div className="space-y-4 mb-6">
              {newSurvey.questions.map((question, qIndex) => (
                <div
                  key={question.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-slate-800 font-medium text-sm">
                      Question {qIndex + 1}
                    </h3>
                    {newSurvey.questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-rose-600 hover:text-rose-700 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <textarea
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(question.id, "text", e.target.value)
                    }
                    placeholder="Enter your question..."
                    className="w-full px-3 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#764ba2]/20 focus:border-[#764ba2] mb-3 text-base resize-none"
                    rows={2}
                  />

                  {/* Question Type Toggle */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() =>
                        updateQuestion(question.id, "type", "single")
                      }
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                        question.type === "single"
                          ? "bg-[#764ba2]/10 text-[#5f3d89] border-[#764ba2]/30"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      Single
                    </button>
                    <button
                      onClick={() =>
                        updateQuestion(question.id, "type", "multiple")
                      }
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                        question.type === "multiple"
                          ? "bg-[#764ba2]/10 text-[#5f3d89] border-[#764ba2]/30"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      Multiple
                    </button>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <p className="text-slate-700 text-xs font-medium">
                      Answer Options:
                    </p>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(question.id, optIndex, e.target.value)
                          }
                          placeholder={`Option ${optIndex + 1}`}
                          className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#764ba2]/20 focus:border-[#764ba2] text-sm"
                        />
                        {question.options.length > 2 && (
                          <button
                            onClick={() => removeOption(question.id, optIndex)}
                            className="text-rose-600 hover:text-rose-700 transition-colors p-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {question.options.length < 6 && (
                      <button
                        onClick={() => addOption(question.id)}
                        className="w-full py-2 text-slate-700 hover:text-slate-900 text-sm flex items-center justify-center gap-1 transition-colors bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200"
                      >
                        <Plus className="w-4 h-4" />
                        Add Option
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={addQuestion}
                className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-medium hover:bg-slate-200 transition-all duration-300 border border-slate-200"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Question
                </span>
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewSurvey({
                      title: "",
                      questions: [
                        {
                          id: Date.now(),
                          text: "",
                          type: "single",
                          options: ["", ""],
                        },
                      ],
                    });
                  }}
                  className="flex-1 py-3 rounded-xl font-medium text-slate-700 hover:text-slate-900 transition-colors bg-white border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSurvey}
                  className="flex-1 bg-[#764ba2] text-white py-3 rounded-xl font-medium hover:bg-[#6a3f97] transition-all duration-300 shadow"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Surveys List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Your Surveys</h2>

          {surveys.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No surveys yet</p>
              <p className="text-slate-500 text-sm">
                Create your first survey!
              </p>
            </div>
          ) : (
            surveys.map((survey) => (
              <div
                key={survey.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm"
              >
                {/* Survey Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                          {survey.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            survey.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {survey.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">
                        {survey.questions.length} questions • {survey.createdAt}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedSurvey(
                          expandedSurvey === survey.id ? null : survey.id
                        )
                      }
                      className="text-slate-500 hover:text-slate-700 transition-colors p-2"
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedSurvey === survey.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-slate-600 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{survey.responses}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>View Results</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSurveyStatus(survey.id)}
                      className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all border ${
                        survey.isActive
                          ? "bg-rose-100 text-rose-700 border-rose-200"
                          : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {survey.isActive ? "Pause" : "Activate"}
                    </button>
                    <button className="px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSurvey(survey.id)}
                      className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedSurvey === survey.id && (
                  <div className="border-t border-slate-100 p-4">
                    <p className="text-slate-800 text-sm font-medium mb-3">
                      Questions Preview:
                    </p>
                    <div className="space-y-2">
                      {survey.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                        >
                          <p className="text-slate-900 text-sm font-medium mb-1">
                            {index + 1}. {question.text}
                          </p>
                          <p className="text-slate-600 text-xs">
                            {question.type === "single" ? "Single" : "Multiple"}{" "}
                            choice • {question.options.length} options
                          </p>
                          <div className="mt-2 space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="text-slate-600 text-xs pl-3"
                              >
                                • {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
