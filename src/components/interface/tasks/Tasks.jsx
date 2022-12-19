import React, { useState } from "react";
import { FormCheck } from "react-bootstrap";
import Task from "./Task";
import NewTaskModal from "./NewTaskModal";

function Tasks(props) {
    const [showOnlyYourTasks, setShowOnlyYourTasks] = useState(false);

    return (
        <div id="tasks">
            {
                props.isAdmin
                    ? <NewTaskModal
                        project_id={props.selectedProject.project_id}
                    />
                    : <></>
            }
            {
                props.tasks.length > 0
                    ? <>
                        <FormCheck
                            type="checkbox"
                            id="showOnlyYourTasks"
                            label="Show only your tasks"
                            checked={showOnlyYourTasks}
                            onChange={() => setShowOnlyYourTasks(!showOnlyYourTasks)}
                        />
                        {
                            showOnlyYourTasks
                                ? props.yourTasks.map((task, index) => {
                                    return <Task key={index} task={task} />
                                })
                                : props.tasks.map((task, index) => {
                                    return <Task key={index} task={task} />
                                })
                        }
                    </>
                    : <></>
            }
        </div>
    );
}

export default Tasks;
