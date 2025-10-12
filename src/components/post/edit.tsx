import { useEffect, useState } from "react";
import { X, Check, Save, FileText, HelpCircle } from "lucide-react";

interface VideoPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface VideoData {
  title: string;
  description: string;
  status: "public" | "private";
}

export default function EditVideoPlayerDialog({
  isOpen,
  onOpenChange,
}: VideoPlayerDialogProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "quiz">("edit");
  const [isVideoUploadComplete] = useState(true);

  // Quiz states
  const [quizQuestion, setQuizQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [wrongAnswer1, setWrongAnswer1] = useState("");
  const [wrongAnswer2, setWrongAnswer2] = useState("");
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const [initialData] = useState<VideoData>({
    title: "Bali Sunset Adventure",
    description: "A beautiful sunset captured in Bali with stunning views.",
    status: "public",
  });

  const [editForm, setEditForm] = useState(initialData);

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
    setIsSubmittingQuiz(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Quiz submitted:", {
      question: quizQuestion,
      correct: correctAnswer,
      wrong1: wrongAnswer1,
      wrong2: wrongAnswer2,
    });
    setIsSubmittingQuiz(false);

    // Reset form
    setQuizQuestion("");
    setCorrectAnswer("");
    setWrongAnswer1("");
    setWrongAnswer2("");

    alert("Quiz submitted successfully!");
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved video data:", editForm);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setEditForm(initialData);
    onOpenChange(false);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300 flex items-center justify-center p-4 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Video</h2>
              <p className="text-sm text-gray-500">Update your video details</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "edit"
                ? "border-blue-500 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Edit Details</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "quiz"
                ? "border-purple-500 text-purple-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
                  Video Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter video title"
                  maxLength={100}
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
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe your video... What's it about? What makes it special?"
                  rows={5}
                  maxLength={500}
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
                    disabled={!isVideoUploadComplete}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                    <span className="absolute -top-2 left-3 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full z-10">
                      Correct Answer
                    </span>
                    <div className="flex items-center gap-3 p-3 border-2 border-green-200 rounded-xl bg-green-50/50">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <input
                        type="text"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        placeholder="Enter the correct answer..."
                        disabled={!isVideoUploadComplete}
                        className="flex-1 p-2 border-0 bg-transparent focus:ring-0 focus:outline-none"
                        maxLength={80}
                      />
                    </div>
                  </div>

                  {/* Wrong Answers */}
                  <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 flex-shrink-0">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <input
                      type="text"
                      value={wrongAnswer1}
                      onChange={(e) => setWrongAnswer1(e.target.value)}
                      placeholder="Wrong answer option 1..."
                      disabled={!isVideoUploadComplete}
                      className="flex-1 p-2 border-0 bg-transparent focus:ring-0 focus:outline-none"
                      maxLength={80}
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 flex-shrink-0">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <input
                      type="text"
                      value={wrongAnswer2}
                      onChange={(e) => setWrongAnswer2(e.target.value)}
                      placeholder="Wrong answer option 2..."
                      disabled={!isVideoUploadComplete}
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
                    isSubmittingQuiz
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-4 rounded-xl hover:shadow-lg hover:from-purple-700 hover:to-blue-700 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-semibold"
                >
                  {isSubmittingQuiz ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Submitting Quiz...</span>
                    </div>
                  ) : (
                    "Submit Quiz"
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
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
