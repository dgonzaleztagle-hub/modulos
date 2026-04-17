export interface SnapshotTarget {
  id: string;
  name?: string;
  slug?: string;
  subdomain?: string;
  email?: string;
  status?: string;
}

export function chunkValues<T>(values: T[], chunkSize = 100): T[][] {
  const output: T[][] = [];
  for (let index = 0; index < values.length; index += chunkSize) {
    output.push(values.slice(index, index + chunkSize));
  }
  return output;
}

export function dedupeRowsById<T extends { id?: string | number | null }>(rows: T[]): T[] {
  const map = new Map<string | number, T>();
  for (const row of rows) {
    if (row.id == null) continue;
    map.set(row.id, row);
  }
  return map.size ? [...map.values()] : rows;
}

export function buildSnapshotCounts(tableData: Record<string, unknown[]>) {
  return Object.fromEntries(Object.entries(tableData).map(([table, rows]) => [table, rows.length]));
}

export function matchTargetsByTerms<T extends SnapshotTarget>(targets: T[], terms: string[]): T[] {
  return targets.filter((target) => {
    const candidate = `${target.slug || ""} ${target.subdomain || ""} ${target.name || ""}`.toLowerCase();
    return terms.some((term) => candidate.includes(term.toLowerCase()));
  });
}

export function buildSnapshotManifest(input: {
  startedAt: string;
  finishedAt: string;
  targets: SnapshotTarget[];
  tableData: Record<string, unknown[]>;
  tableErrors?: Record<string, string>;
}) {
  return {
    startedAt: input.startedAt,
    finishedAt: input.finishedAt,
    targetResellers: input.targets,
    counts: buildSnapshotCounts(input.tableData),
    tableErrors: input.tableErrors ?? {},
  };
}

export function renderSnapshotSummary(input: {
  startedAt: string;
  finishedAt: string;
  targets: SnapshotTarget[];
  counts: Record<string, number>;
  tableErrors?: Record<string, string>;
}) {
  const lines: string[] = [];
  lines.push("# Snapshot");
  lines.push(`- Started: ${input.startedAt}`);
  lines.push(`- Finished: ${input.finishedAt}`);
  lines.push("- Targets:");
  for (const target of input.targets) {
    lines.push(`  - id=${target.id} name=${target.name || ""} slug=${target.slug || ""} subdomain=${target.subdomain || ""} status=${target.status || ""}`);
  }
  lines.push("");
  lines.push("## Conteos por tabla");
  for (const [table, count] of Object.entries(input.counts).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`- ${table}: ${count}`);
  }
  if (input.tableErrors && Object.keys(input.tableErrors).length) {
    lines.push("");
    lines.push("## Tablas con error");
    for (const [table, message] of Object.entries(input.tableErrors)) {
      lines.push(`- ${table}: ${message}`);
    }
  }
  return lines.join("\n");
}
