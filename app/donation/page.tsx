"use client";

import { useState } from "react";
import { Heart, CheckCircle2, ArrowLeft, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import MneeCheckoutWrapper from "@/components/MneeCheckoutWrapper";
import { getMneePayCheckoutBaseUrl } from "@/utils/utils";
import { ButtonConfig } from "@/types/types";

export default function DonationPage() {
  const [buttonId, setButtonId] = useState("");
  const [config, setConfig] = useState<ButtonConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [donated, setDonated] = useState(false);

  const fetchConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buttonId) {
      return;
    }
    
    setLoading(true);
    setConfig(null);
    setDonated(false);

    try {
      const res = await fetch(`${getMneePayCheckoutBaseUrl()}/buttons/public/${buttonId}/config`);
      if (!res.ok) {
        throw new Error("Button not found");
      }

      const data = await res.json();
      console.log(data);
      setConfig(data);
    } catch (error) {
      console.error(error);
      alert("Could not load donation button configuration. Please check the ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      <Link href="/" className="absolute top-8 left-8 text-neutral-400 hover:text-white transition-colors flex items-center gap-2 z-10">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="max-w-lg w-full relative z-10 space-y-8">
        
        <div className="bg-neutral-800/50 backdrop-blur-md p-6 rounded-2xl border border-neutral-700">
          <form onSubmit={fetchConfig} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter Donation Button ID" 
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={buttonId}
              onChange={(e) => setButtonId(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {config && (
          donated ? (
            <div className="bg-neutral-800 p-12 rounded-3xl shadow-2xl border border-neutral-700 text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>
                <p className="text-neutral-400">
                  Your support for <strong>{config.name}</strong> has been received.
                </p>
              </div>
              <button
                onClick={() => setDonated(false)}
                className="mt-4 text-sm text-rose-400 hover:text-rose-300 font-medium"
              >
                Make another donation
              </button>
            </div>
          ) : (
            <div className="bg-neutral-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-neutral-700 space-y-8 animate-in slide-in-from-bottom-4">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto rotate-3">
                  <Heart className="w-8 h-8 text-rose-500 fill-rose-500/50" />
                </div>
                <h1 className="text-3xl font-bold text-white">{config.name}</h1>
                <p className="text-neutral-400 leading-relaxed">
                  {config.description || "Support this project with a secure crypto donation."}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-700">
                <MneeCheckoutWrapper 
                  config={config}
                  onSuccess={() => setDonated(true)}
                  styling={{
                    buttonSize: config.buttonSize || 'full',
                    borderRadius: config.borderRadius || 'rounded',
                    primaryColor: config.primaryColor || '#e11d48',
                    accentColor: config.accentColor,
                    buttonColor: config.buttonColor,
                    buttonTextColor: config.buttonTextColor,
                    customCSS: config.customCSS,
                    fontFamily: config.fontFamily
                  }}
                  buttonId={buttonId}
                  showConfetti={config.showConfetti}
                  theme={config.theme}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}