import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function RemoveMemberModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                variant="danger"
                onClick={handleShow}
                size="sm">
                {
                    props.member.user_id === parseInt(cookies.get('USER_ID'))
                        ? 'Leave project'
                        : '-'
                }
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >
                        {
                            props.member.user_id === parseInt(cookies.get('USER_ID'))
                                ? 'Leave this project'
                                : 'Remove user from project'
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure?</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                            props.handleRemoveMember(props.member.user_id)
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

export default RemoveMemberModal;
