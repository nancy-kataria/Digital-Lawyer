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
      {/* Formatting for AI responses */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1 className="text-lg font-bold mb-3 mt-2 first:mt-0" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-sm font-medium mb-2 mt-2 first:mt-0" {...props} />
          ),
          h4: (props) => (
            <h4 className="text-sm font-medium mb-1 mt-2 first:mt-0" {...props} />
          ),
          
          p: (props) => (
            <p className="text-gray-700 mb-3 leading-relaxed" {...props} />
          ),
          
          ul: (props) => (
            <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />
          ),
          li: (props) => (
            <li className="text-gray-700 leading-relaxed" {...props} />
          ),
        
          strong: (props) => (
            <strong className="font-semibold text-gray-900" {...props} />
          ),
          em: (props) => (
            <em className="italic text-gray-800" {...props} />
          ),
          
          code: ({ ...props }) => {
            // Type assertion to access the inline property safely
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const codeProps = props as any;
            if (codeProps.inline) {
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
          pre: (props) => (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
          ),
          
          a: (props) => (
            <a 
              className="text-blue-600 hover:text-blue-800 underline" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          
          blockquote: (props) => (
            <blockquote 
              className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2" 
              {...props} 
            />
          ),
          
          table: (props) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          th: (props) => (
            <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold" {...props} />
          ),
          td: (props) => (
            <td className="border border-gray-300 px-3 py-2" {...props} />
          ),
          
          hr: (props) => (
            <hr className="my-6 border-gray-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
