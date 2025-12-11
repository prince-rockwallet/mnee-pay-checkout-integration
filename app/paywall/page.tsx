"use client";

import { useState } from 'react';
import { Lock, ArrowLeft, Check, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import MneeCheckoutWrapper from '@/components/MneeCheckoutWrapper';
import { ButtonConfig } from '@/types/types';
import { getMneePayCheckoutBaseUrl } from '@/utils/utils';

export default function PaywallPage() {
  const [buttonId, setButtonId] = useState("");
  const [config, setConfig] = useState<ButtonConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const fetchConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buttonId) {
      return;
    }
    
    setLoading(true);
    setConfig(null);
    setIsUnlocked(false);

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
      alert("Could not load paywall button configuration. Please check the ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-50">
      <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Link>
          
          <div className="flex items-center gap-4">
            <form onSubmit={fetchConfig} className="flex gap-2 items-center">
                <input 
                  type="text" 
                  placeholder="Paywall Button ID" 
                  className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-40"
                  value={buttonId}
                  onChange={(e) => setButtonId(e.target.value)}
                />
                <button type="submit" disabled={loading} className="text-neutral-400 hover:text-white">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                </button>
            </form>

            <div className="h-4 w-px bg-neutral-700 mx-2"></div>

            <div className="flex items-center gap-2 text-sm font-medium">
              <div className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-amber-500'}`} />
              {isUnlocked ? 'Premium Access' : 'Locked'}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {!config ? (
            <div className="text-center py-20 text-neutral-500">
                <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter a Button ID above to load the premium content.</p>
            </div>
        ) : (
            <>
                <header className="mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <span className="text-indigo-400 font-mono text-sm tracking-wider uppercase">Premium Content</span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                    {config.name || "Exclusive Content"}
                </h1>
                <p className="text-xl text-neutral-300">
                    {config.description || "This content is locked behind a paywall."}
                </p>
                </header>

                <article className="prose prose-invert prose-lg max-w-none">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <div className="relative mt-12 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
                    <div className={`p-8 transition-all duration-700 ${isUnlocked ? '' : 'blur-lg opacity-30 select-none'}`}>
                    <h3>Deep Dive Analysis</h3>
                    <p>
                        The core of our system uses a UTXO-based model. This allows parallel transaction processing. Unlike account-based models...
                    </p>
                    <p>
                        We implemented a custom SPV wallet client in the browser. This ensures that users maintain custody of their funds while interacting with the merchant...
                    </p>
                    <div className="bg-neutral-900 p-6 rounded-lg my-8 font-mono text-sm border border-neutral-800">
                        {'// Hidden implementation details...'}
                    </div>
                    </div>

                    {!isUnlocked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-linear-to-t from-neutral-900 via-neutral-900/90 to-neutral-900/60">
                        <div className="bg-neutral-800/80 backdrop-blur-xl p-8 rounded-2xl border border-neutral-700 shadow-2xl max-w-sm w-full text-center space-y-6">
                        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Lock className="w-8 h-8 text-indigo-400" />
                        </div>
                        
                        <div>
                            <h3 className="text-2xl font-bold text-white">Unlock Full Access</h3>
                            <p className="text-neutral-400 mt-2 text-sm">
                            One-time payment to reveal this content.
                            </p>
                        </div>

                        <div className="w-full">
                            <MneeCheckoutWrapper 
                                config={config}
                                onSuccess={() => setIsUnlocked(true)}
                                styling={{
                                    buttonSize: 'full',
                                    borderRadius: 'rounded',
                                    primaryColor: config.primaryColor || '#818cf8'
                                }}
                            />
                        </div>
                        </div>
                    </div>
                    )}
                </div>
                </article>

                {isUnlocked && (
                    <div className="mt-12 p-6 bg-green-900/10 border border-green-900/30 rounded-xl flex items-center gap-4 text-green-400 animate-in zoom-in">
                        <Check className="w-6 h-6" />
                        <div>
                            <p className="font-semibold">Access Granted</p>
                            <p className="text-sm opacity-80">You have successfully unlocked this content.</p>
                        </div>
                    </div>
                )}
            </>
        )}
      </main>
    </div>
  );
}