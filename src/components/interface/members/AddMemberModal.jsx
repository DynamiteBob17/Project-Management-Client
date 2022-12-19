import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import callAPI from '../callAPI';

function AddMemberModal(props) {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = () => {
        if (props.usernames.includes(username)) {
            props.handleError({
                message: 'Username already exists in project',
                response: {
                    data: {
                        message: ''
                    }
                }
            });
            return;
        }

        callAPI('PUT', '/api/project/member', {
            project_id: props.selectedProject.project_id,
            username: username
        })
            .then((result) => {
                props.handleProjectChange(props.selectedProject);
                handleClose();
            })
            .catch(props.handleError);
    }

    return (
        <>
            <Button variant="warning" onClick={handleShow} size="sm">
                Add member
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new member to selected project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel
                        controlId="floatingText"
                        label="Enter username"
                    >
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={e => { setUsername(e.target.value) }}
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="warning"
                        onClick={handleSubmit}
                    >
                        Add
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddMemberModal;
