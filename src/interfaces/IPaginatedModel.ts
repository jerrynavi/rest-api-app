export interface IPaginatedModel {
    results: any[];
    cursors: {
        before: string;
        after: string;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}
