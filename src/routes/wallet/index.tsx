import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Wallet, Smartphone, CheckCircle, Plus } from "lucide-react";

export const Route = createFileRoute("/wallet/")({
  component: Wallets,
});

const mobileProviders = [
  { id: "mtn", name: "MTN Mobile Money", icon: "📱", color: "bg-yellow-500" },
  { id: "airtel", name: "AirtelTigo Money", icon: "📲", color: "bg-red-500" },
  { id: "vodafone", name: "Vodafone Cash", icon: "💳", color: "bg-red-600" },
  { id: "telecel", name: "Telecel Cash", icon: "💰", color: "bg-blue-500" },
];

const quickAmounts = [10, 20, 50, 100, 200, 500];

function Wallets() {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState("select"); // select, confirm, processing, success
  const [currentBalance, setCurrentBalance] = useState(125.5);

  const formatCurrency = (amount: number) => `GH₵${amount.toFixed(2)}`;

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleTopUp = () => {
    if (!selectedProvider || !amount || !phoneNumber) return;
    setStep("confirm");
  };

  const handleConfirm = () => {
    setStep("processing");
    // Simulate processing
    setTimeout(() => {
      setStep("success");
      setCurrentBalance((prev) => prev + parseFloat(amount));
    }, 3000);
  };

  const resetFlow = () => {
    setStep("select");
    setAmount("");
    setPhoneNumber("");
    setSelectedProvider("");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Top-up Successful!
              </h2>
              <p className="text-gray-600">
                Your wallet has been credited with{" "}
                {formatCurrency(parseFloat(amount))}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">New Balance</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(currentBalance)}
                </p>
              </div>
            </div>

            <button
              onClick={resetFlow}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              }}
            >
              Top-up Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please check your phone for the payment prompt
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Amount:{" "}
                <span className="font-semibold">
                  {formatCurrency(parseFloat(amount))}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Provider:{" "}
                <span className="font-semibold">
                  {mobileProviders.find((p) => p.id === selectedProvider)?.name}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Phone: <span className="font-semibold">{phoneNumber}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep("select")}
                className="p-2 rounded-full hover:bg-white/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-lg font-bold text-gray-800">
                Confirm Top-up
              </h1>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Payment Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-xl text-gray-800">
                  {formatCurrency(parseFloat(amount))}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Provider</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {
                      mobileProviders.find((p) => p.id === selectedProvider)
                        ?.icon
                    }
                  </span>
                  <span className="font-semibold text-gray-800">
                    {
                      mobileProviders.find((p) => p.id === selectedProvider)
                        ?.name
                    }
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone Number</span>
                <span className="font-semibold text-gray-800">
                  {phoneNumber}
                </span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Balance</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(currentBalance)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Balance</span>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(currentBalance + parseFloat(amount))}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              }}
            >
              Confirm Payment
            </button>

            <button
              onClick={() => setStep("select")}
              className="w-full py-4 rounded-xl font-semibold text-gray-700 bg-white/50 backdrop-blur-sm border border-gray-200 hover:bg-white/70 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              }}
            >
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">Top-up Wallet</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Balance */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Current Balance</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {formatCurrency(currentBalance)}
            </p>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Select Amount
          </h3>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {quickAmounts.map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className={`py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                  amount === value.toString()
                    ? "text-white transform scale-105 border-purple-400"
                    : "text-gray-700 bg-white/50 hover:bg-white/70 border-gray-200 hover:border-purple-300"
                }`}
                style={
                  amount === value.toString()
                    ? {
                        background:
                          "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                      }
                    : {}
                }
              >
                {formatCurrency(value)}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="relative">
            <input
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
            />
            <div className="absolute right-3 top-3 text-gray-500 text-sm">
              GH₵
            </div>
          </div>
        </div>

        {/* Mobile Provider Selection */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Select Provider
          </h3>

          <div className="space-y-3">
            {mobileProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedProvider === provider.id
                    ? "border-purple-400 bg-purple-50/50 transform scale-105"
                    : "border-gray-200 bg-white/30 hover:bg-white/50"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{provider.icon}</div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">
                      {provider.name}
                    </p>
                  </div>
                  {selectedProvider === provider.id && (
                    <CheckCircle className="w-5 h-5 text-purple-600 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Phone Number</h3>

          <div className="relative">
            <Smartphone className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="tel"
              placeholder="0XX XXX XXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-500"
            />
          </div>
        </div>

        {/* Top-up Button */}
        <button
          onClick={handleTopUp}
          disabled={!selectedProvider || !amount || !phoneNumber}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
            !selectedProvider || !amount || !phoneNumber
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-white transform hover:scale-105"
          }`}
          style={
            selectedProvider && amount && phoneNumber
              ? {
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                }
              : {}
          }
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Top-up Wallet</span>
          </div>
        </button>
      </div>
    </div>
  );
}
