import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Wallet,
  Smartphone,
  CheckCircle,
  Plus,
  AlertCircle,
  Info,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/wallet/")({
  component: Wallets,
});

const providers = [
  {
    id: "mtn",
    name: "MTN Mobile Money",
    short: "MTN MoMo",
    icon: "📱",
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
  },
  {
    id: "vodafone",
    name: "Vodafone Cash",
    short: "Vodafone",
    icon: "💳",
    color: "from-red-400 to-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
  },
  {
    id: "airtel",
    name: "AirtelTigo Money",
    short: "AirtelTigo",
    icon: "📲",
    color: "from-red-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
  },
  {
    id: "telecel",
    name: "Telecel Cash",
    short: "Telecel",
    icon: "💰",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
  },
];

const quickAmounts = [10, 20, 50, 100, 200, 500];

// Recent transactions
const recentTransactions = [
  {
    id: 1,
    type: "credit",
    amount: 150.0,
    description: "MTN Mobile Money Deposit",
    date: "2025-10-02",
    status: "completed",
  },
  {
    id: 2,
    type: "debit",
    amount: 75.5,
    description: "Campaign: Summer Sale",
    date: "2025-10-01",
    status: "completed",
  },
  {
    id: 3,
    type: "credit",
    amount: 200.0,
    description: "Vodafone Cash Top-up",
    date: "2025-09-30",
    status: "completed",
  },
];

