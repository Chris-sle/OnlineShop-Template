import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await fetchWithToken('/admin/users', 'GET');
        setUsers(result);
      } catch (error) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const changeUserRole = async (userId, newRole) => {
    try {
      await fetchWithToken(`/admin/users/${userId}/role`, 'PUT', { newRole });
      const updatedUsers = await fetchWithToken('/admin/users', 'GET');
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to change role: ', error.message);
      setError('Failed to change role');
    }
  };

  const removeUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await fetchWithToken(`/admin/users/${userId}`, 'DELETE');
        const updatedUsers = await fetchWithToken('/admin/users', 'GET');
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Failed to remove user: ', error.message);
        setError('Failed to remove user');
      }
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2 className="h2">User List</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_email}</td>
              <td>
                <select
                  defaultValue={user.role_name}
                  onChange={(e) => changeUserRole(user.user_id, e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                  <option value="guest">Guest</option>
                </select>
              </td>
              <td>
                <button onClick={() => removeUser(user.user_id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
