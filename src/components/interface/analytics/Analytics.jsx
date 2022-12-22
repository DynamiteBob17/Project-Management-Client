import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart"; 

function Analytics(props) {
    const [taskStatuses, setTaskStatuses] = useState([1, 1, 1]);
    const [taskPriorities, setTaskPriorities] = useState([1, 1, 1]);

    useEffect(() => {

    }, [props.tasks, taskStatuses, taskPriorities]);

    return (
        <div id="analytics">
            <PieChart
                data={[
                    { title: "Completed", value: taskStatuses[0], color: "lime" },
                    { title: "Incomplete", value: taskStatuses[1], color: "orange" },
                    { title: "Overdue", value: taskStatuses[2], color: "red" },
                ]}
            />
            <PieChart
                data={[
                    { title: "Completed", value: taskPriorities[0], color: "lime" },
                    { title: "Incomplete", value: taskPriorities[1], color: "orange" },
                    { title: "Overdue", value: taskPriorities[2], color: "red" },
                ]}
            />
        </div>
    );
}

export default Analytics;
