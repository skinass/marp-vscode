/**
 * Polyfill for running elkjs (GWT-compiled) in Node.js environment.
 *
 * GWT-compiled elk.bundled.js references $wnd (window) for instanceof checks
 * like `a instanceof $wnd.Array`. In Node.js, $wnd is undefined, causing:
 * "TypeError: Right-hand side of 'instanceof' is not an object"
 *
 * This polyfill temporarily sets globalThis.window and globalThis.self
 * so the GWT code can initialize properly.
 */
export function withElkPolyfill<T>(fn: () => T): T {
  const g = globalThis as any
  const hadWindow = 'window' in g
  const hadSelf = 'self' in g
  const origWindow = g.window
  const origSelf = g.self

  if (!hadWindow) g.window = g
  if (!hadSelf) g.self = g

  try {
    return fn()
  } finally {
    if (!hadWindow) delete g.window
    else g.window = origWindow
    if (!hadSelf) delete g.self
    else g.self = origSelf
  }
}
