/** Ensures empty form controls produce API-safe primitive defaults. */
export function applyAssetPayloadDefaults(
    payload: object,
    formValues: Record<string, unknown>,
    numberFields: string[],
    booleanFields: string[],
    dateFields: string[]
): void {
    const target = payload as Record<string, unknown>;
    for (const field of numberFields) target[field] = formValues[field] ?? 0;
    for (const field of booleanFields) target[field] = formValues[field] ?? false;
    for (const field of dateFields) target[field] = formValues[field] ?? null;
}
