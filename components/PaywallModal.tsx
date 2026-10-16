import React, { useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerUrl: string;
  customerId: string | null;
}

const MODES_LIST = [
  'Professor — General IT tutor',
  'Coder — Senior software engineer',
  'Troubleshooter — IT diagnostics',
  'Security Analyst — Defensive cybersecurity',
  'ATCG — Automated Test Case Generator',
  'SDCP — Semantic Debugging Co-Pilot',
  'CLFT — Cross-Language & Framework Translator',
  'API & Schema — Integration & validation',
  'CDKBG — Documentation & Knowledge Base Generator',
  'PPRA — Predictive Performance & Resource Analyzer',
  'GUUP — Generative UI/UX Prototyper',
  'SEE — Simulated Experimentation Environment',
];

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, workerUrl, customerId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const appUrl = window.location.origin;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customerId) headers['Authorization'] = `Bearer ${customerId}`;

      const resp = await fetch(`${workerUrl}/api/create-checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          success_url: `${appUrl}?checkout=success`,
          cancel_url: `${appUrl}?checkout=cancel`,
        }),
      });

      const data = await resp.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? 'Failed to create checkout session.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!customerId) {
      setError('No Customer ID found. Please set up your account first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${workerUrl}/api/create-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerId}`,
        },
        body: JSON.stringify({ return_url: window.location.origin }),
      });

      const data = await resp.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? 'Failed to open customer portal.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg border-2 border-lime-400/60 bg-black rounded-xl shadow-[0_0_40px_rgba(57,255,20,0.2)] overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-lime-400/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-lime-400 font-mono tracking-widest">AIT PROfessor</h2>
              <p className="text-lime-400/60 text-sm font-mono mt-1">Subscription Required</p>
            </div>
            <button
              onClick={onClose}
              className="text-lime-400/60 hover:text-lime-400 transition-colors text-2xl font-mono leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6 border-b border-lime-400/20 text-center">
          <div className="inline-block border border-lime-400/40 rounded-lg px-6 py-4 bg-lime-400/5">
            <span className="text-4xl font-bold text-lime-400 font-mono">$9.99</span>
            <span className="text-lime-400/70 font-mono">/month</span>
            <p className="text-lime-400/80 font-mono text-sm mt-1">Unlimited Access — All 12 Modes</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-6 border-b border-lime-400/20">
          <h3 className="text-lime-400 font-mono text-sm font-bold mb-3 tracking-widest uppercase">Included Modes</h3>
          <ul className="space-y-2">
            {MODES_LIST.map((mode, i) => (
              <li key={i} className="flex items-start gap-2 font-mono text-xs text-lime-400/80">
                <span className="text-lime-400 mt-0.5">▸</span>
                <span>{mode}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          {error && (
            <p className="text-red-500 font-mono text-xs text-center animate-pulse">{error}</p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-lime-400 text-black font-mono font-bold text-sm rounded-lg hover:bg-lime-300 active:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-widest uppercase"
          >
            {isLoading ? 'Processing...' : 'Subscribe Now — $9.99/mo'}
          </button>

          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="w-full py-2 px-6 border border-lime-400/40 text-lime-400/70 font-mono text-xs rounded-lg hover:border-lime-400/70 hover:text-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Manage Existing Subscription
          </button>
        </div>
      </div>
    </div>
  );
};
