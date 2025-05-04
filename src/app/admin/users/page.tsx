// src/app/admin/users/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  /* Filter, */ 
  Plus, 
  ChevronDown, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Check,
  X,
  User,
  Mail,
  Lock
} from 'lucide-react';
import { User as UserType } from '@/lib/types';

// Mock user data
const mockUsers: UserType[] = [
  {
    id: 1,
    name: 'Jane Cooper',
    email: 'jane@example.com',
    role: 'user',
    avatar: 'JC'
  },
  {
    id: 2,
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'user',
    avatar: 'RJ'
  },
  {
    id: 3,
    name: 'Michael Williams',
    email: 'michael@example.com',
    role: 'user',
    avatar: 'MW'
  },
  {
    id: 4,
    name: 'Sarah Davis',
    email: 'sarah@example.com',
    role: 'user',
    avatar: 'SD'
  },
  {
    id: 5,
    name: 'Alex Morgan',
    email: 'alex@waosongs.com',
    role: 'artist',
    avatar: 'AM'
  },
  {
    id: 6,
    name: 'Maria Kim',
    email: 'maria@waosongs.com',
    role: 'artist',
    avatar: 'MK'
  },
  {
    id: 7,
    name: 'Admin User',
    email: 'admin@waosongs.com',
    role: 'admin',
    avatar: 'AU'
  }
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  
  const router = useRouter();
  
  // Filtered users based on search and role filter
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  const handleAddUser = () => {
    setIsAddingUser(true);
    setSelectedUser(null);
    setIsEditingUser(false);
  };
  
  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setIsEditingUser(true);
    setIsAddingUser(false);
  };
  
  const handleDeleteUser = (userId: number) => {
    // In a real app, you would call an API to delete the user
    // For now, just log it
    console.log(`Delete user with ID: ${userId}`);
  };
  
  const handleCancel = () => {
    setIsAddingUser(false);
    setIsEditingUser(false);
    setSelectedUser(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call an API to save the user
    // For now, just log it
    console.log('Save user:', isAddingUser ? 'New User' : selectedUser);
    setIsAddingUser(false);
    setIsEditingUser(false);
    setSelectedUser(null);
  };
  
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-purple-500';
      case 'artist':
        return 'bg-pink-500';
      case 'user':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const goBack = () => {
    router.push('/admin');
  };
  
  return (
    <div>
      <button 
        onClick={goBack}
        className="flex items-center text-gray-300 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">User Management</h1>
          <p className="text-gray-300">View and manage platform users</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..." 
              className="w-full sm:w-64 p-2 pl-10 rounded-lg bg-gray-800 bg-opacity-50 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <button 
            onClick={handleAddUser}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition flex items-center justify-center text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>
      </div>
      
      {(isAddingUser || isEditingUser) ? (
        // Add/Edit User Form
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-medium mb-6">
            {isAddingUser ? 'Add New User' : 'Edit User'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium" htmlFor="userName">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="userName"
                    defaultValue={selectedUser?.name || ''}
                    className="w-full pl-10 p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                    placeholder="Enter user name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-medium" htmlFor="userEmail">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="userEmail"
                    defaultValue={selectedUser?.email || ''}
                    className="w-full pl-10 p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-medium" htmlFor="userRole">
                  Role
                </label>
                <select
                  id="userRole"
                  defaultValue={selectedUser?.role || 'user'}
                  className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                  required
                >
                  <option value="user">User</option>
                  <option value="artist">Artist</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 font-medium" htmlFor="userPassword">
                  {isAddingUser ? 'Password' : 'New Password (optional)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="userPassword"
                    className="w-full pl-10 p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                    placeholder={isAddingUser ? 'Enter password' : 'Enter new password (leave empty to keep current)'}
                    required={isAddingUser}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition flex items-center"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition flex items-center"
              >
                <Check className="w-5 h-5 mr-2" />
                {isAddingUser ? 'Add User' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mb-6">
            <div className="relative inline-block">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-700 border-none rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="artist">Artists</option>
                <option value="admin">Admins</option>
              </select>
              <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 pointer-events-none text-gray-400" />
            </div>
          </div>
          
          {/* Users Table */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-3">
                            <span className="font-bold">{user.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs ${getRoleColor(user.role)} bg-opacity-20 flex items-center w-fit`}>
                          <span className={`w-2 h-2 rounded-full ${getRoleColor(user.role)} mr-2`}></span>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-3 py-1 rounded-full text-xs bg-green-500 bg-opacity-20 flex items-center w-fit">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button 
                          className="text-gray-400 hover:text-white mr-3"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-400"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No users found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                <button 
                  onClick={handleAddUser}
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition inline-block"
                >
                  Add New User
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}