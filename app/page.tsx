"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

interface WebhookLog {
  id: number;
  receivedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export default function Home() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/mnee-pay-webhook");
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLogs();

    // Poll every 2 seconds
    const intervalId = setInterval(fetchLogs, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8 font-sans transition-colors duration-300">
      <main className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Mnee Pay Webhook Inspector
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Send POST requests to:{" "}
            <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-sm font-mono text-pink-600 dark:text-pink-400">
              /api/mnee-pay-webhook
            </code>
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex justify-between items-center bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              Listening for events...
            </span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-sm text-red-500 hover:text-red-700 font-semibold px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
          >
            Clear History
          </button>
        </div>

        {/* Content Feed */}
        <div className="space-y-4">
          {loading ? (
            // Loading Skeletons
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : logs.length === 0 ? (
            // Empty State
            <div className="text-center py-20 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
              <p className="text-neutral-400">No webhook events received yet.</p>
            </div>
          ) : (
            // Logs List
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden"
              >
                {/* Log Header */}
                <div className="bg-neutral-50 dark:bg-neutral-700/50 px-6 py-3 border-b border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                      ID: {log.id}
                    </span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full w-fit">
                    {new Date(log.receivedAt).toLocaleString()}
                  </span>
                </div>

                {/* JSON Viewer */}
                <div className="p-4 bg-[#1e1e1e] overflow-hidden">
                  <ReactJson
                    src={log.data}
                    theme="monokai" // A dark theme that fits well
                    collapsed={false}
                    displayDataTypes={false}
                    enableClipboard={true}
                    style={{ backgroundColor: "transparent" }} // Blend with container
                    name={false} // Hide root name
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// Simple Skeleton Loader Component
function LoadingSkeleton() {
  return (
    <div className="w-full h-32 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}