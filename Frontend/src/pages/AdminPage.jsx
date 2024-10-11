import React from 'react';
import UserList from '../components/Admin/UserList.jsx';
import CategoryList from '../components/Admin/CategoryList.jsx';

const AdminPage = () => {
  return (
    <main className="container">
      <h1 className="text-center my-4">Admin Dashboard</h1>
      <UserList />
      <CategoryList />
    </main>
  );
};

export default AdminPage;
