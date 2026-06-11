type PublicEnv = Record<string, string | undefined>;

export function getPublicEnv(name: string): string | undefined {
  const globalProcessEnv = (globalThis as { process?: { env?: PublicEnv } }).process?.env;

  return globalProcessEnv?.[name];
}
