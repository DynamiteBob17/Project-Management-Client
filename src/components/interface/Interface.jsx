import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import callAPI from "./callAPI";
import Cookies from "universal-cookie";
import SideBar from "./sidebar/SideBar";
import Members from "./members/Members";
import Tasks from "./tasks/Tasks";
import Analytics from "./analytics/Analytics";
const cookies = new Cookies();

export default function Interface() {
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
        setError(error);
        setShowError(true);
    }
    const handleCloseError = () => setShowError(false);

    const checkAdmin = project_id => {
        callAPI('GET', `/api/project/member/admin/${project_id}/${cookies.get('USER_ID')}`, {})
            .then((result) => {
                setIsAdmin(result.is_admin);
                setIsOwner(result.is_owner);
            })
            .catch(handleError);
    }
    const getProjectMembers = project_id => {
        callAPI('GET', `/api/project/members/${project_id}`, {})
            .then((result) => {
                setProjectMembers(result.users);
            })
            .catch(handleError);
    }
    const getTasks = project_id => {
        callAPI('GET', `/api/tasks/${project_id}`, {})
            .then((result) => {
                setTasks(result.tasks);

                callAPI('GET', `/api/user/tasks/${cookies.get('USER_ID')}/${project_id}`, {})
                    .then((result) => {
                        setYourTasks(result.tasks);
                    })
                    .catch(handleError);
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
        })
            .then((result) => {
                getProjectMembers(selectedProject.project_id);
            })
            .catch(handleError);
    }
    const handleRemoveMember = user_id => {
        callAPI('DELETE', `/api/project/member/${selectedProject.project_id}/${user_id}`, {})
            .then((result) => {
                window.location.reload();
            })
            .catch(handleError);
    }

    useEffect(() => {
        callAPI('GET', '/api/projects/' + cookies.get('USER_ID'), {})
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
                />
                {
                    selectedProject.project_id !== -1
                        ?
                        <>
                            <Tasks
                                handleError={handleError}
                                tasks={tasks}
                                yourTasks={yourTasks}
                            />
                            <Analytics
                                handleError={handleError}
                            />
                        </>
                        : <></>
                }
            </div>
        </div>
    );
}
