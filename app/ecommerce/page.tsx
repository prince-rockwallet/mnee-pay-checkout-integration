/* eslint-disable @next/next/no-img-element */
"use client";

import MneeCheckoutWrapper from "@/components/MneeCheckoutWrapper";

export default function EcommercePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50 dark:bg-neutral-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">MNEE Store</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Add items to your cart and checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Product 1 */}
          <ProductCard 
            title="Digital Artwork"
            price={2500}
            image="https://placehold.co/400x300/indigo/white?text=Art"
            config={{
              buttonType: 'ECOMMERCE',
              name: 'Digital Artwork #1',
              productName: 'Digital Artwork #1',
              priceUsdCents: 2500,
              enableCart: true,
              cartPosition: 'bottom-right',
              productImage: 'https://placehold.co/400x300/indigo/white?text=Art',
              primaryColor: '#4f46e5',
            }}
          />

          {/* Product 2 */}
          <ProductCard 
            title="Software License"
            price={9900}
            image="https://placehold.co/400x300/purple/white?text=License"
            config={{
              buttonType: 'ECOMMERCE',
              name: 'Pro License',
              productName: 'Pro License Year 1',
              priceUsdCents: 9900,
              enableCart: true,
              cartPosition: 'bottom-right',
              productImage: 'https://placehold.co/400x300/purple/white?text=License',
              primaryColor: '#4f46e5',
              showQuantitySelector: true,
            }}
          />

          {/* Product 3 */}
          <ProductCard 
            title="Consultation"
            price={15000}
            image="https://placehold.co/400x300/orange/white?text=Meet"
            config={{
              buttonType: 'ECOMMERCE',
              name: '1h Consultation',
              productName: '1h Consultation',
              priceUsdCents: 15000,
              enableCart: true,
              cartPosition: 'bottom-right',
              productImage: 'https://placehold.co/400x300/orange/white?text=Meet',
              primaryColor: '#4f46e5',
              customFields: [
                 { id: 'date', label: 'Preferred Date', type: 'text', placeholder: 'YYYY-MM-DD' }
              ]
            }}
          />

        </div>
      </div>
    </div>
  );
}

// Helper component for product layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductCard({ title, price, image, config }: any) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700 flex flex-col">
      <div className="h-48 bg-neutral-200 dark:bg-neutral-700 relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 flex-1 flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{title}</h3>
          <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            ${(price / 100).toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-neutral-500 flex-1">
          High quality digital item delivered instantly upon payment.
        </p>
        
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700">
          <MneeCheckoutWrapper
            apiBaseUrl="/api"
            previewMode={true}
            config={config}
            theme="auto"
            styling={{
               buttonSize: 'full' // Make button stretch
            }}
          />
        </div>
      </div>
    </div>
  );
}