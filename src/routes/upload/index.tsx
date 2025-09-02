import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";

export const Route = createFileRoute("/upload/")({
  component: VideoUploads,
});

function VideoUploads() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
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

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Upload video
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Post a video to your account
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Upload Area - Takes 1 column on xl screens */}
          <div className="xl:col-span-1">
            {!selectedFile ? (
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-4 md:p-6 text-center transition-all duration-200
                  ${
                    dragActive
                      ? "border-[#764ba2] bg-gradient-to-r from-[rgba(118,75,162,0.1)] to-[rgba(102,126,234,0.1)]"
                      : "border-gray-300 hover:border-[#764ba2] hover:bg-gradient-to-r hover:from-[rgba(118,75,162,0.05)] hover:to-[rgba(102,126,234,0.05)]"
                  }
                  cursor-pointer h-[300px] md:h-[400px] flex flex-col justify-center
                `}
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

                {/* Upload Icon */}
                <div className="mb-3 md:mb-4">
                  <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-full flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                  Select video to upload
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Or drag and drop a file
                </p>

                {/* Upload Button */}
                <button className="bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:scale-105 transform transition-all duration-200 mx-auto text-sm md:text-base">
                  Select file
                </button>

                {/* File Requirements */}
                <div className="mt-4 text-xs text-gray-400 space-y-1">
                  <p>MP4 or WebM • Up to 10 min • Less than 2GB</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-[9/16] max-w-[200px] mx-auto bg-black rounded-lg overflow-hidden">
                  <video
                    src={previewUrl || undefined}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={resetUpload}
                      className="text-red-500 hover:text-red-700 p-1 ml-2 flex-shrink-0"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-[#764ba2] to-[#667eea] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {uploadProgress === 100 && !isUploading && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-green-700 font-medium text-sm">
                        Upload complete!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Video Details Form - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Video Details
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Caption */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Caption
                    </label>
                    <textarea
                      placeholder="Share more about your video..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent transition-colors text-sm"
                      rows={3}
                      maxLength={2200}
                    />
                    <p className="text-xs text-gray-500 mt-1">0 / 2200</p>
                  </div>

                  {/* Video Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Title
                    </label>
                    <input
                      type="text"
                      placeholder="Give your video a catchy title..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#764ba2] focus:border-transparent transition-colors text-sm"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">0 / 100</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Quiz Section */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Add Quiz Question (Optional)
                    </label>

                    {/* Question */}
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Ask a question about your video..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#764ba2] focus:border-transparent transition-colors text-sm"
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 mt-1">0 / 200</p>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Answer Options:
                      </p>
                      {[1, 2, 3].map((optionNum) => (
                        <div
                          key={optionNum}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name="correctAnswer"
                            value={optionNum}
                            className="text-[#764ba2] focus:ring-[#764ba2] w-3 h-3 flex-shrink-0"
                          />
                          <label className="text-xs text-gray-600 flex-shrink-0">
                            Correct:
                          </label>
                          <input
                            type="text"
                            placeholder={`Answer ${optionNum}...`}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#764ba2] focus:border-transparent transition-colors text-xs"
                            maxLength={80}
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-2">
                        Select the correct answer
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={resetUpload}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Discard
                </button>
                <button
                  onClick={simulateUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex-1 bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                >
                  {isUploading
                    ? "Uploading..."
                    : uploadProgress === 100
                      ? "Posted!"
                      : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
