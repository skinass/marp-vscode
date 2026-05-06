import { renderMermaidSVG, type RenderOptions } from 'beautiful-mermaid'
import { withElkPolyfill } from './elk-polyfill'

const mermaidOptions: RenderOptions = {
  bg: 'transparent',
  transparent: true,
  fg: '#27272A',
  font: 'Manrope',
  padding: 20,
}

/**
 * Preprocess markdown: replace ```mermaid fenced code blocks
 * with inline SVG rendered by beautiful-mermaid.
 *
 * This is needed for the export pipeline (Marp CLI) which doesn't
 * run markdown-it plugins from the VS Code extension.
 */
export function preprocessMermaidInMarkdown(markdown: string): string {
  const mermaidFenceRegex = /```mermaid\s*\n([\s\S]*?)```/g

  return markdown.replace(mermaidFenceRegex, (_, code: string) => {
    try {
      const svg = withElkPolyfill(() =>
        renderMermaidSVG(code.trim(), mermaidOptions),
      )
      return `<div class="mermaid-diagram" style="text-align:center;">${svg}</div>`
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      return `<pre style="color:red;"><code>Mermaid render error: ${msg}</code></pre>`
    }
  })
}
