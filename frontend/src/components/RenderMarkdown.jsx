import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyToClipboard from "./CopyToClipboard";

const RenderMarkdown = ({ children, isBotTyping }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <h1 style={{ color: "#FFA500" }} {...props}>
            {props.children}
          </h1>
        ),
        h2: ({ node, ...props }) => (
          <h2 style={{ color: "#FFD700" }} {...props}>
            {props.children}
          </h2>
        ),
        h3: ({ node, ...props }) => (
          <h3 style={{ color: "#FFD700" }} {...props}>
            {props.children}
          </h3>
        ),
        h4: ({ node, ...props }) => (
          <h4 style={{ color: "#FFD700" }} {...props}>
            {props.children}
          </h4>
        ),
        h5: ({ node, ...props }) => (
          <h5 style={{ color: "#FFD700" }} {...props}>
            {props.children}
          </h5>
        ),
        h6: ({ node, ...props }) => (
          <h6 style={{ color: "#FFD700" }} {...props}>
            {props.children}
          </h6>
        ),
        strong: ({ node, ...props }) => (
          <strong style={{ fontWeight: "bold" }} {...props}>
            {props.children}
          </strong>
        ),
        em: ({ node, ...props }) => (
          <em style={{ fontStyle: "italic" }} {...props}>
            {props.children}
          </em>
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            style={{
              borderLeft: "4px solid #FFA500",
              paddingLeft: "10px",
              color: "#AAA",
            }}
            {...props}
          >
            {props.children}
          </blockquote>
        ),
        ol: ({ node, ...props }) => (
          <ol style={{ paddingLeft: "20px", listStyle: "decimal" }} {...props}>
            {props.children}
          </ol>
        ),
        ul: ({ node, ...props }) => (
          <ul style={{ paddingLeft: "20px", listStyle: "circle" }} {...props}>
            {props.children}
          </ul>
        ),
        li: ({ node, ...props }) => <li {...props}>{props.children}</li>,
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <div className="relative bg-[#333333] rounded-2xl">
              <div className="flex justify-between items-center pt-1 pl-3 pr-3">
                <span className="text-sm mt-2 text-gray-300">{match[1]}</span>
                <div className="h-7">
                  <CopyToClipboard
                    text={String(children).replace(/\n$/, "")}
                    isBotTyping={isBotTyping}
                  />
                </div>
              </div>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                codeTagProps={{ style: { fontSize: "0.9rem" } }}
                customStyle={{
                  overflowX: "auto",
                  background: "black",
                  borderRadius: "0 0 1rem 1rem",
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              className={className}
              style={{
                background: "#1E1E1E",
                padding: "0.2em 0.4em",
                borderRadius: "0.3em",
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default RenderMarkdown;
