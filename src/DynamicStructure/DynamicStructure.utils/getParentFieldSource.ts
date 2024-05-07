export function getParentFieldSource(currentSource: string) {
    return currentSource.split('.').slice(0, -1).join('.');
}
