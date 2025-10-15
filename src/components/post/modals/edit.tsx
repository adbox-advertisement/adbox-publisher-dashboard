import { useEffect, useState } from "react";
import { X, Check, Save, FileText, HelpCircle } from "lucide-react";
import ApiService from "@/helpers/api.service";

import { toast } from "sonner";

interface VideoPlayerDialogProps {
  isOpen: boolean;
  campaignData: any;
  onclose: () => void;
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess?: () => void;
}

interface VideoData {
  title: string;
  description: string;
}

export default function EditVideoPlayerDialog({
  isOpen,
  onOpenChange,
  onclose,
  campaignData,
  onDeleteSuccess,
}: VideoPlayerDialogProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "quiz">("edit");
  const [isVideoUploadComplete] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Quiz states
  const [quizQuestion, setQuizQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [wrongAnswer1, setWrongAnswer1] = useState("");
  const [wrongAnswer2, setWrongAnswer2] = useState("");
  const [wrongAnswer3, setWrongAnswer3] = useState("");
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const [initialData] = useState<VideoData>({
    title: campaignData?.resourceTitle || "",
    description: campaignData?.description || "",
  });

  const [editForm, setEditForm] = useState(initialData);

  useEffect(() => {
    setEditForm({
      title: campaignData?.resourceTitle || "",
      description: campaignData?.description || "",
    });

    // Populate quiz data if exists
    if (campaignData?.Question) {
      setQuizQuestion(campaignData.Question.text || "");

      const answers = campaignData.Question.answers || [];
      const correctAns = answers.find((ans: any) => ans.isCorrect);
      const wrongAns = answers.filter((ans: any) => !ans.isCorrect);

      setCorrectAnswer(correctAns?.text || "");
      setWrongAnswer1(wrongAns[0]?.text || "");
      setWrongAnswer2(wrongAns[1]?.text || "");
      setWrongAnswer3(wrongAns[2]?.text || "");
    }
  }, [campaignData]);

  // Animate dialog open/close
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 50);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  // Quiz handlers
  const submitQuiz = async () => {
    try {
      setIsSubmittingQuiz(true);

      const response = await ApiService.put_api(
        `/questions/publisher/${campaignData?.Question.myQuestionResourceId}/update`,
        {
          text: quizQuestion,
          correctAnswerText: correctAnswer,
          wrongAnswerTexts: [wrongAnswer1, wrongAnswer2, wrongAnswer3],
        }
      );

      console.log("Quiz update response:", response.data);

      toast.success("Quiz updated successfully!");

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      toast.error("Failed to update quiz. Please try again.");
      console.error("Quiz submission error:", error);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editForm.title.trim()) {
      toast.error("Please enter a video title");
      return;
    }

    try {
      setIsSaving(true);

      const response = await ApiService.put_api(
        `/resources/publisher/${campaignData?.id}/update`,
        {
          resourceTitle: editForm.title,
          description: editForm.description,
        }
      );

      console.log("Update response:", response.data);

      toast.success(`"${editForm.title}" updated successfully`);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      onOpenChange(false);
      if (onclose) onclose();
    } catch (error) {
      toast.error("Failed to update video. Please try again.");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(initialData);
    onOpenChange(false);
    if (onclose) onclose();
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300 flex items-center justify-center p-4 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-all duration-300 ${
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Video</h2>
              <p className="text-sm text-gray-500">Update your video details</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSaving || isSubmittingQuiz}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab("edit")}
            disabled={isSaving || isSubmittingQuiz}
            className={`cursor-pointer flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "edit"
                ? "border-purple-300 text-purple-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Edit Details</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            disabled={isSaving || isSubmittingQuiz}
            className={`cursor-pointer flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "quiz"
                ? "border-purple-300 text-purple-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>Edit Quiz</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Edit Form */}
          {activeTab === "edit" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                  placeholder="Enter video title"
                  maxLength={100}
                  disabled={isSaving}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Give your video a descriptive title
                  </p>
                  <p className="text-xs text-gray-500">
                    {editForm.title.length} / 100
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all resize-none"
                  placeholder="Describe your video... What's it about? What makes it special?"
                  rows={5}
                  maxLength={500}
                  disabled={isSaving}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Help viewers understand what they'll see
                  </p>
                  <p className="text-xs text-gray-500">
                    {editForm.description.length} / 500
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Section */}
          {activeTab === "quiz" && (
            <div className="space-y-6">
              <div className="space-y-5">
                {/* Question */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quiz Question *
                  </label>
                  <input
                    type="text"
                    value={quizQuestion}
                    onChange={(e) => setQuizQuestion(e.target.value)}
                    placeholder="What question do you want to ask about your video?"
                    disabled={!isVideoUploadComplete || isSubmittingQuiz}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {quizQuestion.length} / 200
                  </p>
                </div>

                {/* Answer Options */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Answer Options *
                  </label>

                  {/* Correct Answer */}
                  <div className="relative">
                    <span className="absolute -top-2 left-3 px-2 py-0.5 bg-purple-200 text-purple-800 text-xs font-medium rounded-full z-10">
                      Correct Answer
                    </span>
                    <div className="flex items-center gap-3 p-3 border-2 border-purple-200 rounded-xl bg-purple-50/50">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-300 flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <input
                        type="text"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        placeholder="Enter the correct answer..."
                        disabled={!isVideoUploadComplete || isSubmittingQuiz}
                        className="flex-1 p-2 border-0 bg-transparent focus:ring-0 focus:outline-none"
                        maxLength={80}
                      />
                    </div>
                  </div>

                  {/* Wrong Answers */}
                  <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 flex-shrink-0">
                      <X className="w-4 h-4 text-gray-600" />
                    </div>
                    <input
                      type="text"
                      value={wrongAnswer1}
                      onChange={(e) => setWrongAnswer1(e.target.value)}
                      placeholder="Wrong answer option 1..."
                      disabled={!isVideoUploadComplete || isSubmittingQuiz}
                      className="flex-1 p-2 border-0 bg-transparent focus:ring-0 focus:outline-none"
                      maxLength={80}
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 flex-shrink-0">
                      <X className="w-4 h-4 text-gray-600" />
                    </div>
                    <input
                      type="text"
                      value={wrongAnswer2}
                      onChange={(e) => setWrongAnswer2(e.target.value)}
                      placeholder="Wrong answer option 2..."
                      disabled={!isVideoUploadComplete || isSubmittingQuiz}
                      className="flex-1 p-2 border-0 bg-transparent focus:ring-0 focus:outline-none"
                      maxLength={80}
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 flex-shrink-0">
                      <X className="w-4 h-4 text-gray-600" />
                    </div>
                    <input
                      type="text"
                      value={wrongAnswer3}
                      onChange={(e) => setWrongAnswer3(e.target.value)}
                      placeholder="Wrong answer option 3..."
                      disabled={!isVideoUploadComplete || isSubmittingQuiz}
                      className="flex-1 p-2 border-0 bg-transparent focus:ring-0 focus:outline-none"
                      maxLength={80}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={submitQuiz}
                  disabled={
                    !isVideoUploadComplete ||
                    !quizQuestion.trim() ||
                    !correctAnswer.trim() ||
                    !wrongAnswer1.trim() ||
                    !wrongAnswer2.trim() ||
                    !wrongAnswer3.trim() ||
                    isSubmittingQuiz
                  }
                  className="w-full bg-gradient-to-r from-purple-300 to-purple-400 text-purple-800 px-4 py-4 rounded-xl hover:shadow-lg hover:from-purple-400 hover:to-purple-500 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-semibold"
                >
                  {isSubmittingQuiz ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-800 border-t-transparent"></div>
                      <span>Updating Quiz...</span>
                    </div>
                  ) : (
                    "Update Quiz"
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  {!isVideoUploadComplete
                    ? "Complete video upload to enable quiz submission"
                    : "Quiz will be saved and can be edited later"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer (only for Edit tab) */}
        {activeTab === "edit" && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !editForm.title.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-300 to-purple-400 text-purple-800 rounded-xl hover:shadow-lg hover:from-purple-400 hover:to-purple-500 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-800 border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
