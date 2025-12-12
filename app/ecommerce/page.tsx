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
      const res = await fetch(`${getMneePayCheckoutBaseUrl()}/api/buttons/public/${buttonId}/config`);
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">MNEE Store</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <form onSubmit={fetchConfig} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Product/Button ID" 
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                  value={buttonId}
                  onChange={(e) => setButtonId(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gray-500 hover:bg-indigo-700 text-gray-500 px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Load Product"}
                </button>
             </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!config && (
            <div className="bg-white rounded-3xl p-12 mb-16 border border-gray-200 text-center shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Digital Assets & Products</h1>
                <p className="text-gray-600">Enter a Button ID above to render the product card and test the checkout flow.</p>
            </div>
        )}

        {config && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 h-[500px] relative group shadow-sm">
                    <img 
                        src={config.productImage || "https://placehold.co/600x600/e5e7eb/4b5563?text=Product"} 
                        alt={config.productName || config.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {config.buttonType === 'ECOMMERCE' && (
                        <div className="absolute top-6 right-6 bg-indigo-600 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg">
                            In Stock
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">{config.productName || config.name}</h2>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                            </div>
                            <span className="text-gray-600 text-sm">(Verified Product)</span>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {config.description || "No description available for this product."}
                        </p>
                    </div>

                    <div className="p-6 bg-gray-100 rounded-2xl border border-gray-200 space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Price</span>
                            <span className="text-3xl font-bold text-gray-900">
                                ${((config.priceUsdCents || 0) / 100).toFixed(2)}
                            </span>
                        </div>

                        <div className="pt-4 border-t border-gray-300">
                            <MneeCheckoutWrapper
                                config={config}
                                styling={{
                                    buttonSize: 'full',
                                    borderRadius: 'rounded',
                                    primaryColor: config.primaryColor || '#4f46e5'
                                }}
                            />
                            <p className="text-center text-xs text-gray-500 mt-3">
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