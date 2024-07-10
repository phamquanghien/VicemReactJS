import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditRole = ({ show, handleClose, fetchRoles, role }) => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL + '/api/Role/';
    const [updatedRole, setUpdatedRole] = useState('');

    useEffect(() => {
        if (role) {
            setUpdatedRole(role.name);
        }
    }, [role]);

    const handleInputChange = (e) => {
        setUpdatedRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.put(`${apiUrl}${role.id}`, updatedRole, config);
            handleClose(); // Close modal after updating the employee
            fetchRoles(); // Refresh the employee list after updating
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" name="firstName" value={updatedRole.name} onChange={handleInputChange} required />
                    </Form.Group>
                    
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="button" onClick={handleSubmit}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default EditRole;