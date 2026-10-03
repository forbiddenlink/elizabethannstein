// Captured from AutomaDocs' public API: GET https://api.automadocs.com/api/public/repo/erikgrinaker/toydb
// (no auth, read-only). The doc text is copied verbatim from the response; the source excerpt is
// toydb's own code at the commit AutomaDocs documented (Apache-2.0, credited in the panel).
// Regenerate from the API rather than editing values.

export const AUTOMADOCS_SOURCE = {
  endpoint: 'https://api.automadocs.com/api/public/repo/erikgrinaker/toydb',
  capturedAt: '2026-10-03',
  live: 'https://automadocs.com',
} as const

export interface AutomaDocsCapture {
  repo: string
  repoUrl: string
  license: string
  sourceCommit: string
  language: string
  /** AutomaDocs' own status for the repo; "partial" means not every file is documented yet */
  status: string
  totalDocs: number
  byType: { function: number; class: number; architecture: number; readme: number }
  file: string
  lines: [number, number]
  /** length of the documented function body, which decides the model tier */
  functionLines: number
  source: string
  docPath: string
  generatedAt: string
  doc: string
}

export const AUTOMADOCS_CAPTURE: AutomaDocsCapture = {
  repo: 'erikgrinaker/toydb',
  repoUrl: 'https://github.com/erikgrinaker/toydb',
  license: 'Apache-2.0',
  sourceCommit: '2d7cd32',
  language: 'Rust',
  status: 'partial',
  totalDocs: 1081,
  byType: {
    function: 647,
    class: 432,
    architecture: 1,
    readme: 1,
  },
  file: 'src/storage/mvcc.rs',
  lines: [466, 485],
  functionLines: 14,
  source:
    '/// Commits the transaction, by removing it from the active set. This will\n/// immediately make its writes visible to subsequent transactions. Also\n/// removes its TxnWrite records, which are no longer needed.\n///\n/// NB: commit does not flush writes to durable storage, since we rely on\n/// the Raft log for persistence.\npub fn commit(self) -> Result<()> {\n    if self.state.read_only {\n        return Ok(());\n    }\n    let mut engine = self.engine.lock()?;\n    let remove: Vec<_> = engine\n        .scan_prefix(&KeyPrefix::TxnWrite(self.state.version).encode())\n        .map_ok(|(k, _)| k)\n        .try_collect()?;\n    for key in remove {\n        engine.delete(&key)?\n    }\n    engine.delete(&Key::TxnActive(self.state.version).encode())\n}',
  docPath: 'functions/src_storage_mvcc.rs_commit_472.md',
  generatedAt: '2026-10-03T05:36:08.973Z',
  doc: "# `commit` Function Documentation\n\n## Description\nThe `commit` function is responsible for finalizing a transaction by removing it from the active set. This action makes the transaction's writes visible to subsequent transactions. Additionally, it cleans up any associated `TxnWrite` records that are no longer necessary. It is important to note that this function does not flush writes to durable storage, as persistence is managed through the Raft log.\n\n## Parameters\n- `self`: The instance of the transaction being committed. It is consumed by the function.\n\n## Returns\n- `Result<()>`: Returns an `Ok(())` if the transaction is successfully committed. If an error occurs during the process, it returns an `Err` variant containing the error details.\n\n## Throws\n- This function may throw errors related to:\n  - Lock acquisition on the engine (`self.engine.lock()?`).\n  - Errors during the scanning of transaction write keys (`engine.scan_prefix(...)`).\n  - Errors during the deletion of keys from the engine (`engine.delete(...)`).\n\n## Example\n```rust\nfn main() -> Result<()> {\n    let transaction = Transaction::new(); // Assume Transaction is defined elsewhere\n    // Perform operations on the transaction\n    transaction.commit()?;\n    Ok(())\n}\n```\n\n## Notes\n- The function checks if the transaction is in a read-only state (`self.state.read_only`). If it is, the function will return early without making any changes.\n- The function utilizes a lock on the engine to ensure thread safety while accessing and modifying the state.\n- The cleanup process involves scanning for all keys associated with the transaction's writes and deleting them, followed by the removal of the transaction from the active set.\n- Ensure that the transaction is not in a read-only state before calling this function to avoid unnecessary operations.",
}
