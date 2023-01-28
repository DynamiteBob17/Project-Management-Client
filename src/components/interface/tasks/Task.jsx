import React from "react";
import ShowDescModal from "./ShowDescModal";
import ViewMembersModal from "./ViewMembersModal";
import CommentsModal from "./CommentsModal";
import CompleteTaskModal from "./CompleteTaskModal";

function Task(props) {
    const isTaskOverdue = task => {
        const todayFormatted = new Date().toISOString().split('T')[0];
        const taskDueDateFormatted = task.task_due_date.split('T')[0];

        return new Date(taskDueDateFormatted) <= new Date(todayFormatted);
    }

    return (
        <tr>
            <td
            >
                <span
                    style={props.yourTasks.map(yourTask => yourTask.task_id)
                        .includes(props.task.task_id)
                        ? { color: 'lime', fontWeight: 'bold' }
                        : {}
                    }
                >
                    {props.task.task_name}
                </span>
            </td>
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
                    isTaskOverdue={isTaskOverdue}
                />
            </td>
            <td>
                {
                    props.task.task_completed_date !== null
                        ? <i
                            className="fas fa-check-circle"
                            style={{ color: 'lime', fontSize: '20px' }}
                        />
                        : isTaskOverdue(props.task)
                            ? <i
                                className="fas fa-times-circle"
                                style={{ color: 'red', fontSize: '20px' }}
                            />
                            : props.isAdmin
                                ? <CompleteTaskModal
                                    task={props.task}
                                    handleCompleteTask={props.handleCompleteTask}
                                />
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
                    projectMembers={props.projectMembers}
                />
            </td>
        </tr>
    );
}

export default Task;
