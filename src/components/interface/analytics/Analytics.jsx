import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";

function Analytics(props) {
    const [taskStatuses, setTaskStatuses] = useState([0, 0, 0]);
    const [taskPriorities, setTaskPriorities] = useState([0, 0, 0]);

    const isTaskOverdue = task => {
        const todayFormatted = new Date().toISOString().split('T')[0];
        const taskDueDate = task.task_due_date.split('T')[0];

        return taskDueDate <= todayFormatted;
    }

    useEffect(() => {
        let completed = 0, inProgress = 0, failed = 0;
        let low = 0, medium = 0, high = 0;

        props.tasks.forEach(task => {
            if (task.task_completed_date !== null) ++completed;
            else if (isTaskOverdue(task)) ++failed;
            else ++inProgress;


            if (task.task_priority === "low") ++low;
            else if (task.task_priority === "medium") ++medium;
            else if (task.task_priority === "high") ++high;
        });

        setTaskStatuses([completed, inProgress, failed]);
        setTaskPriorities([low, medium, high]);
    }, [props.tasks]);

    return (
        <div id="analytics"
            style={{
                margin: '50px 20px 25px 20px',
                display: 'flex',
                color: 'white',
                maxWidth: '500px'
            }}
        >
            <div
                style={{
                    fontStyle: 'italic'
                }}
            >
                Task priorities
            </div>
            <PieChart
                data={[
                    { title: "low", value: taskPriorities[0], color: "lime" },
                    { title: "medium", value: taskPriorities[1], color: "orange" },
                    { title: "high", value: taskPriorities[2], color: "red" },
                ]}
            />

            <div
                style={{
                    fontStyle: 'italic'
                }}
            >
                Task statuses
            </div>
            <PieChart
                lineWidth={50}
                data={[
                    { title: "completed", value: taskStatuses[0], color: "lime" },
                    { title: "in progress", value: taskStatuses[1], color: "orange" },
                    { title: "failed", value: taskStatuses[2], color: "red" },
                ]}
            />
        </div>
    );
}

export default Analytics;
