import { User, CreateUserData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class UserService {
  static async getUsers(search?: string): Promise<User[]> {
    const url = search ? `${API_BASE_URL}/users?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/users`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  }

  static async updateUser(id: number, userData: CreateUserData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  }

  static async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }

  static async exportToCSV(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users for export');
    }
    
    const users = await response.json();
    
    // Create CSV content
    const headers = ['ID', 'First', 'Last', 'Email', 'Phone', 'Location', 'Hobby'];
    const csvContent = [
      headers.join(','),
      ...users.map((user: User) => [
        user.id,
        user.first,
        user.last,
        user.email,
        user.phone || '',
        user.location || '',
        user.hobby || ''
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'users.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}


