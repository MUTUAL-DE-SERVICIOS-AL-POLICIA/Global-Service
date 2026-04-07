export type NamedRecord = {
  name: string;
};

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function findByExactName<T extends NamedRecord>(
  rows: T[],
  name: string,
): T | undefined {
  const normalizedName = normalizeText(name);

  return rows.find((row) => normalizeText(row.name) === normalizedName);
}

export function buildSeederError(
  seederName: string,
  error: unknown,
): Error {
  if (error instanceof Error) {
    return new Error(`[${seederName}] ${error.message}`);
  }

  return new Error(`[${seederName}] Unexpected error: ${String(error)}`);
}
