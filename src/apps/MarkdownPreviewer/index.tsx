"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

const defaultMarkdown = `# Welcome to Markdown Previewer

## Features
- **Bold text**
- *Italic text*
- \`Inline code\`

### Code Block
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

### Lists
1. First item
2. Second item
   - Nested item
   - Another nested item

### Links
[GitHub](https://github.com)

### Blockquote
> This is a blockquote example.

---

Happy writing! 📝
`;

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  return (
    <div className="h-full flex">
      {/* Editor */}
      <div className="w-1/2 border-r border-slate-200">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700">Editor</h2>
        </div>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-full p-4 resize-none border-none outline-none font-mono text-sm"
          placeholder="Type your markdown here..."
          style={{ height: 'calc(100% - 60px)' }}
        />
      </div>

      {/* Preview */}
      <div className="w-1/2">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700">Preview</h2>
        </div>
        <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
