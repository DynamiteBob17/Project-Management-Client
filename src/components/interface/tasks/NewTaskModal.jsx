import React, { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function NewTaskModal(props) {
    const formattedDate = new Date().toISOString().split('T')[0];
    const initialTaskState = {
        task_name: '',
        task_description: '',
        task_priority: -1, // 0 = low, 1 = medium, 2 = high
        task_due_date: formattedDate,
        project_id: -1
    }
    const [show, setShow] = useState(false);
    const [task, setTask] = useState(Object.assign({}, initialTaskState));
    const [assignedMembers, setAssignedMembers] = useState([]);

    const handleClose = () => {
        setShow(false);
        // when you close the modal the state doesn't change
        // but the checkboxes all get unchecked apparently
        setAssignedMembers([]);
    };
    const handleShow = () => setShow(true);
    const handleSubmit = e => {
        e.preventDefault();

        console.log(props.selectedProject.project_id);

        let error = {
            message: '',
            response: {
                data: {
                    message: ''
                }
            }
        };
        if (task.task_name.trim() === '') {
            error.message = 'Error';
            error.response.data.message = 'Task name is required';
            props.handleError(error);
            return;
        } else if (task.task_priority === -1) {
            error.message = 'Error';
            error.response.data.message = 'Task priority is required';
            props.handleError(error);
            return;
        } else if (new Date(task.task_due_date) <= new Date(formattedDate)) {
            error.message = 'Error';
            error.response.data.message = 'Task due date must be in the future';
            props.handleError(error);
            return;
        }

        const newTask = {
            task_name: task.task_name.trim(),
            task_description: task.task_description.trim(),
            task_priority: ['low', 'medium', 'high'][task.task_priority],
            task_due_date: task.task_due_date + ' 01:00', // gmt+1
            project_id: props.selectedProject.project_id
        }

        props.handleAddTask(newTask, assignedMembers);
        setTask(Object.assign({}, initialTaskState));
        handleClose();
    };

    return (
        <>
            <Button
                variant="outline-warning"
                onClick={handleShow}
                size="sm"
                style={{ marginBottom: '10px' }}
            >
                New task
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new task for this project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <FloatingLabel controlId="floatingInput" label="Task name">
                            <Form.Control
                                required
                                type="text"
                                placeholder="Task name"
                                value={task.task_name}
                                onChange={e => setTask({ ...task, task_name: e.target.value })}
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingTextarea" label="Task description">
                            <Form.Control
                                as="textarea"
                                style={{ height: '100px' }}
                                placeholder="Task description"
                                value={task.task_description}
                                onChange={e => setTask({ ...task, task_description: e.target.value })}
                            />
                        </FloatingLabel>
                        <Form.Select
                            aria-label="Task priority"
                            value={task.task_priority}
                            onChange={e => setTask({ ...task, task_priority: e.target.value })}
                        >
                            <option>Select priority</option>
                            <option value="0">low</option>
                            <option value="1">medium</option>
                            <option value="2">high</option>
                        </Form.Select>
                        <FloatingLabel controlId="floatingInput" label="Task due date">
                            <Form.Control
                                required
                                type="date"
                                placeholder="Task due date"
                                value={task.task_due_date}
                                onChange={e => setTask({ ...task, task_due_date: e.target.value })}
                            />
                        </FloatingLabel>
                        <Form.Label>Assign members</Form.Label>
                        {
                            props.projectMembers.map((member, index) => {
                                if (member.user_id === props.user_id) {
                                    return '';
                                }

                                return (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        id={member.user_id}
                                        label={member.username}
                                        value={member.user_id}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setAssignedMembers([...assignedMembers, parseInt(e.target.value)]);
                                            } else {
                                                setAssignedMembers(assignedMembers.filter(member => member !== parseInt(e.target.value)));
                                            }
                                        }}
                                    />
                                );
                            })
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="warning"
                        type="submit"
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

export default NewTaskModal;
