import { useEffect, useState } from "react";
import { X, Save, Target, MapPin, Calendar, Banknote } from "lucide-react";
import { toast } from "sonner";
import ApiService from "@/helpers/api.service";
// Mock Ghana regions
const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Upper East",
  "Upper West",
  "Volta",
  "Bono",
  "Bono East",
  "Ahafo",
  "Savannah",
  "North East",
  "Oti",
  "Western North",
];

interface CampaignEditorProps {
  isOpen?: boolean;
  campaignData?: any;
  onClose?: () => void;
  onDeleteSuccess?: () => void;
  onSave?: (data: any) => void;
}

export default function CampaignEditor({
  isOpen = true,
  campaignData,
  onClose = () => console.log("Close clicked"),
  onDeleteSuccess,
}: CampaignEditorProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Extract regions from resources array
  const getRegionsFromData = (data: any) => {
    if (
      data?.resources &&
      data.resources.length > 0 &&
      data.resources[0].regions
    ) {
      return data.resources[0].regions;
    }
    return ["Greater Accra"];
  };

  const [initialData, setInitialData] = useState({
    name: campaignData?.name || "",
    campaignAmount: campaignData?.campaignAmount || 0,
    duration: campaignData?.duration || 1,
    regions: getRegionsFromData(campaignData),
  });

  const [editForm, setEditForm] = useState(initialData);

  useEffect(() => {
    const newInitialData = {
      name: extractVideoTitle(campaignData?.name || ""),
      campaignAmount: campaignData?.campaignAmount || 0,
      duration: campaignData?.duration || 1,
      regions: getRegionsFromData(campaignData),
    };
    setInitialData(newInitialData);
    setEditForm(newInitialData);
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "campaignAmount") {
      const newBudget = parseFloat(value) || 0;
      setEditForm((prev) => ({ ...prev, [name]: newBudget }));
    } else if (name === "duration") {
      const duration = parseInt(value) || 1;
      setEditForm((prev) => ({
        ...prev,
        [name]: Math.min(Math.max(duration, 1), 12),
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleRegion = (region: string) => {
    setEditForm((prev) => {
      const currentRegions = prev.regions;
      if (currentRegions.includes(region)) {
        // Don't allow removing all regions
        if (currentRegions.length === 1) return prev;
        return {
          ...prev,
          regions: currentRegions.filter((r: string) => r !== region),
        };
      } else {
        return { ...prev, regions: [...currentRegions, region] };
      }
    });
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      alert("Please enter a campaign name");
      return;
    }

    if (editForm.regions.length === 0) {
      alert("Please select at least one region");
      return;
    }

    try {
      setIsSaving(true);

      await ApiService.put_api(`/campaign-wallet/campaign/update`, {
        campaignWalletId: campaignData?.id,
        name: editForm.name,
        campaignAmount: editForm.campaignAmount,
        duration: editForm.duration,
        regions: editForm.regions,
      });

      toast.success(`Campaign "${editForm.name}" updated successfully`);

      // Call the success callback to refresh the data
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      // Close the editor after successful save
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update campaign. Please try again."
      );
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    setEditForm(initialData);
    onClose();
  };

  if (!shouldRender) return null;

  function extractVideoTitle(filename: string): string {
    const match = filename.match(/_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z/);
    if (!match) return filename;

    return filename.slice(0, match.index).replace(/_+$/, "").trim();
  }
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
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Campaign</h2>
              <p className="text-sm text-gray-500">
                Update your campaign details
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                placeholder="Enter campaign name"
                maxLength={100}
                disabled={isSaving}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Give your campaign a clear, descriptive name
                </p>
                <p className="text-xs text-gray-500">
                  {editForm.name.length} / 100
                </p>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campaign Budget (GH₵) *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Banknote className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="campaignAmount"
                  value={editForm.campaignAmount}
                  onChange={handleFormChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                  placeholder="Enter budget amount"
                  step="100"
                  disabled={isSaving}
                />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  Original budget: GH₵
                  {initialData.campaignAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campaign Duration (months) *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="duration"
                  value={editForm.duration}
                  onChange={handleFormChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                  placeholder="Duration in months"
                  min="1"
                  max="12"
                  disabled={isSaving}
                />
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  Select duration between 1 and 12 months
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[1, 3, 6, 12].map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() =>
                        setEditForm((prev) => ({ ...prev, duration: months }))
                      }
                      disabled={isSaving}
                      className={`px-3 py-1 text-xs rounded-lg transition-all ${
                        editForm.duration === months
                          ? "bg-purple-400 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {months} {months === 1 ? "month" : "months"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Regions (Multiple Selection) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Regions * (Select one or more)
              </label>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">
                  {editForm.regions.length}{" "}
                  {editForm.regions.length === 1 ? "region" : "regions"}{" "}
                  selected
                </p>
              </div>
              <div className="border border-gray-300 rounded-xl p-4 max-h-60 overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  {GHANA_REGIONS.map((region) => {
                    const isSelected = editForm.regions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleRegion(region)}
                        disabled={isSaving}
                        className={`px-3 py-2 text-sm rounded-lg transition-all text-left ${
                          isSelected
                            ? "bg-purple-400 text-white font-medium"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click regions to select or deselect. At least one region is
                required.
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-purple-50 to-gray-50 rounded-xl p-4 border border-purple-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Campaign Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900 truncate ml-2">
                    {editForm.name || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium text-gray-900">
                    GH₵{editForm.campaignAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">
                    {editForm.duration}{" "}
                    {editForm.duration === 1 ? "month" : "months"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-600">Regions:</span>
                  <div className="flex flex-wrap gap-1">
                    {editForm.regions.map((region: any) => (
                      <span
                        key={region}
                        className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded-full"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
              disabled={
                isSaving ||
                !editForm.name.trim() ||
                editForm.regions.length === 0
              }
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
      </div>
    </div>
  );
}
