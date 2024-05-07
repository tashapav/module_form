export function getSourcePath(fieldName: string, sourcePath?: string) {
    const sanitizedSourcePath = sourcePath?.startsWith('.') ? sourcePath.slice(1) : sourcePath;

    const source = sanitizedSourcePath ? `${sanitizedSourcePath}.` : '';
    return `${source}${fieldName}`;
}
