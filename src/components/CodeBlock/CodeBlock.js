import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck, FiFile } from 'react-icons/fi';
import './CodeBlock.css';

function CodeBlock({ code, language = 'typescript', fileName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="code-block">
      <div className="code-block__header">
        <div className="code-block__info">
          {fileName && (
            <span className="code-block__file">
              <FiFile size={14} />
              {fileName}
            </span>
          )}
          <span className="code-block__lang">{language}</span>
        </div>
        <button className="code-block__copy" onClick={handleCopy} title="Copy code">
          {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        wrapLines
        customStyle={{
          margin: 0,
          borderRadius: '0 0 10px 10px',
          padding: '1.25rem',
          fontSize: '0.875rem',
          background: '#1e1e2e',
        }}
        lineNumberStyle={{
          color: '#4a4a6a',
          minWidth: '2.5em',
          paddingRight: '1em',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
