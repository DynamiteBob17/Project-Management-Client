import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import callAPI from '../callAPI';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function NewProjectModal(props) {
    const [show, setShow] = useState(false);
    const [project_name, setProject_name] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = () => {
        callAPI('POST', '/api/project', {
            project_name: project_name,
            user_id: cookies.get('USER_ID')
        })
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
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="warning"
                        onClick={handleSubmit}
                    >
                        Create
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NewProjectModal;
