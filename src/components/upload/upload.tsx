import { useState, useRef, useCallback } from "react";
import { Upload, X, CheckCircle, Play, FileVideo } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import ApiService from "@/helpers/api.service";

export default function VideoUploads() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [quizQuestion, setQuizQuestion] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [wrongAnswer1, setWrongAnswer1] = useState<string>("");
  const [wrongAnswer2, setWrongAnswer2] = useState<string>("");
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isVideoUploadComplete: boolean =
    uploadProgress === 100 && !isUploading && videoId !== null;

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        handleFileSelect(file);
      }
    }
  }, []);

  const handleFileSelect = (file: File): void => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleCaptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    if (e.target.value.length <= 2200) {
      setCaption(e.target.value);
    }
  };

  const handleVideoTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.target.value.length <= 100) {
      setVideoTitle(e.target.value);
    }
  };

  const handleQuizQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setQuizQuestion(e.target.value);
  };

  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCorrectAnswer(e.target.value);
  };

  const handleWrongAnswer1Change = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setWrongAnswer1(e.target.value);
  };

  const handleWrongAnswer2Change = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setWrongAnswer2(e.target.value);
  };

  const simulateUpload = async (): Promise<void> => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await ApiService.upload_api(
        "/ffmpeg-video-upload/upload",
        selectedFile,
        {
          title: videoTitle || "Untitled Video",
          description: caption || "No description provided",
        },
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
              if (percentCompleted === 100) {
                // console.log("Upload completed, processing...");
              }
            }
          },
          timeout: 300000,
          headers: {
            "X-Upload-Source": "web-client",
          },
        }
      );

      // console.log("Upload successful:", response.data);

      if (response.data?.id) {
        setVideoId(response.data.id);
      }
      toast.info("Upload successful");

      setIsUploading(false);
    } catch (error: any) {
      toast.error(`❌ Upload failed`);
      setIsUploading(false);
    }
  };

  // Quiz submit handler
  const submitQuiz = async () => {
    if (
      !quizQuestion.trim() ||
      !correctAnswer.trim() ||
      !wrongAnswer1.trim() ||
      !wrongAnswer2.trim()
    ) {
      return;
    }

    if (!videoId) {
      console.warn("Video ID is missing. Upload video before submitting quiz.");
      return;
    }

    setIsSubmittingQuiz(true);
    try {
      await ApiService.post_api("/questions/create", {
        myQuestionResourceId: videoId,
        text: quizQuestion,
        correctAnswerText: correctAnswer,
        wrongAnswerTexts: [wrongAnswer1, wrongAnswer2],
      });
      toast.info("Questions uploaded successfully!");
      navigate({ to: "/Campaign" });

      // reset quiz form
      setQuizQuestion("");
      setCorrectAnswer("");
      setWrongAnswer1("");
      setWrongAnswer2("");
    } catch (error: any) {
      toast.error(`❌ Quiz Upload failed`);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const skipQuiz = (): void => {
    navigate({ to: "/Campaign" });
  };

  const resetUpload = (): void => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
    setCaption("");
    setVideoTitle("");
    setVideoId(null);
    setQuizQuestion("");
    setCorrectAnswer("");
    setWrongAnswer1("");
    setWrongAnswer2("");
    setShowQuiz(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-purple-100 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#764ba2] to-[#667eea] px-6 py-8 sm:px-8">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <FileVideo className="w-8 h-8 text-white" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Upload Video
              </h1>
            </div>
            <p className="text-center text-purple-50 text-sm sm:text-base">
              Share your content with the world
            </p>
          </div>

          <div className="px-4 py-6 sm:px-8 sm:py-8">
            {/* File Selection */}
            {!selectedFile ? (
              <div
                className={`border-3 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                  dragActive
                    ? "border-purple-400 bg-purple-50 scale-105"
                    : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-full flex items-center justify-center shadow-lg">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      Drop your video here
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse files
                    </p>
                    <p className="text-xs text-gray-400">
                      MP4 or WebM • Up to 2 min • Max 20MB
                    </p>
                  </div>
                  <button className="cursor-pointer mt-2 bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all text-sm sm:text-base">
                    Choose File
                  </button>
                </div>
              </div>
            ) : !isVideoUploadComplete ? (
              <div className="space-y-6">
                {/* File Preview */}
                <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetUpload}
                      className="flex-shrink-0  cursor-pointer ml-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <video
                    src={previewUrl ?? undefined}
                    controls
                    className="w-full rounded-xl max-h-64 object-contain bg-black shadow-md"
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={handleVideoTitleChange}
                      placeholder="Give your video a catchy title"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm transition-all"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-400 mt-1.5 text-right">
                      {videoTitle.length}/100
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={caption}
                      onChange={handleCaptionChange}
                      placeholder="Describe what your video is about..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm transition-all resize-none"
                      rows={4}
                      maxLength={2200}
                    />
                    <p className="text-xs text-gray-400 mt-1.5 text-right">
                      {caption.length}/2200
                    </p>
                  </div>

                  <button
                    onClick={simulateUpload}
                    disabled={isUploading}
                    className="w-full cursor-pointer bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white py-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 text-sm sm:text-base"
                  >
                    {isUploading
                      ? `Uploading... ${uploadProgress}%`
                      : "Upload Video"}
                  </button>

                  {isUploading && (
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#764ba2] to-[#667eea] h-3 rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : showQuiz ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Add a Quiz
                  </h2>
                  <p className="text-sm text-gray-500">
                    Engage your audience with a fun quiz
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={quizQuestion}
                      onChange={handleQuizQuestionChange}
                      placeholder="What would you like to ask?"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm transition-all"
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-400 mt-1.5 text-right">
                      {quizQuestion.length}/200
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={correctAnswer}
                        onChange={handleCorrectAnswerChange}
                        placeholder="The correct answer"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm transition-all"
                        maxLength={80}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Wrong Answer 1
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={wrongAnswer1}
                        onChange={handleWrongAnswer1Change}
                        placeholder="An incorrect answer"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm transition-all"
                        maxLength={80}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Wrong Answer 2
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={wrongAnswer2}
                        onChange={handleWrongAnswer2Change}
                        placeholder="Another incorrect answer"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm transition-all"
                        maxLength={80}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={skipQuiz}
                      className="flex-1 cursor-pointer py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all text-sm sm:text-base"
                    >
                      Skip Quiz
                    </button>
                    <button
                      onClick={submitQuiz}
                      disabled={
                        !quizQuestion.trim() ||
                        !correctAnswer.trim() ||
                        !wrongAnswer1.trim() ||
                        !wrongAnswer2.trim() ||
                        isSubmittingQuiz
                      }
                      className="flex-1 cursor-pointer bg-gradient-to-r from-purple-400 to-purple-500 text-white py-3.5 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all transform hover:scale-105 text-sm sm:text-base"
                    >
                      {isSubmittingQuiz ? "Submitting..." : "Submit Quiz"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Upload Successful!
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your video is ready. Add a quiz to boost engagement!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={skipQuiz}
                    className="flex-1 py-3.5 border-2 cursor-pointer border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all text-sm sm:text-base"
                  >
                    Skip to Campaign
                  </button>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="flex-1 bg-gradient-to-r  cursor-pointer from-[#764ba2] to-[#667eea] text-white py-3.5 rounded-xl hover:shadow-lg font-medium transition-all transform hover:scale-105 text-sm sm:text-base"
                  >
                    Add Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
