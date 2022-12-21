import React, { useState } from "react";
import { FormCheck, Table } from "react-bootstrap";
import Task from "./Task";
import NewTaskModal from "./NewTaskModal";
import './Tasks.scss';

function Tasks(props) {
    const [showOnlyYourTasks, setShowOnlyYourTasks] = useState(false);

    const isTaskOverdue = task => {
        const todayFormatted = new Date().toISOString().split('T')[0];
        const taskDueDateFormatted = task.task_due_date.split('T')[0];

        return new Date(taskDueDateFormatted) <= new Date(todayFormatted);
    } 

    return (
        <div id="tasks">
            {
                props.isAdmin
                    ? <NewTaskModal
                        project_id={props.selectedProject.project_id}
                        projectMembers={props.projectMembers}
                        handleAddTask={props.handleAddTask}
                        handleError={props.handleError}
                        user_id={props.user_id}
                    />
                    : <></>
            }
            {
                props.tasks.length > 0
                    ? <>
                        <FormCheck
                            style={{ color: 'white', fontStyle: 'italic', fontSize: '14px' }}
                            type="checkbox"
                            id="showOnlyYourTasks"
                            label="Show only your tasks"
                            checked={showOnlyYourTasks}
                            onChange={() => setShowOnlyYourTasks(!showOnlyYourTasks)}
                        />
                        <Table striped bordered hover variant="dark" style={{ textAlign: 'center' }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Priority</th>
                                    <th>Due date</th>
                                    <th>Assigned to</th>
                                    <th>Completed</th>
                                    <th>Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    showOnlyYourTasks
                                        ? props.yourTasks.map((task, index) => {
                                            return <Task
                                                key={index}
                                                task={task}
                                                handleError={props.handleError}
                                                projectMembers={props.projectMembers}
                                                isAdmin={props.isAdmin}
                                                handleYourTaskChange={props.handleYourTaskChange}
                                                user_id={props.user_id}
                                                isTaskOverdue={isTaskOverdue}
                                                handleCompleteTask={props.handleCompleteTask}
                                            />
                                        })
                                        : props.tasks.map((task, index) => {
                                            return <Task
                                                key={index}
                                                task={task}
                                                handleError={props.handleError}
                                                projectMembers={props.projectMembers}
                                                isAdmin={props.isAdmin}
                                                handleYourTaskChange={props.handleYourTaskChange}
                                                user_id={props.user_id}
                                                isTaskOverdue={isTaskOverdue}
                                                handleCompleteTask={props.handleCompleteTask}
                                            />
                                        })
                                }
                            </tbody>
                        </Table>
                    </>
                    : <></>
            }
        </div>
    );
}

export default Tasks;
