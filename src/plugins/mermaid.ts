import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import { renderMermaidSVG } from 'beautiful-mermaid'
import { withElkPolyfill } from './elk-polyfill'

const mermaidLang = 'mermaid'

export default function mermaidPlugin(md: MarkdownIt): void {
  const defaultFenceRenderer = md.renderer.rules.fence

  md.renderer.rules.fence = (
    tokens: Token[],
    idx: number,
    options: any,
    env: any,
    self: any,
  ) => {
    const token = tokens[idx]
    const info = token.info?.trim()

    if (info === mermaidLang) {
      try {
        const svg = withElkPolyfill(() =>
          renderMermaidSVG(token.content, {
            bg: 'transparent',
            transparent: true,
            fg: '#27272A',
            font: 'Manrope',
            padding: 20,
          }),
        )
        return `<div class="mermaid-diagram" style="text-align:center;">${svg}</div>`
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        return `<pre style="color:red;font-size:14px;"><code>Mermaid render error: ${msg}</code></pre>`
      }
    }

    return defaultFenceRenderer
      ? defaultFenceRenderer(tokens, idx, options, env, self)
      : ''
  }
}
