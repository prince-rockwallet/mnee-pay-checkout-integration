/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ShoppingBag, ArrowLeft, Loader2, Star } from "lucide-react";
import Link from "next/link";
import MneeCheckoutWrapper from "@/components/MneeCheckoutWrapper";
import { ButtonConfig } from "@/types/types";
import { getMneePayCheckoutBaseUrl } from "@/utils/utils";

export default function EcommercePage() {
  const [buttonId, setButtonId] = useState("");
  const [config, setConfig] = useState<ButtonConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buttonId) {
      return;
    }
    
    setLoading(true);
    setConfig(null);

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
      alert("Could not load e-commerce button configuration. Please check the ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-50">
      <nav className="border-b border-neutral-800 bg-neutral-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">MNEE Store</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <form onSubmit={fetchConfig} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Product/Button ID" 
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                  value={buttonId}
                  onChange={(e) => setButtonId(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Load Product"}
                </button>
             </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!config && (
            <div className="bg-neutral-800/50 rounded-3xl p-12 mb-16 border border-neutral-800 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Digital Assets & Products</h1>
                <p className="text-neutral-400">Enter a Button ID above to render the product card and test the checkout flow.</p>
            </div>
        )}

        {config && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8">
                <div className="bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 h-[500px] relative group">
                    <img 
                        src={config.productImage || "https://placehold.co/600x600/1e1b4b/818cf8?text=Product"} 
                        alt={config.productName || config.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {config.buttonType === 'ECOMMERCE' && (
                        <div className="absolute top-6 right-6 bg-indigo-600/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-white shadow-xl">
                            In Stock
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-2">{config.productName || config.name}</h2>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                            </div>
                            <span className="text-neutral-400 text-sm">(Verified Product)</span>
                        </div>
                        <p className="text-lg text-neutral-300 leading-relaxed">
                            {config.description || "No description available for this product."}
                        </p>
                    </div>

                    <div className="p-6 bg-neutral-800/50 rounded-2xl border border-neutral-700 space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400">Price</span>
                            <span className="text-3xl font-bold text-white">
                                ${((config.priceUsdCents || 0) / 100).toFixed(2)}
                            </span>
                        </div>

                        <div className="pt-4 border-t border-neutral-700">
                            <MneeCheckoutWrapper
                                config={config}
                                styling={{
                                    buttonSize: 'full',
                                    borderRadius: 'rounded',
                                    primaryColor: config.primaryColor || '#4f46e5'
                                }}
                            />
                            <p className="text-center text-xs text-neutral-500 mt-3">
                                Secure checkout powered by MNEE
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}