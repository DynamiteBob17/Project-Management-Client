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
    const handleSubmit = e => {
        e.preventDefault();

        if (username === '') {
            return;
        }

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
        }, props.setLoading)
            .then((result) => {
                props.handleProjectChange(props.selectedProject);
                setUsername('');
                handleClose();
            })
            .catch(props.handleError);
    }

    return (
        <>
            <Button
                variant="warning"
                onClick={handleShow}
                size="sm"
                style={{ marginBottom: '25px' }}
            >
                Add member
            </Button>

            <Form>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a new member to selected project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
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

                            <Button
                                disabled={username === ''}
                                variant="warning"
                                onClick={handleSubmit}
                                type="submit"
                                style={{
                                    marginTop: '10px',
                                    float: 'right'
                                }}
                            >
                                Add
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Form>
        </>
    );
}

export default AddMemberModal;
