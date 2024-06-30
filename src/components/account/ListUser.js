import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import { MdAssignmentAdd } from "react-icons/md";
import AssignRoleToUser from './AssignRoleToUser';

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchUser();
    }, []);
    const fetchUser = async () => {
        debugger;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get('http://localhost:5075/api/Account/get-all-user', config);
            setUsers(response.data);
        } catch (error) {
            setError(error);
        }
    }
    const handleShowAssignModal = (user) => {
        setSelectedUser(user);
        setShowAssignModal(true);
    }
    const handleCloseAssignModal = () => {
        setSelectedUser(null);
        setShowAssignModal(false);
    }
    return (
        <div className='container'>
            {error && <Alert variant="danger">{error.message}</Alert>}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.roles.join(', ')}</td>
                            <td>
                                <Button variant='success' onClick={() => handleShowAssignModal(user)} className="mr-2">
                                <MdAssignmentAdd size={20} className="text-white ud-cursor mx-0"/>Assign Role
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {selectedUser && (
                <>
                    <AssignRoleToUser show={showAssignModal} handleClose={handleCloseAssignModal} selectedUser={selectedUser} fetchData={fetchUser}/>
                </>
            )}
        </div>
    );
};

export default ListUser;