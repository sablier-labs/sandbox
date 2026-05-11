/** Render a log buffer as a compact monospace console. */
export function Console({ logs }: { logs: readonly string[] }) {
  if (!logs.length) return null;
  return (
    <pre className="mt-2 max-h-48 overflow-y-auto rounded-md border-2 border-ink-300 bg-ink p-3 font-mono text-xs/relaxed wrap-break-word whitespace-pre-wrap text-mist-200">
      {logs.map((line, i) => (
        // Logs are append-only; index is a stable identity for entries that may share text.
        <div key={i}>{line}</div>
      ))}
    </pre>
  );
}
