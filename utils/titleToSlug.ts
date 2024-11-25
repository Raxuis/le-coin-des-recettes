export function slugTitle(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function slugTitleWithTimeStamp(title: string): string {
    const timestamp = Date.now();
    return slugTitle(title) + '-' + timestamp;
}
