import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface AIResponseProps {
  content: string;
  className?: string;
}

export function AIResponse({ content, className }: AIResponseProps) {
  return (
    <div className={cn("max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings - optimized for chat bubbles
          h1: ({ node, ...props }) => (
            <h1 className="text-lg font-bold mb-3 mt-2 first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-sm font-medium mb-2 mt-2 first:mt-0" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm font-medium mb-1 mt-2 first:mt-0" {...props} />
          ),
          
          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-gray-700 mb-3 leading-relaxed" {...props} />
          ),
          
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-700 leading-relaxed" {...props} />
          ),
          
          // Text formatting
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-gray-900" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-gray-800" {...props} />
          ),
          
          // Code
          code: ({ node, inline, ...props }) => {
            if (inline) {
              return (
                <code 
                  className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" 
                  {...props} 
                />
              );
            }
            return (
              <code 
                className="block bg-gray-100 text-gray-800 p-3 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap" 
                {...props} 
              />
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
          ),
          
          // Links
          a: ({ node, ...props }) => (
            <a 
              className="text-blue-600 hover:text-blue-800 underline" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2" 
              {...props} 
            />
          ),
          
          // Tables (if needed)
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-3 py-2" {...props} />
          ),
          
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-gray-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
