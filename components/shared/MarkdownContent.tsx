import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="space-y-5 text-right">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-gold mt-8 mb-3 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-gold-light mt-6 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-gold-muted leading-loose">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 pr-1">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-gold-muted leading-loose">
              <span className="text-gold mt-1.5 shrink-0">•</span>
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="text-cream font-bold">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
