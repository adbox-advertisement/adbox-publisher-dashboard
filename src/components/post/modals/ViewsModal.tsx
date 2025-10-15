import type { UserProfile } from "../types/interface";
import { X } from "lucide-react";

export function ViewsModal({
  isOpen,
  onClose,
  views,
  // videoTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  views: UserProfile[];
  videoTitle?: string;
}) {
  if (!isOpen) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Views</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {views.length} {views.length === 1 ? "person" : "people"} viewed
              this
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-2">
            {views.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {user.viewer.image ? (
                  <img
                    src={user.viewer.image}
                    alt={user.viewer.fullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200">
                    {getInitials(user.viewer.fullName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user.viewer.fullName}
                  </p>
                  <p className="text-sm text-gray-500">Viewer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
