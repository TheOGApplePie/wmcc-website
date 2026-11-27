/** Remove Cognito's top-level envelope while retaining the form answers verbatim. */
export function cleanCognitoEntry(entry: unknown): Record<string, unknown> {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new Error('Invalid registration entry');
  }
  const cleaned = { ...entry } as Record<string, unknown>;
  for (const key of ['Id', 'Form', '$type', 'Entry', '$version']) delete cleaned[key];
  return cleaned;
}
