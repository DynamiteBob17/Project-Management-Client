import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function ShowDescModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                variant="info"
                onClick={handleShow}
                size="sm">
                Show
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >Task description</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.desc}</Modal.Body>
            </Modal>
        </>
    );
}

export default ShowDescModal;
