import React from "react";
import { Button } from "react-bootstrap";
import ShowDescModal from "./ShowDescModal";
import ViewMembersModal from "./ViewMembersModal";
import CommentsModal from "./CommentsModal";

function Task(props) {
    return (
        <tr>
            <td>{props.task.task_name}</td>
            <td>
                <ShowDescModal desc={props.task.task_description} />
            </td>
            <td
                style={{
                    color: props.task.task_priority === 'high'
                        ? 'red'
                        : props.task.task_priority === 'medium'
                            ? 'orange'
                            : 'lime',
                    fontWeight: 'bold'
                }}
            >
                {props.task.task_priority}
            </td>
            <td>{props.task.task_due_date.split('T')[0]}</td>
            <td>
                <ViewMembersModal
                    task_id={props.task.task_id}
                    handleError={props.handleError}
                    projectMembers={props.projectMembers}
                    isAdmin={props.isAdmin}
                    handleYourTaskChange={props.handleYourTaskChange}
                    user_id={props.user_id}
                    task={props.task}
                    isTaskOverdue={props.isTaskOverdue}
                />
            </td>
            <td>
                {
                    props.task.task_completed_date !== null
                        ? <i
                            className="fas fa-check-circle"
                            style={{ color: 'lime', fontSize: '20px' }}
                        />
                        : props.isTaskOverdue(props.task)
                            ? <i
                                className="fas fa-times-circle"
                                style={{ color: 'red', fontSize: '20px' }}
                            />
                            : props.isAdmin
                                ? <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => {
                                        props.handleCompleteTask(props.task.task_id);
                                    }}
                                >
                                    Complete
                                </Button>
                                : <i
                                    className="fas fa-minus-circle"
                                    style={{ color: 'orange', fontSize: '20px' }}
                                />
                }
            </td>
            <td>
                <CommentsModal
                    handleError={props.handleError}
                    task_id={props.task.task_id}
                    isAdmin={props.isAdmin}
                />
            </td>
        </tr>
    );
}

export default Task;
