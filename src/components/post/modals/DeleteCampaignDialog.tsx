import { useEffect, useState } from "react";
import ApiService from "@/helpers/api.service";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Storage } from "@/helpers/local.storage";

interface DeleteCampaignDialogProps {
  isOpen: boolean;
  campaignEditVideo: any;
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess?: () => void;
}

export default function DeleteCampaignDialog({
  isOpen,
  onOpenChange,
  campaignEditVideo,
  onDeleteSuccess,
}: DeleteCampaignDialogProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = Storage.getPublisherId("publisherId") || {};

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 50);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleDeletePost = async () => {
    if (!campaignEditVideo?.id) {
      toast.error("Invalid campaign data");
      return;
    }

    setIsDeleting(true);

    try {
      await ApiService.delete_api(
        `/campaign-wallet/${id}/campaign/${campaignEditVideo.id}/delete`
      );

      toast.success(
        `"${campaignEditVideo.name || "Video"}" deleted successfully`
      );

      // Call the success callback to refresh the data
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete video. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

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
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col transition-all duration-300 ${
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Delete Campaign
              </h2>
              <p className="text-sm text-gray-500">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Are you sure you want to delete video with title{" "}
            <span className="text-red-600">
              {campaignEditVideo.name
                ? `"${campaignEditVideo.name}"`
                : "this campaign"}
            </span>
            ?
          </h3>
          <p className="text-sm text-gray-500">
            Once deleted, all associated videos and analytics will be
            permanently removed.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className={`flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl transition-all font-semibold ${
              isDeleting
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeletePost}
            disabled={isDeleting}
            className={`flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 ${
              isDeleting
                ? "opacity-75 cursor-not-allowed"
                : "cursor-pointer hover:shadow-lg hover:from-red-700 hover:to-orange-700"
            }`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
