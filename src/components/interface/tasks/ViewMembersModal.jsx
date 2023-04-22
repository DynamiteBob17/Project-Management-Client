import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import callAPI from "../callAPI";

function ViewMembersModal(props) {
    const [show, setShow] = useState(false);
    const [taskMembers, setTaskMembers] = useState([]);
    const [nonMembers, setNonMembers] = useState([]);

    const subtractArrays = (arr1, arr2) => {
        return arr1.filter(item => !arr2.includes(item));
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        callAPI('GET', `/api/task/members/${props.task_id}`, {}, props.setLoading)
            .then((result) => {
                const taskMemberIds = result.members.map(member => member.user_id);
                const members = props.projectMembers.filter(member => {
                    return taskMemberIds.includes(member.user_id);
                });

                setTaskMembers(members);
                setNonMembers(subtractArrays(props.projectMembers, members));
            })
            .catch(props.handleError);
    }, [props.projectMembers]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Button
                variant="info"
                onClick={handleShow}
                size="sm">
                Members
            </Button>

            <Modal show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Task members</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        taskMembers.length > 0
                            ? taskMembers.map((member) => {
                                return (
                                    <div
                                        key={member.user_id}
                                        style={{ color: member.is_admin ? '#0dcaf0' : '' }}
                                    >
                                        {member.username}
                                        {
                                            props.isAdmin
                                                && props.task.task_completed_date === null
                                                && !props.isTaskOverdue(props.task)
                                                ? <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    style={{
                                                        marginLeft: '10px',
                                                        padding: '0px 8px',
                                                        fontWeight: 'bold'
                                                    }}
                                                    onClick={() => {
                                                        callAPI('DELETE', `/api/task/member/${props.task_id}/${member.user_id}`, {}, props.setLoading)
                                                            .then(result => {
                                                                const newNonMember = props.projectMembers.find(projectMember => {
                                                                    return projectMember.user_id === result.task_member.user_id;
                                                                });

                                                                const newNonMembers = [...nonMembers, newNonMember];
                                                                setNonMembers(newNonMembers);
                                                                setTaskMembers(subtractArrays(props.projectMembers, newNonMembers));
                                                            
                                                                if (result.task_member.user_id === props.user_id) {
                                                                    props.handleYourTaskChange(props.task, false);
                                                                }
                                                            })
                                                            .catch(props.handleError);
                                                    }}
                                                >
                                                    -
                                                </Button>
                                                : ''
                                        }
                                    </div>
                                );
                            })
                            : 'No members'
                    }
                    <h6 style={{ marginTop: '20px' }}>Non members</h6>
                    {
                        nonMembers.length > 0
                            ? nonMembers.map((member) => {
                                return (
                                    <div
                                        key={member.user_id}
                                        style={{ color: member.is_admin ? '#0dcaf0' : '' }}
                                    >
                                        {member.username}
                                        {
                                            props.isAdmin
                                                && props.task.task_completed_date === null
                                                && !props.isTaskOverdue(props.task)
                                                ? <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    style={{
                                                        marginLeft: '10px',
                                                        padding: '0px 7px',
                                                        fontWeight: 'bold'
                                                    }}
                                                    onClick={() => {
                                                        callAPI('PUT', `/api/task/member`, {
                                                            task_id: props.task_id,
                                                            user_id: member.user_id
                                                        }, props.setLoading)
                                                            .then(result => {
                                                                const newMember = props.projectMembers.find(projectMember => {
                                                                    return projectMember.user_id === result.task_member.user_id;
                                                                })

                                                                const newTaskMembers = [...taskMembers, newMember];
                                                                setTaskMembers(newTaskMembers);
                                                                setNonMembers(subtractArrays(props.projectMembers, newTaskMembers));

                                                                if (result.task_member.user_id === props.user_id) {
                                                                    props.handleYourTaskChange(props.task, true);
                                                                }
                                                            })
                                                            .catch(props.handleError);
                                                    }}
                                                >
                                                    +
                                                </Button>
                                                : ''
                                        }
                                    </div>
                                );
                            })
                            : ''
                    }
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ViewMembersModal;
