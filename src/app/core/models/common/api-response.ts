export interface ApiResponse<T> {
    succeeded: boolean;
    errors: string[];
    messages: string[];
    isExist: boolean;
    returnId: number;
    data: T;
}
