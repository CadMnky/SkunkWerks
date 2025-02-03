import React from 'react';
import { FeeScheduleEntry } from '../types';

interface DataTableProps {
  data: FeeScheduleEntry | null;
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {key}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {value.toString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};