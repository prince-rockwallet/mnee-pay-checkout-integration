"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, Trash2, Activity } from "lucide-react";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

interface WebhookLog {
  id: string;
  receivedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export default function WebhookPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);

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
    fetchLogs();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isLive) {
      fetchLogs();
      intervalId = setInterval(fetchLogs, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLive]);

  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <main className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Webhook Inspector
          </h1>
          <p className="text-neutral-400">
            Send POST requests to:{" "}
            <code className="bg-indigo-900/30 border border-indigo-500/20 px-2 py-1 rounded text-sm font-mono text-indigo-300">
              /api/mnee-pay-webhook
            </code>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center bg-neutral-800 p-4 rounded-xl shadow-lg border border-neutral-700/50 gap-4">
          
          <div className="flex items-center gap-3 bg-neutral-900/50 px-4 py-2 rounded-lg border border-neutral-700/50">
            <span className="relative flex h-3 w-3">
              {isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span 
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isLive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500"
                }`}
              ></span>
            </span>
            <span className={`text-sm font-medium ${isLive ? "text-emerald-400" : "text-neutral-400"}`}>
              {isLive ? "Live Listening" : "Paused"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 border ${
                isLive
                  ? "bg-neutral-700/50 border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  : "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500 shadow-md hover:shadow-lg hover:shadow-emerald-900/20"
              }`}
            >
              {isLive ? (
                <>
                  <Pause className="w-4 h-4" /> Stop Live
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Go Live
                </>
              )}
            </button>
            
            <div className="w-px h-6 bg-neutral-700 mx-2"></div>

            <button
              onClick={() => setLogs([])}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-neutral-800 bg-neutral-900/30 rounded-xl">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-neutral-600" />
              </div>
              <p className="text-neutral-400 font-medium">No webhook events received yet.</p>
              <p className="text-neutral-600 text-sm mt-1">Waiting for incoming POST requests...</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-neutral-800 rounded-xl shadow-lg border border-neutral-700 overflow-hidden transition-all hover:border-neutral-600"
              >
                <div className="bg-neutral-900/50 px-6 py-3 border-b border-neutral-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-neutral-500">
                      ID: <span className="text-neutral-300">{log.id}</span>
                    </span>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full w-fit">
                    {new Date(log.receivedAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="p-4 bg-[#0d1117] overflow-x-auto custom-scrollbar">
                  <ReactJson
                    src={log.data}
                    theme="monokai"
                    collapsed={false}
                    displayDataTypes={false}
                    enableClipboard={true}
                    style={{ backgroundColor: "transparent", fontSize: '0.875rem' }}
                    name={false}
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
    <div className="w-full h-32 bg-neutral-800 rounded-xl border border-neutral-700 p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-neutral-700/50 rounded w-3/4"></div>
        <div className="h-3 bg-neutral-700/50 rounded w-1/2"></div>
      </div>
    </div>
  );
}