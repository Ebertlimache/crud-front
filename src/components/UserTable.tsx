'use client';

import { User } from '@/types/user';

interface UserTableProps {
  readonly users: User[];
  readonly onEdit: (user: User) => void;
  readonly onDelete: (id: number) => void;
  readonly operationLoading?: string | null;
}

export default function UserTable({ users, onEdit, onDelete, operationLoading }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">First</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Last</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Location</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Hobby</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 text-sm text-gray-900 border-b">{user.id}</td>
              <td className="px-4 py-3 text-sm text-gray-900 border-b">{user.first}</td>
              <td className="px-4 py-3 text-sm text-gray-900 border-b">{user.last}</td>
              <td className="px-4 py-3 text-sm text-gray-900 border-b">{user.email}</td>
              <td className="px-4 py-3 text-sm text-gray-900 border-b">{user.phone || ''}</td>
              <td className="px-4 py-3 text-sm text-gray-900 border-b">{user.location || ''}</td>
              <td className="px-4 py-3 text-sm text-gray-900 border-b">{user.hobby || ''}</td>
              <td className="px-4 py-3 text-sm text-gray-900 border-b">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    disabled={operationLoading !== null}
                    className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {operationLoading === 'editing' && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    )}
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    disabled={operationLoading !== null}
                    className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {operationLoading === 'deleting' && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    )}
                    Del
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
