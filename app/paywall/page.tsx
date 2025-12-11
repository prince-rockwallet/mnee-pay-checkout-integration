"use client";

import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import MneeCheckoutWrapper from '@/components/MneeCheckoutWrapper';

export default function PaywallPage() {
  const [unlocked] = useState(false);

  // You would typically handle this via the webhook or the onSuccess callback
  // For this demo, we'll simulate unlocking if we were integrating the event listener
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50 dark:bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Content Side */}
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
            {unlocked ? <Unlock className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
            {unlocked ? "Premium Access" : "Premium Content Locked"}
          </span>
          
          <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white">
            The Future of Payments
          </h1>
          
          <div className="prose dark:prose-invert">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            
            <div className={`relative rounded-xl overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 ${!unlocked ? 'blur-sm select-none' : ''}`}>
               <p className="mb-4">
                 <strong>This is the premium content.</strong> If you can read this clearly, the paywall has been unlocked. 
                 Usually, this state is controlled by your backend validating the webhook payment.
               </p>
               <p>
                 Detailed analysis of market trends, exclusive interviews, and data-driven insights are provided here for subscribers only.
               </p>
               
               {!unlocked && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 z-10">
                    <Lock className="w-12 h-12 text-neutral-800 dark:text-white opacity-50" />
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Checkout Side */}
        {!unlocked && (
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 text-center space-y-6">
            <h3 className="text-xl font-bold">Unlock Full Article</h3>
            <p className="text-neutral-500">One-time payment of $1.99</p>
            
            <MneeCheckoutWrapper
              apiBaseUrl="/api"
              previewMode={true}
              config={{
                buttonType: 'PAYWALL',
                name: 'Premium Article Access',
                buttonText: 'Unlock Content',
                priceUsdCents: 199,
                primaryColor: '#7c3aed', // Violet
              }}
              styling={{
                borderRadius: 'square'
              }}
              theme="auto"
            />
            
            <p className="text-xs text-neutral-400">
              Payment handled securely via MNEE Pay.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}