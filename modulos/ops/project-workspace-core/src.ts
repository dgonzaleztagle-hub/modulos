export interface ProjectWorkspaceData {
  clients: unknown[];
  payments: unknown[];
  notes: string;
  tasks: unknown[];
  credentials: {
    custom: unknown[];
    github?: { repoUrl: string };
    supabase?: { projectUrl: string; anonKey: string; serviceRoleKey: string };
    vercel?: { projectUrl: string; deploymentUrl: string };
  };
}

export function createEmptyProjectWorkspace(): ProjectWorkspaceData {
  return {
    clients: [],
    payments: [],
    notes: "",
    tasks: [],
    credentials: { custom: [] },
  };
}

export function normalizeProjectWorkspaceData(input?: Partial<ProjectWorkspaceData> | null): ProjectWorkspaceData {
  const base = createEmptyProjectWorkspace();
  return {
    ...base,
    ...(input || {}),
    clients: Array.isArray(input?.clients) ? input.clients : [],
    payments: Array.isArray(input?.payments) ? input.payments : [],
    tasks: Array.isArray(input?.tasks) ? input.tasks : [],
    notes: String(input?.notes || ""),
    credentials: {
      ...base.credentials,
      ...(input?.credentials || {}),
      custom: Array.isArray(input?.credentials?.custom) ? input.credentials.custom : [],
    },
  };
}

export function resolveProjectLastActivity(input: {
  createdAt: string;
  lastModified?: string | null;
}) {
  return input.lastModified || input.createdAt;
}
