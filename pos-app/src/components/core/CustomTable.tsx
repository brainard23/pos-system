import React, { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Loader2 } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => string | number | ReactNode);
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function CustomTable<T>({ columns, data, isLoading, emptyMessage = 'No data available' }: CustomTableProps<T>) {
  const renderCell = (row: T, accessor: Column<T>['accessorKey']): ReactNode => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    const value = row[accessor];
    // Convert any value to string for display
    return String(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-lg border-gray-300">
      <Table className=''>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {renderCell(row, column.accessorKey)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 