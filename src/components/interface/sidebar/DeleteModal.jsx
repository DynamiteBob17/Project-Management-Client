import callAPI from "../callAPI";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Cookies from "universal-cookie";
const cookies = new Cookies();

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
                delete your account
            </Button>

            <Modal show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: 'RED' }}>DELETE ACCOUNT</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => {
                        callAPI('DELETE', '/api/user/' + cookies.get('USER_ID'), {})
                            .then(res => {
                                Object.keys(cookies.cookies).forEach(cookie => {
                                    cookies.remove(cookie);
                                });
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
