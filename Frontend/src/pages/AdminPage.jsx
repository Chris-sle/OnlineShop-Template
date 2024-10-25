import React from 'react';
import UserList from '../components/Admin/UserList.jsx';
import CategoryList from '../components/Admin/CategoryList.jsx';
import AdminOrders from '../components/Admin/AdminOrders.jsx';

const AdminPage = () => {
  return (
    <main className="container">
      <h1 className="text-center my-4">Admin Dashboard</h1>

      <div className="mb-3">
        <button className="btn btn-primary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#userListCollapse" aria-expanded="false" aria-controls="userListCollapse">
          Toggle User List
        </button>
        <div className="collapse" id="userListCollapse">
          <UserList />
        </div>
      </div>

      <div className="mb-3">
        <button className="btn btn-primary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#categoryListCollapse" aria-expanded="false" aria-controls="categoryListCollapse">
          Toggle Category List
        </button>
        <div className="collapse" id="categoryListCollapse">
          <CategoryList />
        </div>
      </div>

      <div className="mb-3">
        <button className="btn btn-primary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#adminOrdersCollapse" aria-expanded="false" aria-controls="adminOrdersCollapse">
          Manage Orders
        </button>
        <div className="collapse" id="adminOrdersCollapse">
          <AdminOrders />
        </div>
      </div>
    </main>
  );
};

export default AdminPage;
