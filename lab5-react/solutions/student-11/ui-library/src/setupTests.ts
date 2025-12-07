import '@testing-library/jest-dom'

// Suppress ReactDOMTestUtils.act deprecation warning emitted by some
// versions of testing-library / react-dom internals. Tests should be
// clean of warnings; filter that specific message here.
const originalError = console.error
console.error = (...args: unknown[]) => {
  try {
    const msg = String(args[0])
    if (msg.includes('ReactDOMTestUtils.act') && msg.includes('deprecated')) {
      return
    }
  } catch {
    // ignore
  }
  return originalError.apply(console, args as [unknown?, ...unknown[]])
}
