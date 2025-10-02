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

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
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
      await UserService.exportToCSV();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">CRUD Database</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            />

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleExportCSV}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Download CSV
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
      </div>
    </div>
  );
}
