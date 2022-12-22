import React, { useState, useEffect } from "react";
import { FormCheck, Table } from "react-bootstrap";
import Task from "./Task";
import NewTaskModal from "./NewTaskModal";
import './Tasks.scss';

function Tasks(props) {

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
                        <div style={{ color: 'gray', fontStyle: 'italic' }}>
                            * your tasks are green and bold
                        </div>
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
                                    props.tasks.map((task, index) => {
                                        return (
                                            <Task
                                                key={index}
                                                task={task}
                                                yourTasks={props.yourTasks}
                                                projectMembers={props.projectMembers}
                                                isAdmin={props.isAdmin}
                                                handleCompleteTask={props.handleCompleteTask}
                                                handleError={props.handleError}
                                                handleYourTaskChange={props.handleYourTaskChange}
                                                user_id={props.user_id}
                                            />
                                        );
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
