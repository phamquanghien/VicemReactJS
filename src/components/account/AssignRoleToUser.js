import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, ListGroup, Modal } from 'react-bootstrap';

const AssignRoleToUser = ({ show, handleClose, selectedUser, fetchData }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            fetchRoles();
            setSelectedRoles(selectedUser.roles);
        }
    }, [show, selectedUser]);
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
        } catch (error) {
            setError(error);
        }
    };
    const handleRoleChange = (roleName) => {
        const updatedRoles = [...selectedRoles];
        if (updatedRoles.includes(roleName)) {
            setSelectedRoles(updatedRoles.filter(role => role !== roleName));
        } else {
            setSelectedRoles([...updatedRoles, roleName]);
        }
    };
    const handleSubmit = async (e) => {
        console.log(selectedRoles);
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
            const data = {
                userId: selectedUser.id,
                roleNames: selectedRoles
            };
            await axios.post('http://localhost:5075/api/UserRole/AddRolesToUser', data, config);
            fetchData();
            handleClose();
        } catch (error) {
            setError(error);
        }
    };
    

    const renderRoles = () => {
        return roles.map(role => (
            <ListGroup.Item key={role.id}>
                <Form.Check
                    type="checkbox"
                    label={role.name}
                    checked={selectedRoles.includes(role.name)}
                    onChange={() => handleRoleChange(role.name)}
                />
            </ListGroup.Item>
        ));
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Assign Roles to User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error.message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <ListGroup>
                        {renderRoles()}
                    </ListGroup>
                    <Button variant="primary" type="submit" className="mt-3">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AssignRoleToUser;