function Wallets() {
  const [step, setStep] = useState<
    "main" | "topup" | "confirm" | "processing" | "success"
  >("main");
  const [balance, setBalance] = useState(5250.75);
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatMoney = (val: number) => `GHS ${val.toFixed(2)}`;

  const resetFlow = () => {
    setStep("main");
    setAmount("");
    setPhone("");
    setProvider("");
    setErrors({});
  };

  const validate = () => {
    const e: { [key: string]: string } = {};
    if (!amount || parseFloat(amount) <= 0) e.amount = "Enter a valid amount";
    else if (parseFloat(amount) < 5) e.amount = "Minimum GHS 5";
    else if (parseFloat(amount) > 10000) e.amount = "Maximum GHS 10,000";

    if (!provider) e.provider = "Please select a payment provider";

    if (!phone) e.phone = "Enter your mobile money number";
    else if (phone.replace(/\D/g, "").length !== 10)
      e.phone = "Enter a valid 10-digit phone number";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const startTopUp = () => {
    if (validate()) setStep("confirm");
  };

  const confirmTopUp = () => {
    setStep("processing");
    setTimeout(() => {
      setBalance((b) => b + parseFloat(amount));
      setStep("success");
    }, 2500);
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "");
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 10)}`;
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  /** SUCCESS SCREEN */
  if (step === "success")
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mb-6 shadow-xl animate-bounce">
          <CheckCircle className="w-14 h-14 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
          Top-up Successful!
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          {formatMoney(parseFloat(amount))} has been added to your wallet
        </p>
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center mb-8 border border-green-200">
          <p className="text-sm text-gray-600 mb-1">New Balance</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {formatMoney(balance)}
          </p>
        </div>
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={resetFlow}
            className="w-full py-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Done
          </button>
          <button
            onClick={() => setStep("topup")}
            className="w-full py-4 rounded-xl border-2 border-purple-300 bg-white text-purple-700 font-semibold hover:bg-purple-50 transition-all"
          >
            Top-up Again
          </button>
        </div>
      </div>
    );

  /** PROCESSING SCREEN */
  if (step === "processing")
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          Processing Payment...
        </h2>
        <p className="text-gray-600 mb-8 text-sm max-w-sm">
          Please approve the payment prompt on your phone to complete this
          transaction
        </p>
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4 text-left border border-purple-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className="font-bold text-lg text-gray-900">
              {formatMoney(parseFloat(amount))}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Provider</span>
            <span className="font-semibold text-gray-900">
              {providers.find((p) => p.id === provider)?.icon}{" "}
              {providers.find((p) => p.id === provider)?.short}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phone</span>
            <span className="font-mono font-semibold text-gray-900">
              {phone}
            </span>
          </div>
        </div>
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 flex items-start max-w-sm">
          <Info className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600" />
          <p>
            If you don't receive a prompt within 30 seconds, please verify your
            phone number and network balance
          </p>
        </div>
      </div>
    );

  /** CONFIRM SCREEN */
  if (step === "confirm") {
    const data = providers.find((p) => p.id === provider);
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-slate-100">
        {/* Header */}
        <div className="flex items-center p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => setStep("topup")}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Confirm Payment</h1>
        </div>

        <div className="p-4 flex-1 max-w-2xl mx-auto w-full">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-200">
            <h3 className="text-lg font-bold text-center mb-4 text-gray-900">
              Payment Summary
            </h3>

            {/* Amount Display */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4 border border-purple-200">
              <p className="text-center text-sm text-gray-600 mb-1">
                Amount to Add
              </p>
              <p className="text-center text-3xl font-bold text-purple-700">
                {formatMoney(parseFloat(amount))}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>{data?.icon}</span>
                  {data?.short}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Phone Number</span>
                <span className="font-mono font-semibold text-gray-900">
                  {phone}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Current Balance</span>
                <span className="font-semibold text-gray-900">
                  {formatMoney(balance)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-3 border border-green-200">
                <span className="font-semibold text-gray-900">New Balance</span>
                <span className="font-bold text-lg text-green-700">
                  {formatMoney(balance + parseFloat(amount))}
                </span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start mb-4">
            <Shield className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Security Notice</p>
              <p>
                Only approve the payment prompt if all details above are
                correct. Never share your PIN with anyone.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-0 p-4 bg-white border-t shadow-lg space-y-3">
          <button
            onClick={confirmTopUp}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Confirm & Pay {formatMoney(parseFloat(amount))}
          </button>
          <button
            onClick={() => setStep("topup")}
            className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /** TOP-UP SCREEN */
  if (step === "topup")
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-slate-100">
        {/* Header */}
        <div className="flex items-center p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => setStep("main")}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-gray-900">Top-up Wallet</h1>
            <p className="text-xs text-gray-600">Add money to your wallet</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-5 pb-24 max-w-2xl mx-auto w-full">
          {/* Current Balance Card */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
            <p className="text-sm text-purple-200 mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Current Balance
            </p>
            <p className="text-4xl font-bold">{formatMoney(balance)}</p>
          </div>

          {/* Amount Section */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
            <h3 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Select Amount
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setAmount(val.toString());
                    setErrors((prev) => ({ ...prev, amount: "" }));
                  }}
                  className={`py-3 rounded-xl font-semibold transition-all ${
                    amount === val.toString()
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  GHS {val}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((prev) => ({ ...prev, amount: "" }));
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            {errors.amount && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {errors.amount}
              </div>
            )}
          </div>

          {/* Provider Section */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
            <h3 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              Select Provider
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setProvider(p.id);
                    setErrors((prev) => ({ ...prev, provider: "" }));
                  }}
                  className={`flex flex-col items-center py-5 rounded-xl border-2 transition-all ${
                    provider === p.id
                      ? `${p.borderColor} ${p.bgColor} scale-105 shadow-lg`
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${p.color} flex items-center justify-center text-2xl shadow-md mb-2`}
                  >
                    {p.icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {p.short}
                  </span>
                </button>
              ))}
            </div>
            {errors.provider && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {errors.provider}
              </div>
            )}
          </div>

          {/* Phone Section */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
            <h3 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              Phone Number
            </h3>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                placeholder="0XX XXX XXXX"
                value={phone}
                onChange={handlePhone}
                maxLength={13}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl font-mono text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            {errors.phone && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Button */}
        <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
          <button
            onClick={startTopUp}
            disabled={!amount || !provider || !phone}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
              !amount || !provider || !phone
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>
              {amount && parseFloat(amount) > 0
                ? `Top-up ${formatMoney(parseFloat(amount))}`
                : "Continue"}
            </span>
          </button>
        </div>
      </div>
    );

  /** MAIN WALLET SCREEN */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">My Wallet</h1>
                <p className="text-xs text-gray-600">Manage your balance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5 max-w-7xl mx-auto pb-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl shadow-2xl p-6 md:p-8 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10">
            <p className="text-sm text-purple-200 mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Available Balance
            </p>
            <p className="text-5xl md:text-6xl font-bold mb-6">
              {formatMoney(balance)}
            </p>
            <button
              onClick={() => setStep("topup")}
              className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Top-up Wallet
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Spent</span>
              <ArrowUpRight className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">GHS 1,240</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Added</span>
              <ArrowDownLeft className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">GHS 5,500</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg. Top-up</span>
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">GHS 275</p>
            <p className="text-xs text-gray-500 mt-1">Per transaction</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Recent Transactions
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "credit"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatMoney(transaction.amount)}
                    </p>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 text-center">
            <button className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DollarSign({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}
