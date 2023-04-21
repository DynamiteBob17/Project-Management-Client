import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import callAPI from '../callAPI';

function NewProjectModal(props) {
    const [show, setShow] = useState(false);
    const [project_name, setProject_name] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = e => {
        e.preventDefault();

        if (project_name === '') {
            return;
        }

        callAPI('POST', '/api/project', {
            project_name: project_name
        }, props.setLoading)
            .then((result) => {
                props.handleProjectChange(result.project);
                handleClose();
            })
            .catch(props.handleError);
    }

    return (
        <>
            <Button variant="outline-warning" onClick={handleShow} size="sm">
                New project
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <FloatingLabel
                            controlId="floatingText"
                            label="Enter project name"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter project name"
                                value={project_name}
                                onChange={e => { setProject_name(e.target.value) }}
                            />
                        </FloatingLabel>

                        <Button
                            disabled={project_name === ''}
                            variant="warning"
                            onClick={handleSubmit}
                            style={{
                                marginTop: '10px',
                                float: 'right'
                            }}
                        >
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default NewProjectModal;
