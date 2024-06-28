import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, InputGroup, DropdownButton, DropdownItem } from 'react-bootstrap';
import AddRole from './AddRole';
import EditRole from './EditRole';
import { FaRegEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

const ListRole = () => {
    const [roles, setRoles] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] =useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [deleteID, setDeleteID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchRoles();
    }, []);
    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get('http://localhost:5075/api/Role', config);
            setRoles(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };
    const handleShowAddModal = () => {
        setShowAddModal(true);
    };
    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };
    const handleShowEditModal = (role) => {
        setSelectedRole(role);
        setShowEditModal(true);
    };
    
    const handleCloseEditModal = () => {
        setSelectedRole(null);
        setShowEditModal(false);
    };
    
    const handleShowDeleteModal = (role) => {
        setSelectedRole(role);
        setDeleteID(role.id);
        setShowDeleteModal(true);
    };
    
      const handleCloseDeleteModal = () => {
        setDeleteID(null);
        setSelectedRole(null);
        setShowDeleteModal(false);
      };
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.delete(`http://localhost:5075/api/Role/${deleteID}`, config);
            fetchRoles();
            handleCloseDeleteModal();
        } catch (error) {
          console.error(error);
        }
      };
    return (
        <div className='container'>
            <div className="d-flex justify-content-between mb-2">
                <br/>
                <Button variant="primary" onClick={handleShowAddModal}>
                + Create new
                </Button>
            </div>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Normalized Name</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                        <tr key={role.id}>
                            <td>{role.id}</td>
                            <td>{role.name}</td>
                            <td>{role.normalizedName}</td>
                            <td>
                            <InputGroup className='mb-3'>
                                <DropdownButton variant="success" title="Actions" id="input-group-dropdown-1">
                                    <DropdownItem onClick={() => handleShowEditModal(role)}><FaRegEdit className="text-success ud-cursor mb-1 mx-1"/>Edit</DropdownItem>
                                    <DropdownItem variant="danger" onClick={() => handleShowDeleteModal(role)}><MdDeleteForever size={20} className="text-danger ud-cursor mb-1 mx-0"/>Delete</DropdownItem>
                                </DropdownButton>
                            </InputGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {selectedRole && (
                <EditRole show={showEditModal} handleClose={handleCloseEditModal} fetchRoles={fetchRoles} role={selectedRole} />
            )}
            <AddRole show={showAddModal} handleClose={handleCloseAddModal} fetchRoles={fetchRoles} />
            {selectedRole && (
                <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Bạn có muốn xoá bản ghi này không?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <p>{selectedRole.id}-{selectedRole.name}</p>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ListRole;