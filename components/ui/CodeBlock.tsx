import React, { useState } from 'react';
import { CopyIcon } from '../icons/CopyIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface CodeBlockProps {
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-black/70 rounded-none my-2 text-sm relative border border-electric-lime/20">
      <div className="px-4 py-2 flex justify-between items-center bg-gray-900/50 rounded-none border-b border-electric-lime/20 font-sans">
        <span className="text-lime-400 capitalize">{language}</span>
        <button
          onClick={handleCopy}
          className="text-lime-400 hover:text-white transition-colors text-xs flex items-center gap-1"
        >
          {isCopied ? (
             <>
                <CheckIcon className="h-4 w-4" />
                Copied!
             </>
          ) : (
            <>
                <CopyIcon className="h-4 w-4" />
                Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-electric-lime font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};
