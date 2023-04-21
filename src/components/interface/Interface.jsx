import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import callAPI from "./callAPI";
import Cookies from "universal-cookie";
import SideBar from "./sidebar/SideBar";
import Members from "./members/Members";
import Tasks from "./tasks/Tasks";
import Analytics from "./analytics/Analytics";
import './Interface.scss';
const cookies = new Cookies();

// THIS IS A MESS; SHOULD REMAKE AND RESTRUCTURE ENTIRE APP TBH

export default function Interface() {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState({
        project_id: -1,
        project_name: ''
    });
    const [projectMembers, setProjectMembers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [yourTasks, setYourTasks] = useState([]);
    const [error, setError] = useState({
        message: '',
        response: {
            data: {
                message: ''
            }
        }
    });
    const [showError, setShowError] = useState(false);

    const handleError = error => {
        if (typeof error !== 'undefined' && typeof error.response !== 'undefined'
            && typeof error.response.status !== 'undefined' && error.response.status === 401) { // unauthorized
            cookies.remove('TOKEN');
            cookies.remove('USER_ID');
            cookies.remove('USERNAME');
            window.location.reload();
        }

        setError(error);
        setShowError(true);
    }
    const handleCloseError = () => setShowError(false);

    const checkAdmin = project_id => {
        callAPI('GET', `/api/project/member/admin/${project_id}/${cookies.get('USER_ID')}`, {}, setLoading)
            .then((result) => {
                setIsAdmin(result.is_admin);
                setIsOwner(result.is_owner);
            })
            .catch(handleError);
    }
    const getProjectMembers = project_id => {
        callAPI('GET', `/api/project/members/${project_id}`, {}, setLoading)
            .then((result) => {
                const sorted = result.users.sort((a, b) => a.username - b.username);
                setProjectMembers(sorted);
            })
            .catch(handleError);
    }
    const getTasks = project_id => {
        callAPI('GET', `/api/tasks/${project_id}`, {}, setLoading)
            .then((result) => {
                let sorted = result.tasks.sort((a, b) => {
                    return new Date(a.task_due_date) - new Date(b.task_due_date);
                });
                setTasks(sorted);

                callAPI('GET', `/api/user/tasks/${project_id}`, {}, setLoading)
                    .then((result) => {
                        sorted = result.tasks.sort((a, b) => {
                            return new Date(a.task_due_date) - new Date(b.task_due_date);
                        });
                        setYourTasks(sorted);
                    })
                    .catch(handleError);
            })
            .catch(handleError);
    }
    const handleAddTask = (task, assignedMembers) => {
        callAPI('POST', '/api/task', task, setLoading, setLoading)
            .then((result) => {
                setTasks([...tasks, result.task]);
                setYourTasks([...yourTasks, result.task]);
                const task_id = result.task.task_id;

                if (assignedMembers.length > 0) {
                    callAPI('PUT', '/api/task/members', {
                        task_id: task_id,
                        user_ids: assignedMembers
                    }, setLoading)
                        .then((result) => {
                            // Do nothing for now
                        })
                        .catch(handleError);
                }
            })
            .catch(handleError);
    }
    const handleYourTaskChange = task => {
        setYourTasks([...yourTasks, task]);
    }
    const handleCompleteTask = task_id => {
        callAPI('PUT', '/api/task/complete', {
            task_id: task_id
        }, setLoading)
            .then((result) => {
                getTasks(selectedProject.project_id);
            })
            .catch(handleError);
    }
    const handleProjectChange = project => {
        setSelectedProject(project);

        if (!projects.includes(project)) {
            setProjects([...projects, project]);
        }

        checkAdmin(project.project_id);
        getProjectMembers(project.project_id);
        getTasks(project.project_id);
    };
    const handleGiveAdmin = user_id => {
        callAPI('PUT', '/api/project/member/admin', {
            project_id: selectedProject.project_id,
            user_id: user_id
        }, setLoading)
            .then((result) => {
                getProjectMembers(selectedProject.project_id);
            })
            .catch(handleError);
    }
    const handleRemoveMember = user_id => {
        callAPI('DELETE', `/api/project/member/${selectedProject.project_id}/${user_id}`, {}, setLoading)
            .then((result) => {
                setProjectMembers(projectMembers.filter(member => member.user_id !== user_id));

                if (user_id === parseInt(cookies.get('USER_ID'))) {
                    window.location.reload();
                }
            })
            .catch(handleError);
    }

    useEffect(() => {
        callAPI('GET', '/api/projects', {}, setLoading)
            .then((result) => {
                setProjects(result.projects);

                if (result.projects.length > 0) {
                    if (selectedProject.project_id === -1) {
                        setSelectedProject(result.projects[0]);
                        checkAdmin(result.projects[0].project_id);
                        getProjectMembers(result.projects[0].project_id);
                        getTasks(result.projects[0].project_id);
                    } else {
                        checkAdmin(selectedProject.project_id);
                        getProjectMembers(selectedProject.project_id);
                        getTasks(selectedProject.project_id);
                    }
                }
            })
            .catch(handleError);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ display: 'flex' }}>

            {
                loading && <div className={"lds-dual-ring"}></div>
            }

            <Modal show={showError} onHide={handleCloseError} size="sm">
                <Modal.Header closeButton style={{ color: 'red' }}>
                    <Modal.Title>{error.message}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        error.response === undefined
                            ? 'Possible unauthorized request'
                            : error.response.data.message
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseError}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            <SideBar
                handleError={handleError}
                isAdmin={isAdmin}
                selectedProject={selectedProject}
                setLoading={setLoading}
            />

            <div id="interface" style={{
                maxHeight: '100vh',
                overflowY: 'auto',
                width: '100%'
            }}>
                <Members
                    handleError={handleError}
                    handleProjectChange={handleProjectChange}
                    selectedProject={selectedProject}
                    projects={projects}
                    projectMembers={projectMembers}
                    isAdmin={isAdmin}
                    isOwner={isOwner}
                    handleGiveAdmin={handleGiveAdmin}
                    handleRemoveMember={handleRemoveMember}
                    setLoading={setLoading}
                />
                {
                    selectedProject.project_id !== -1
                        ?
                        <>
                            <Tasks
                                handleError={handleError}
                                tasks={tasks}
                                yourTasks={yourTasks}
                                selectedProject={selectedProject}
                                isAdmin={isAdmin}
                                projectMembers={projectMembers}
                                handleAddTask={handleAddTask}
                                user_id={parseInt(cookies.get('USER_ID'))}
                                handleYourTaskChange={handleYourTaskChange}
                                handleCompleteTask={handleCompleteTask}
                                setLoading={setLoading}
                            />
                            <Analytics
                                handleError={handleError}
                                tasks={tasks}
                            />
                        </>
                        : <></>
                }
            </div>
        </div>
    );
}
