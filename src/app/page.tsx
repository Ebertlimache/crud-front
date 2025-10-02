'use client';

import { useState, useEffect } from 'react';
import { User, CreateUserData } from '@/types/user';
import { UserService } from '@/services/api';
import UserTable from '@/components/UserTable';
import UserForm from '@/components/UserForm';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setOperationLoading('searching');
      }
      loadUsers(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadUsers = async (search?: string) => {
    try {
      setLoading(true);
      const userData = await UserService.getUsers(search);
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error loading users. Please check if the backend is running.');
    } finally {
      setLoading(false);
      setOperationLoading(null);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsAddMode(false);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsAddMode(true);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setIsAddMode(false);
  };

  const handleSave = async (userData: CreateUserData) => {
    try {
      setOperationLoading(isAddMode ? 'adding' : 'editing');
      
      if (isAddMode) {
        await UserService.createUser(userData);
      } else if (editingUser) {
        await UserService.updateUser(editingUser.id, userData);
      }
      
      // Reload users after save
      await loadUsers(searchTerm);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.');
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setOperationLoading('deleting');
        await UserService.deleteUser(id);
        await loadUsers(searchTerm);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      setOperationLoading('exporting');
      await UserService.exportToCSV();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV. Please try again.');
    } finally {
      setOperationLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">CRUD Database</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
            />
            {operationLoading === 'searching' && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading users...</div>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <>
            <UserTable 
              users={users} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              operationLoading={operationLoading}
            />

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleExportCSV}
                disabled={operationLoading === 'exporting'}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {operationLoading === 'exporting' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {operationLoading === 'exporting' ? 'Exporting...' : 'Download CSV'}
              </button>
              <button
                onClick={handleAdd}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Add Item
              </button>
            </div>
          </>
        )}

        {/* User Form Modal */}
        <UserForm
          user={editingUser}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSave}
          title={isAddMode ? 'Add New User' : 'Edit User'}
        />

        {/* Global Loading Overlay */}
        {(operationLoading === 'adding' || operationLoading === 'editing' || operationLoading === 'deleting') && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-700">
                {operationLoading === 'adding' && 'Adding user...'}
                {operationLoading === 'editing' && 'Updating user...'}
                {operationLoading === 'deleting' && 'Deleting user...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
