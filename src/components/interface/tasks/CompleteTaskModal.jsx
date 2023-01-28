import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function CompleteTaskModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                variant="outline-warning"
                onClick={handleShow}
                size="sm">
                Complete
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >Complete Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure?</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                            props.handleCompleteTask(props.task.task_id);
                        }}
                    >
                        Yes
                    </Button>
                    <Button
                        variant="danger"
                        size="md"
                        onClick={handleClose}
                    >
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CompleteTaskModal;
