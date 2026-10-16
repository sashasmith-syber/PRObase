import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyIcon } from '../icons/CopyIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface CodeBlockProps {
  language: string;
  code: string;
}

/**
 * @param props - Code block props.
 * @returns Rendered code block.
 */
export const CodeBlock = ({ language, code }: CodeBlockProps): JSX.Element => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (): void => {
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
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, background: 'transparent' }}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
