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
    color: "from-gray-400 to-gray-600",
  },
  {
    id: "airtel",
    name: "AirtelTigo Money",
    short: "AirtelTigo",
    icon: "📲",
    color: "from-slate-400 to-slate-600",
  },
  {
    id: "vodafone",
    name: "Vodafone Cash",
    short: "Vodafone",
    icon: "💳",
    color: "from-gray-500 to-gray-700",
  },
  {
    id: "telecel",
    name: "Telecel Cash",
    short: "Telecel",
    icon: "💰",
    color: "from-zinc-400 to-zinc-600",
  },
];

const quickAmounts = [5, 10, 20, 50, 100, 200];

function Wallets() {
  const [step, setStep] = useState<
    "select" | "confirm" | "processing" | "success"
  >("select");
  const [balance, setBalance] = useState(125.5);
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatMoney = (val: number) => `GH₵${val.toFixed(2)}`;

  const resetFlow = () => {
    setStep("select");
    setAmount("");
    setPhone("");
    setProvider("");
    setErrors({});
  };

  const validate = () => {
    const e: { [key: string]: string } = {};
    if (!amount || parseFloat(amount) <= 0) e.amount = "Enter an amount";
    else if (parseFloat(amount) < 1) e.amount = "Minimum GH₵1";
    else if (parseFloat(amount) > 5000) e.amount = "Maximum GH₵5000";

    if (!provider) e.provider = "Choose a provider";

    if (!phone) e.phone = "Enter your phone number";
    else if (phone.replace(/\D/g, "").length < 10)
      e.phone = "Invalid phone number";

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
    setPhone(formatPhone(e.target.value));
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  /** SUCCESS SCREEN */
  if (step === "success")
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-400 to-slate-500 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Top-up Successful 🎉</h2>
        <p className="text-gray-600 mb-6">
          {formatMoney(parseFloat(amount))} has been added to your wallet
        </p>
        <div className="bg-white p-4 rounded-2xl shadow text-center mb-6">
          <p className="text-sm text-gray-500">New Balance</p>
          <p className="text-3xl font-bold text-gray-700">
            {formatMoney(balance)}
          </p>
        </div>
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={resetFlow}
            className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-gray-500 to-slate-600 font-semibold"
          >
            Top-up Again
          </button>
          <button
            onClick={resetFlow}
            className="w-full py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    );

  /** PROCESSING SCREEN */
  if (step === "processing")
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-gray-50 to-slate-100 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">Processing Payment...</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Approve the prompt on your phone to complete this payment.
        </p>
        <div className="bg-white p-4 rounded-2xl shadow w-full max-w-sm space-y-2 text-left">
          <p>
            <span className="text-gray-500">Amount:</span>{" "}
            <b>{formatMoney(parseFloat(amount))}</b>
          </p>
          <p>
            <span className="text-gray-500">Provider:</span>{" "}
            <b>{providers.find((p) => p.id === provider)?.short}</b>
          </p>
          <p>
            <span className="text-gray-500">Phone:</span> <b>{phone}</b>
          </p>
        </div>
        <div className="mt-6 text-sm text-gray-700 flex items-start max-w-sm">
          <Info className="w-5 h-5 mr-2 mt-0.5" />
          If you don't receive a prompt, double-check your number & balance.
        </div>
      </div>
    );

  /** CONFIRM SCREEN */
  if (step === "confirm") {
    const data = providers.find((p) => p.id === provider);
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-slate-100">
        {/* Header */}
        <div className="flex items-center p-4 border-b bg-white sticky top-0">
          <button onClick={() => setStep("select")} className="mr-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold">Confirm Payment</h1>
        </div>

        <div className="p-4 flex-1">
          <div className="bg-white rounded-2xl shadow p-4 mb-4 space-y-3">
            <h3 className="text-lg font-bold text-center">Summary</h3>
            <p className="text-center text-2xl font-bold text-gray-700">
              {formatMoney(parseFloat(amount))}
            </p>
            <div className="flex justify-between">
              <span>Provider</span>
              <span>
                {data?.icon} {data?.short}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phone</span>
              <span className="font-mono">{phone}</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span>Current Balance</span>
              <span>{formatMoney(balance)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>New Balance</span>
              <span className="text-gray-700">
                {formatMoney(balance + parseFloat(amount))}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl text-sm flex items-start">
            <AlertCircle className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
            Approve the request only if these details match.
          </div>
        </div>

        <div className="sticky bottom-0 p-4 bg-white border-t space-y-2">
          <button
            onClick={confirmTopUp}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gray-600 to-slate-600 text-white font-bold"
          >
            Confirm & Pay {formatMoney(parseFloat(amount))}
          </button>
          <button
            onClick={() => setStep("select")}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  /** MAIN SELECTION SCREEN */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white sticky top-0">
        <Wallet className="w-5 h-5 text-gray-600 mr-2" />
        <h1 className="font-bold">Top-up Wallet</h1>
      </div>

      <div className="flex-1 p-4 space-y-6 pb-24">
        {/* Balance */}
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-3xl font-bold text-gray-700">
            {formatMoney(balance)}
          </p>
        </div>

        {/* Amount */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-semibold mb-3">Amount</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {quickAmounts.map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className={`py-3 rounded-xl font-semibold ${
                  amount === val.toString()
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Provider */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-semibold mb-3">Provider</h3>
          <div className="grid grid-cols-2 gap-3">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`flex flex-col items-center py-4 rounded-xl border ${
                  provider === p.id
                    ? "border-gray-500 bg-gray-50"
                    : "border-gray-200 bg-gray-25"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-r ${p.color} flex items-center justify-center`}
                >
                  <span>{p.icon}</span>
                </div>
                <span className="text-sm mt-2">{p.short}</span>
              </button>
            ))}
          </div>
          {errors.provider && (
            <p className="text-red-500 text-sm mt-1">{errors.provider}</p>
          )}
        </div>

        {/* Phone */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-semibold mb-3">Phone Number</h3>
          <div className="relative">
            <Smartphone className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="tel"
              placeholder="0XX XXX XXXX"
              value={phone}
              onChange={handlePhone}
              maxLength={13}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl font-mono focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <button
          onClick={startTopUp}
          disabled={!amount || !provider || !phone}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 ${
            !amount || !provider || !phone
              ? "bg-gray-200 text-gray-400"
              : "bg-gradient-to-r from-gray-600 to-slate-600 text-white"
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>
            {amount
              ? `Top-up ${formatMoney(parseFloat(amount))}`
              : "Top-up Wallet"}
          </span>
        </button>
      </div>
    </div>
  );
}
