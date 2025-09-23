import { useEffect, useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

interface VideoPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Reel {
  id: string;
  username: string;
  avatar: string;
  likes: string;
  comments: string;
  caption: string;
  isPlaying: boolean;
  isMuted: boolean;
  videoUrl: string;
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
  const [activeTab, setActiveTab] = useState<"video" | "edit" | "quiz">("edit");
  const [isVideoUploadComplete] = useState(true); // Simulated state

  // Quiz states
  const [quizQuestion, setQuizQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [wrongAnswer1, setWrongAnswer1] = useState("");
  const [wrongAnswer2, setWrongAnswer2] = useState("");
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const [reel, setReel] = useState<Reel>({
    id: "1",
    username: "travel_explorer",
    avatar: "🌎",
    likes: "12.5K",
    comments: "234",
    caption: "Amazing sunset from Bali! 🌅 #travel #sunset",
    isPlaying: true,
    isMuted: false,
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Bali Sunset",
    description: "A beautiful sunset captured in Bali.",
    status: "public",
  });

  const [editForm, setEditForm] = useState({
    title: reel.title,
    description: reel.description,
    status: reel.status,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize form with reel's data
  useEffect(() => {
    setEditForm({
      title: reel.title,
      description: reel.description,
      status: reel.status,
    });
  }, [reel]);

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

  // Initialize video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = reel.videoUrl;
    video.muted = reel.isMuted;

    // Auto-play when dialog opens
    video.play().catch(() => {});
  }, [reel.videoUrl, reel.isMuted]);

  // Handle play/pause state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reel.isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [reel.isPlaying]);

  // Quiz handlers
  const handleQuizQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizQuestion(e.target.value);
  };

  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCorrectAnswer(e.target.value);
  };

  const handleWrongAnswer1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWrongAnswer1(e.target.value);
  };

  const handleWrongAnswer2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWrongAnswer2(e.target.value);
  };

  const submitQuiz = async () => {
    setIsSubmittingQuiz(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Quiz submitted:", {
      question: quizQuestion,
      correct: correctAnswer,
      wrong1: wrongAnswer1,
      wrong2: wrongAnswer2,
    });
    setIsSubmittingQuiz(false);
    alert("Quiz submitted successfully!");
  };

  // Action handlers
  const togglePlayPause = () => {
    setReel((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const toggleMute = () => {
    setReel((prev) => ({ ...prev, isMuted: !prev.isMuted }));
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
    setReel((prev) => ({ ...prev, ...editForm }));
    console.log("Saved reel data:", editForm);
    onOpenChange(false);
  };

  const reelActions = {
    onLike: (reelId: string) => console.log(`Liked reel: ${reelId}`),
    onComment: (reelId: string) => console.log(`Comment on reel: ${reelId}`),
    onShare: (reelId: string) => console.log(`Share reel: ${reelId}`),
    onBookmark: (reelId: string) => console.log(`Bookmark reel: ${reelId}`),
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/80 transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`h-full w-full bg-white flex flex-col transition-all duration-300 ${
          isAnimating ? "scale-100" : "scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900">Edit Video</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex border-b bg-white sticky top-16 z-10 md:hidden">
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "video"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Video
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "edit"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "quiz"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Quiz
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Video Section */}
          <div
            className={`${activeTab === "video" || window.innerWidth >= 768 ? "block" : "hidden"} flex-1 md:w-3/5 flex flex-col`}
          >
            {/* Video Container */}
            <div className="flex-1 relative bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                controls={false}
                loop
              />

              {/* Video Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                {/* Top Bar */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm">
                      {reel.avatar}
                    </div>
                    <span className="text-white font-medium text-sm drop-shadow-lg">
                      {reel.username}
                    </span>
                  </div>
                  <button className="text-white/80 hover:text-white p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlayPause}
                    className="bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-4 transition-all transform hover:scale-110"
                  >
                    {reel.isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Bottom Content */}
                <div className="flex justify-between items-end">
                  <div className="flex-1 mr-4">
                    <p className="text-white text-sm leading-relaxed line-clamp-3 drop-shadow-lg">
                      {reel.caption}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={() => reelActions.onLike(reel.id)}
                      className="text-white hover:text-red-400 flex flex-col items-center group transition-all"
                    >
                      <div className="p-2 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors">
                        <Heart className="w-6 h-6" />
                      </div>
                      <span className="text-xs mt-1 font-medium drop-shadow-lg">
                        {reel.likes}
                      </span>
                    </button>

                    <button
                      onClick={() => reelActions.onComment(reel.id)}
                      className="text-white hover:text-blue-400 flex flex-col items-center group transition-all"
                    >
                      <div className="p-2 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs mt-1 font-medium drop-shadow-lg">
                        {reel.comments}
                      </span>
                    </button>

                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-yellow-400 group transition-all"
                    >
                      <div className="p-2 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors">
                        {reel.isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-white transition-all duration-1000 ease-linear"
                  style={{ width: reel.isPlaying ? "100%" : "30%" }}
                />
              </div>
            </div>
          </div>

          {/* Form/Quiz Section */}
          <div
            className={`${activeTab === "edit" || activeTab === "quiz" || window.innerWidth >= 768 ? "block" : "hidden"} w-full md:w-2/5 flex flex-col bg-gray-50`}
          >
            {/* Desktop Tab Navigation */}
            <div className="hidden md:flex border-b bg-white">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "edit"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Edit Details
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "quiz"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Add Quiz
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Edit Form */}
              {activeTab === "edit" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter video title"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editForm.title.length} / 100
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Describe your video..."
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editForm.description.length} / 500
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Setting
                    </label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="public">
                        🌍 Public - Anyone can view
                      </option>
                      <option value="private">
                        🔒 Private - Only you can view
                      </option>
                    </select>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Section */}
              {activeTab === "quiz" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Add Quiz Question
                    </h3>
                    <p className="text-sm text-gray-600">
                      Engage your viewers with an interactive quiz
                    </p>
                  </div>

                  <div
                    className={`space-y-4 ${!isVideoUploadComplete ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {/* Question */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quiz Question *
                      </label>
                      <input
                        type="text"
                        value={quizQuestion}
                        onChange={handleQuizQuestionChange}
                        placeholder="What question do you want to ask about your video?"
                        disabled={!isVideoUploadComplete}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {quizQuestion.length} / 200
                      </p>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Answer Options *
                      </label>

                      {/* Correct Answer */}
                      <div className="relative">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 flex-shrink-0">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <input
                            type="text"
                            value={correctAnswer}
                            onChange={handleCorrectAnswerChange}
                            placeholder="Correct answer..."
                            disabled={!isVideoUploadComplete}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            maxLength={80}
                          />
                        </div>
                        <span className="absolute -top-2 left-10 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                          Correct
                        </span>
                      </div>

                      {/* Wrong Answers */}
                      <div className="relative">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 flex-shrink-0">
                            <X className="w-4 h-4 text-red-600" />
                          </div>
                          <input
                            type="text"
                            value={wrongAnswer1}
                            onChange={handleWrongAnswer1Change}
                            placeholder="Wrong answer option 1..."
                            disabled={!isVideoUploadComplete}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            maxLength={80}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 flex-shrink-0">
                          <X className="w-4 h-4 text-red-600" />
                        </div>
                        <input
                          type="text"
                          value={wrongAnswer2}
                          onChange={handleWrongAnswer2Change}
                          placeholder="Wrong answer option 2..."
                          disabled={!isVideoUploadComplete}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                          maxLength={80}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
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
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:shadow-lg hover:from-purple-700 hover:to-blue-700 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-medium"
                      >
                        {isSubmittingQuiz ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          "Submit Quiz"
                        )}
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {!isVideoUploadComplete
                          ? "Complete video upload to enable quiz submission"
                          : "Quiz will be saved and can be edited later"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
