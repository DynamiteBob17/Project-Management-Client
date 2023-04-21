import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import callAPI from "../callAPI";

function DeleteModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                variant="outline-danger"
                onClick={handleShow}
                size="sm">
                Delete project
            </Button>

            <Modal show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: 'RED' }}>DELETE PROJECT</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => {
                        callAPI('DELETE', '/api/project/' + props.selectedProject.project_id, {}, props.setLoading)
                            .then(res => {
                                window.location.reload();
                            })
                            .catch(props.handleError);
                    }}>
                        Yes
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteModal;
