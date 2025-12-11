"use client";

import MneeCheckoutWrapper from "@/components/MneeCheckoutWrapper";

export default function DonationPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Support Our Work</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            This is a test of the <strong>Donation</strong> flow.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700">
          <MneeCheckoutWrapper
            apiBaseUrl="/api" // Ensure this points to a valid handler if not using previewMode
            previewMode={true} // Using preview mode for UI testing without backend keys
            config={{
              buttonType: 'DONATION',
              name: 'Support Development',
              buttonText: 'Donate with MNEE',
              primaryColor: '#ec4899', // Pink
              allowCustomAmount: true,
              suggestedAmounts: [500, 1000, 2500], // $5, $10, $25
              minAmountCents: 100,
              maxAmountCents: 50000,
              collectEmail: true,
            }}
            theme="auto"
          />
        </div>
      </div>
    </div>
  );
}