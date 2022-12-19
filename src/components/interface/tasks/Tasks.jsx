import React, { useState } from "react";
import { FormCheck } from "react-bootstrap";
import Task from "./Task";

function Tasks(props) {
    const [showOnlyYourTasks, setShowOnlyYourTasks] = useState(false);

    return (
        <div id="tasks">
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
        </div>
    );
}

export default Tasks;
