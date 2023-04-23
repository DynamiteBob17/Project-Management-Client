import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import callAPI from '../callAPI';

function AddMemberModal(props) {
    const [show, setShow] = useState(false);
    const [usernamesNotInProject, setUsernamesNotInProject] = useState(null);
    const [singleSelections, setSingleSelections] = useState([]);

    useEffect(() => {
        setUsernamesNotInProject(null);
    }, [props.projectMembers]);

    const handleClose = () => {
        setSingleSelections([]);
        setShow(false);
    };
    const handleShow = () => {
        if (!usernamesNotInProject) {
            callAPI(
                'GET',
                `/api/project/non_members/${props.selectedProject.project_id}`,
                {},
                props.setLoading
            ).then((result) => {
                setUsernamesNotInProject(result.non_members.map(nonmember => nonmember.username));
            })
                .catch(props.handleError);
        }

        setShow(true);
    };
    const handleSubmit = e => {
        e.preventDefault();

        if (singleSelections.length === 0) {
            return;
        }

        callAPI('PUT', '/api/project/member', {
            project_id: props.selectedProject.project_id,
            username: singleSelections[0]
        }, props.setLoading)
            .then((result) => {
                props.handleProjectChange(props.selectedProject);
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
                            <Typeahead
                                id="basic-typeahead-single"
                                labelKey="username"
                                onChange={setSingleSelections}
                                options={usernamesNotInProject || []}
                                placeholder="Find a user..."
                                selected={singleSelections}
                            />

                            <Button
                                disabled={singleSelections.length === 0}
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
