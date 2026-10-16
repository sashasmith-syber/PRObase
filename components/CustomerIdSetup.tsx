import React, { useState } from 'react';

interface CustomerIdSetupProps {
  onActivate: (customerId: string) => void;
  onSubscribeNew: () => void;
}

export const CustomerIdSetup: React.FC<CustomerIdSetupProps> = ({ onActivate, onSubscribeNew }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleActivate = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('Please enter a valid Customer ID.');
      return;
    }
    localStorage.setItem('stripe_customer_id', trimmed);
    onActivate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleActivate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md border-2 border-lime-400/60 bg-black rounded-xl shadow-[0_0_40px_rgba(57,255,20,0.2)] p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-lime-400 font-mono tracking-widest">AIT PROfessor</h2>
          <p className="text-lime-400/60 font-mono text-sm mt-1">Activate Your Subscription</p>
        </div>

        {/* Instructions */}
        <p className="text-lime-400/80 font-mono text-xs mb-4 leading-relaxed">
          Enter your <span className="text-lime-400 font-bold">Customer ID</span> from your Stripe confirmation
          email to unlock all AI modes.
        </p>

        {/* Input */}
        <div className="space-y-3">
          <input
            type="text"
            value={inputValue}
            onChange={e => { setInputValue(e.target.value); setError(null); }}
            onKeyDown={handleKeyDown}
            placeholder="cus_xxxxxxxxxxxxxxxx"
            className="w-full bg-black border border-lime-400/40 rounded-lg px-4 py-3 font-mono text-sm text-lime-400 placeholder-lime-400/30 focus:outline-none focus:border-lime-400/80 transition-colors"
            autoFocus
          />

          {error && (
            <p className="text-red-500 font-mono text-xs animate-pulse">{error}</p>
          )}

          <button
            onClick={handleActivate}
            className="w-full py-3 px-6 bg-lime-400 text-black font-mono font-bold text-sm rounded-lg hover:bg-lime-300 active:bg-lime-500 transition-colors tracking-widest uppercase"
          >
            Activate
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-lime-400/20" />
            <span className="text-lime-400/40 font-mono text-xs">OR</span>
            <div className="flex-1 h-px bg-lime-400/20" />
          </div>

          <button
            onClick={onSubscribeNew}
            className="w-full py-2 px-6 border border-lime-400/40 text-lime-400/70 font-mono text-xs rounded-lg hover:border-lime-400/70 hover:text-lime-400 transition-colors"
          >
            I'm new — Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};
