"use client"

import type { ReactNode } from "react"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Enhanced markdown parser for technical content
  const parseMarkdown = (text: string): ReactNode[] => {
    const lines = text.split("\n")
    const elements: ReactNode[] = []
    let currentParagraph: string[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    let codeLanguage = ""
    let inList = false
    let listItems: string[] = []
    let listType: "ul" | "ol" = "ul"
    let inTable = false
    let tableHeaders: string[] = []
    let tableRows: string[][] = []
    let inTaskList = false
    let taskListItems: { text: string; checked: boolean }[] = []

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(" ")
        elements.push(
          <p key={elements.length} className="mb-6 leading-relaxed text-foreground">
            {parseInlineMarkdown(paragraphText)}
          </p>,
        )
        currentParagraph = []
      }
    }

    const flushList = () => {
      if (listItems.length > 0) {
        const ListComponent = listType === "ol" ? "ol" : "ul"
        elements.push(
          <ListComponent key={elements.length} className={`mb-6 space-y-2 ${listType === "ol" ? "list-decimal" : "list-disc"} list-inside`}>
            {listItems.map((item, index) => (
              <li key={index} className="text-foreground leading-relaxed pl-2">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ListComponent>
        )
        listItems = []
        inList = false
      }
    }

    const flushTable = () => {
      if (tableHeaders.length > 0 || tableRows.length > 0) {
        elements.push(
          <div key={elements.length} className="mb-8 overflow-x-auto">
            <table className="w-full border-collapse bg-muted/20 rounded-lg overflow-hidden border border-border/30">
              {tableHeaders.length > 0 && (
                <thead>
                  <tr className="bg-muted/50">
                    {tableHeaders.map((header, index) => (
                      <th key={index} className="border border-border/30 px-4 py-3 text-left font-semibold text-foreground">
                        {parseInlineMarkdown(header.trim())}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              {tableRows.length > 0 && (
                <tbody>
                  {tableRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-border/30 px-4 py-3 text-foreground">
                          {parseInlineMarkdown(cell.trim())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )
        tableHeaders = []
        tableRows = []
        inTable = false
      }
    }

    const flushTaskList = () => {
      if (taskListItems.length > 0) {
        elements.push(
          <div key={elements.length} className="mb-6 space-y-3">
            {taskListItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
                  item.checked 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-border bg-background'
                }`}>
                  {item.checked && (
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className={`text-foreground leading-relaxed ${item.checked ? 'line-through opacity-70' : ''}`}>
                  {parseInlineMarkdown(item.text)}
                </div>
              </div>
            ))}
          </div>
        )
        taskListItems = []
        inTaskList = false
      }
    }

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End code block
          flushList()
          flushTaskList()
          const codeContent = codeBlockContent.join("\n")
          elements.push(
            <div key={elements.length} className="mb-8 group">
              <div className="bg-muted/50 border border-border/50 rounded-t-lg px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-mono">
                  {codeLanguage || "code"}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(codeContent)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded border border-primary/20 hover:border-primary/30"
                  title="Copy code"
                >
                  Copy
                </button>
              </div>
              <pre className="bg-gradient-to-br from-muted/80 to-muted/60 border border-t-0 border-border/50 rounded-b-lg p-4 overflow-x-auto">
                <code className={`language-${codeLanguage} text-sm font-mono text-foreground block leading-relaxed`}>
                  {codeContent}
                </code>
              </pre>
            </div>,
          )
          codeBlockContent = []
          inCodeBlock = false
          codeLanguage = ""
        } else {
          // Start code block
          flushParagraph()
          flushList()
          flushTaskList()
          inCodeBlock = true
          codeLanguage = line.slice(3).trim() || "text"
        }
        return
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }

      // Horizontal rules
      if (line.trim().match(/^-{3,}$|^\*{3,}$|^_{3,}$/)) {
        flushParagraph()
        flushList()
        flushTaskList()
        flushTable()
        elements.push(
          <hr key={elements.length} className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        )
        return
      }

      // Task lists
      if (line.match(/^\s*[-*+]\s+\[([ x])\]\s+/)) {
        const match = line.match(/^\s*[-*+]\s+\[([x ])\]\s+(.*)/)
        if (match) {
          if (!inTaskList) {
            flushParagraph()
            flushList()
            flushTable()
            inTaskList = true
          }
          taskListItems.push({
            checked: match[1].toLowerCase() === 'x',
            text: match[2]
          })
          return
        }
      } else if (inTaskList && !line.match(/^\s*[-*+]\s+\[/)) {
        flushTaskList()
      }

      // Tables
      if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const cells = line.split('|').slice(1, -1).map(cell => cell.trim())
        
        if (!inTable) {
          flushParagraph()
          flushList()
          flushTaskList()
          inTable = true
          tableHeaders = cells
          return
        } else {
          // Check if this is a separator line (like |---|---|)
          if (cells.every(cell => cell.match(/^-+$/))) {
            return // Skip separator lines
          }
          tableRows.push(cells)
          return
        }
      } else if (inTable) {
        flushTable()
      }

      // Lists
      if (line.match(/^\s*[-*+]\s+/)) {
        if (!inList) {
          flushParagraph()
          flushTaskList()
          flushTable()
          inList = true
          listType = "ul"
        }
        listItems.push(line.replace(/^\s*[-*+]\s+/, ""))
        return
      } else if (line.match(/^\s*\d+\.\s+/)) {
        if (!inList) {
          flushParagraph()
          flushTaskList()
          flushTable()
          inList = true
          listType = "ol"
        }
        listItems.push(line.replace(/^\s*\d+\.\s+/, ""))
        return
      } else if (inList && line.trim() === "") {
        // Continue list on empty lines
        return
      } else if (inList) {
        flushList()
      }

      // Headers
      if (line.startsWith("# ")) {
        flushParagraph()
        flushList()
        flushTaskList()
        flushTable()
        elements.push(
          <h1 key={elements.length} className="text-3xl font-bold mb-6 mt-8 text-foreground border-b border-border/30 pb-2">
            {parseInlineMarkdown(line.slice(2))}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        flushParagraph()
        flushList()
        flushTaskList()
        flushTable()
        elements.push(
          <h2 key={elements.length} className="text-2xl font-semibold mb-4 mt-8 text-foreground">
            {parseInlineMarkdown(line.slice(3))}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        flushParagraph()
        flushList()
        flushTaskList()
        flushTable()
        elements.push(
          <h3 key={elements.length} className="text-xl font-medium mb-3 mt-6 text-foreground">
            {parseInlineMarkdown(line.slice(4))}
          </h3>,
        )
      } else if (line.startsWith("#### ")) {
        flushParagraph()
        flushList()
        flushTaskList()
        flushTable()
        elements.push(
          <h4 key={elements.length} className="text-lg font-medium mb-2 mt-4 text-foreground">
            {parseInlineMarkdown(line.slice(5))}
          </h4>,
        )
      } else if (line.startsWith("> ")) {
        // Blockquotes
        flushParagraph()
        flushList()
        flushTaskList()
        flushTable()
        elements.push(
          <blockquote key={elements.length} className="border-l-4 border-primary/50 pl-4 py-2 mb-6 bg-muted/30 rounded-r-lg italic text-muted-foreground">
            {parseInlineMarkdown(line.slice(2))}
          </blockquote>,
        )
      } else if (line.trim() === "") {
        flushParagraph()
        flushList()
        flushTaskList()
        flushTable()
      } else {
        currentParagraph.push(line)
      }
    })

    flushParagraph()
    flushList()
    flushTaskList()
    flushTable()
    return elements
  }

  const parseInlineMarkdown = (text: string): ReactNode[] => {
    const parts: ReactNode[] = []
    let currentText = text

    // Images
    currentText = currentText.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
      parts.push(
        <div key={parts.length} className="my-6">
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full h-auto rounded-lg border border-border/30 shadow-sm"
          />
          {alt && (
            <p className="text-center text-sm text-muted-foreground mt-2 italic">
              {alt}
            </p>
          )}
        </div>
      )
      return `__IMAGE_${parts.length - 1}__`
    })

    // Keyboard shortcuts
    currentText = currentText.replace(/<kbd>([^<]+)<\/kbd>/g, (_, content) => {
      parts.push(
        <kbd key={parts.length} className="px-2 py-1 bg-muted border border-border rounded text-sm font-mono shadow-sm">
          {content}
        </kbd>
      )
      return `__KBD_${parts.length - 1}__`
    })

    // Callout boxes
    currentText = currentText.replace(/:::(\w+)\s*([\s\S]*?)\s*:::/g, (_, type, content) => {
      const calloutStyles = {
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
        warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200',
        error: 'border-red-500/30 bg-red-500/10 text-red-200',
        success: 'border-green-500/30 bg-green-500/10 text-green-200',
        tip: 'border-purple-500/30 bg-purple-500/10 text-purple-200'
      }
      const style = calloutStyles[type as keyof typeof calloutStyles] || calloutStyles.info
      
      parts.push(
        <div key={parts.length} className={`my-4 p-4 rounded-lg border ${style}`}>
          <div className="font-semibold mb-2 capitalize">{type}</div>
          <div>{content.trim()}</div>
        </div>
      )
      return `__CALLOUT_${parts.length - 1}__`
    })

    // Math expressions (LaTeX style)
    currentText = currentText.replace(/\$\$(.*?)\$\$/g, (_, content) => {
      parts.push(
        <div key={parts.length} className="my-4 p-4 bg-muted/20 rounded-lg border border-border/30 font-mono text-center">
          {content}
        </div>
      )
      return `__MATH_BLOCK_${parts.length - 1}__`
    })

    currentText = currentText.replace(/\$(.*?)\$/g, (_, content) => {
      parts.push(
        <span key={parts.length} className="font-mono bg-muted/30 px-1 py-0.5 rounded text-sm">
          {content}
        </span>
      )
      return `__MATH_INLINE_${parts.length - 1}__`
    })

    // Links
    currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      parts.push(
        <a
          key={parts.length}
          href={url}
          target={url.startsWith('http') ? '_blank' : undefined}
          rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors"
        >
          {text}
        </a>
      )
      return `__LINK_${parts.length - 1}__`
    })

    // Bold text
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (_, content) => {
      parts.push(<strong key={parts.length} className="font-semibold text-foreground">{content}</strong>)
      return `__BOLD_${parts.length - 1}__`
    })

    // Italic text
    currentText = currentText.replace(/\*(.*?)\*/g, (_, content) => {
      parts.push(<em key={parts.length} className="italic">{content}</em>)
      return `__ITALIC_${parts.length - 1}__`
    })

    // Inline code
    currentText = currentText.replace(/`([^`]+)`/g, (_, content) => {
      parts.push(
        <code key={parts.length} className="bg-muted/50 text-foreground px-2 py-1 rounded text-sm font-mono border border-border/30">
          {content}
        </code>,
      )
      return `__CODE_${parts.length - 1}__`
    })

    // Strikethrough
    currentText = currentText.replace(/~~(.*?)~~/g, (_, content) => {
      parts.push(<del key={parts.length} className="line-through opacity-70">{content}</del>)
      return `__STRIKE_${parts.length - 1}__`
    })

    // Highlight/Mark
    currentText = currentText.replace(/==(.*?)==/g, (_, content) => {
      parts.push(
        <mark key={parts.length} className="bg-yellow-200/30 text-foreground px-1 rounded">
          {content}
        </mark>
      )
      return `__MARK_${parts.length - 1}__`
    })

    // Split by placeholders and reconstruct
    const finalParts: ReactNode[] = []
    const textParts = currentText.split(/(__(?:IMAGE|KBD|CALLOUT|MATH_BLOCK|MATH_INLINE|LINK|BOLD|ITALIC|CODE|STRIKE|MARK)_\d+__)/)

    textParts.forEach((part, index) => {
      if (part.startsWith("__IMAGE_")) {
        const partIndex = Number.parseInt(part.match(/__IMAGE_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__KBD_")) {
        const partIndex = Number.parseInt(part.match(/__KBD_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__CALLOUT_")) {
        const partIndex = Number.parseInt(part.match(/__CALLOUT_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__MATH_BLOCK_")) {
        const partIndex = Number.parseInt(part.match(/__MATH_BLOCK_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__MATH_INLINE_")) {
        const partIndex = Number.parseInt(part.match(/__MATH_INLINE_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__LINK_")) {
        const partIndex = Number.parseInt(part.match(/__LINK_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__BOLD_")) {
        const partIndex = Number.parseInt(part.match(/__BOLD_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__ITALIC_")) {
        const partIndex = Number.parseInt(part.match(/__ITALIC_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__CODE_")) {
        const partIndex = Number.parseInt(part.match(/__CODE_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__STRIKE_")) {
        const partIndex = Number.parseInt(part.match(/__STRIKE_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part.startsWith("__MARK_")) {
        const partIndex = Number.parseInt(part.match(/__MARK_(\d+)__/)?.[1] || "0")
        finalParts.push(parts[partIndex])
      } else if (part) {
        finalParts.push(<span key={`text-${index}`}>{part}</span>)
      }
    })

    return finalParts
  }

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <div className="space-y-4">
        {parseMarkdown(content)}
      </div>
    </div>
  )
}
