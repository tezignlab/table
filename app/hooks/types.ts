export type TPage<T> = {
    has_more: boolean;
    limit: number;
    skip: number;
    total: number;
    data: T[];
}

export type TFile = {
    id: string;
    content_type: string;
    url: string;
    thumbnail: string;
}

export function EmptyPage(skip: number, limit: number) {
    return {
        has_more: false,
        limit,
        data: [],
        skip,
        total: 0,
    }
}