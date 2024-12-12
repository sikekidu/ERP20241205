export {};

declare global {
  interface Column<T> {
    header: string;
    accessor: keyof T;
    render?: (value: unknown, item: T) => React.ReactNode;
  }

  interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
  }

  const DataTable: <T>(props: DataTableProps<T>) => JSX.Element;
}
