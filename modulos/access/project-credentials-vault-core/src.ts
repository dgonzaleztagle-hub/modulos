export interface CustomCredential {
  id: string;
  name: string;
  value: string;
  isSecret: boolean;
}

export interface ProjectCredentialsVault {
  github?: {
    repoUrl: string;
  };
  supabase?: {
    projectUrl: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  vercel?: {
    projectUrl: string;
    deploymentUrl: string;
  };
  custom: CustomCredential[];
}

export function createEmptyProjectCredentialsVault(): ProjectCredentialsVault {
  return {
    custom: [],
  };
}

export function upsertProjectCredentialsVault(
  current?: ProjectCredentialsVault | null,
  patch?: Partial<ProjectCredentialsVault> | null,
): ProjectCredentialsVault {
  return {
    ...createEmptyProjectCredentialsVault(),
    ...(current || {}),
    ...(patch || {}),
    custom: Array.isArray(patch?.custom)
      ? patch.custom
      : Array.isArray(current?.custom)
        ? current.custom
        : [],
  };
}

export function addCustomCredential(vault: ProjectCredentialsVault, credential: CustomCredential) {
  return {
    ...vault,
    custom: [...vault.custom, credential],
  };
}

export function updateCustomCredential(
  vault: ProjectCredentialsVault,
  id: string,
  patch: Partial<CustomCredential>,
) {
  return {
    ...vault,
    custom: vault.custom.map((item) => (item.id === id ? { ...item, ...patch } : item)),
  };
}

export function removeCustomCredential(vault: ProjectCredentialsVault, id: string) {
  return {
    ...vault,
    custom: vault.custom.filter((item) => item.id !== id),
  };
}
