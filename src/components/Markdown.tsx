import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Markdown = ({ children }: { children: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h2: ({ children }) => (
        <h2 className="font-heading mt-10 mb-4 text-2xl font-semibold tracking-tight first:mt-0">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="font-heading mt-8 mb-3 text-xl font-semibold tracking-tight">
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
      ),
      a: ({ children, href }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground font-medium underline underline-offset-4">
          {children}
        </a>
      ),
      ul: ({ children }) => (
        <ul className="text-muted-foreground mb-4 list-disc space-y-2 pl-6">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="text-muted-foreground mb-4 list-decimal space-y-2 pl-6">
          {children}
        </ol>
      ),
      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
      strong: ({ children }) => (
        <strong className="text-foreground font-semibold">{children}</strong>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-border text-muted-foreground my-6 border-l-2 pl-4 italic">
          {children}
        </blockquote>
      ),
      code: ({ children, className }) =>
        className?.includes("language-") ?
          <code className={className}>{children}</code>
        : <code className="border-border bg-muted rounded-md border px-1.5 py-0.5 font-mono text-[0.85em]">
            {children}
          </code>,
      pre: ({ children }) => (
        <pre className="border-border bg-muted/50 mb-6 overflow-x-auto rounded-lg border p-4 font-mono text-sm leading-relaxed">
          {children}
        </pre>
      ),
      img: ({ src, alt }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={typeof src === "string" ? src : undefined}
          alt={alt ?? ""}
          loading="lazy"
          className="border-border my-6 rounded-lg border"
        />
      ),
      hr: () => <hr className="border-border my-8" />,
      table: ({ children }) => (
        <div className="border-border mb-6 overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border-border bg-muted/50 border-b px-4 py-2 text-left font-medium">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border-border border-b px-4 py-2">{children}</td>
      ),
    }}>
    {children}
  </ReactMarkdown>
);

export default Markdown;
