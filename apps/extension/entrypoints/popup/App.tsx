import { useEffect } from 'react';
// [I SHOW] Importing one icon from lucide-react:
// [YOUR TURN] Step 1: Add ExternalLink right next to Zap (separated by a comma)
import { Zap } from 'lucide-react';

function App() {
  useEffect(() => {
    console.log('[CodeFrame Popup] Popup opened!');
  }, []);

  const appName = "CodeFrame";

  const handleTestClick = () => {
    console.log(appName);
  };

  return (
    <div className="w-80 bg-zinc-950 p-4 text-zinc-100">
      <div className="mb-3 flex items-center justify-between">
        {/* [I SHOW] Icon + title side by side using Tailwind */}
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-400" />
          <h1 className="text-lg font-bold tracking-tight text-white">
            CodeFrame
          </h1>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
          Ready
        </span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-zinc-400">
        Open any YouTube coding video to start capturing code frames and notes.
      </p>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleTestClick}
          className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Test Popup Log
        </button>

        {/* [YOUR TURN] Step 2: Add an <a> link right here to http://localhost:3000/dashboard */}
        {/* Hint: Use target="_blank" rel="noreferrer", put "Open Study Dashboard" + your ExternalLink icon inside! */}
      </div>
    </div>
  );
}

export default App;
