import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "@mnee-pay/checkout/styles.css";

export const metadata: Metadata = {
  title: "MNEE Pay Testbench",
  description: "Testbench for MNEE Pay Checkout SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`antialiased h-full flex flex-col bg-neutral-900 text-neutral-50`}
      >
        <nav className="bg-neutral-950 shadow-sm border-b border-neutral-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">
                    MNEE Pay
                  </span>
                </Link>
                
                <div className="hidden md:flex gap-1 items-center">
                  <div className="w-px h-6 bg-neutral-700 mx-2" />
                  <NavLink href="/webhook">Webhook</NavLink>
                  <NavLink href="/donation">Donation</NavLink>
                  <NavLink href="/paywall">Paywall</NavLink>
                  <NavLink href="/ecommerce">E-commerce</NavLink>
                </div>
              </div>

              <div className="flex items-center md:hidden">
                <span className="text-xs text-neutral-500 font-mono">Testbench v0.1</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="grow">
          {children}
        </main>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="px-3 py-2 rounded-md text-sm font-medium text-neutral-300 hover:text-indigo-400 hover:bg-neutral-800 transition-all"
    >
      {children}
    </Link>
  );
}