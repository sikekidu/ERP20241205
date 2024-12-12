export {};

declare global {
  interface FetchTableDataResponse {
    data: Record<string, unknown>[];
  }

  export const fetchTableData: (tableName: string) => Promise<Record<string, unknown>[]>;
  export const uploadTableData: (tableName: string, file: File) => Promise<void>;
}
