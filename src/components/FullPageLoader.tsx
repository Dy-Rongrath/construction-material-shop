import { Wrench } from 'lucide-react';

/**
 * A full-screen overlay loader.
 * Ideal for initial app loading or full page transitions where you want to block UI interaction.
 * Usage: Place this component conditionally in your root layout.
 *
 * Note: This component uses position: fixed which may cause Next.js to skip auto-scroll
 * behavior during navigation. This is expected behavior for full-screen overlays.
 */
export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="relative flex items-center justify-center">
        <Wrench
          className="w-20 h-20 text-yellow-500 animate-spin"
          style={{ animationDuration: '3s' }}
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-white">Loading Materials...</p>
    </div>
  );
}
