import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function CompleteTaskModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                variant="info"
                onClick={handleShow}
                size="sm">
                +
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >Give admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure?</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                            props.handleGiveAdmin(props.member.user_id)
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
