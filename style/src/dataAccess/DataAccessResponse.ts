export interface DataAccessResponse<T> {
    object: T;
    message: string;
    code: Code;
}

export enum Code {
    OK = 200,
    ERROR = 500,
}
