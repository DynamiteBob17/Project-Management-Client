import React from "react";
import { Button } from "react-bootstrap";
import NewProjectModal from "./NewProjectModal";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table';
import DeleteProjectModal from "./DeleteProjectModal";
import AddMemberModal from "./AddMemberModal";
import './Members.scss';

function Members(props) {
    return (
        <div id="members">
            <div style={{ float: 'right', display: 'flex' }}>
                <NewProjectModal
                    handleProjectChange={props.handleProjectChange}
                    handleError={props.handleError}
                />
                {
                    props.projects.length > 0
                        ? <DropdownButton
                            id="dropdown-variants-Info"
                            variant="outline-info"
                            size="sm"
                            title={props.selectedProject.project_name}
                        >
                            {props.projects.map((project, index) => {
                                return (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => props.handleProjectChange(project)}
                                        active={project.project_id === props.selectedProject.project_id}
                                    >
                                        {project.project_name}
                                    </Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                        : <></>
                }
                {
                    props.isOwner
                        ? <DeleteProjectModal
                            handleError={props.handleError}
                            selectedProject={props.selectedProject}
                        />
                        : <></>
                }
            </div>

            <div id="project_members">
                <Table striped bordered hover variant="dark"
                >
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Email</th>
                            <th>Give admin</th>
                            <th>Remove member</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.projectMembers.map((member, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{
                                            color: member.is_admin ? '#0dcaf0' : 'white'
                                        }}>{member.username}</td>
                                        <td>{member.email}</td>
                                        <td>
                                            {
                                                !member.is_admin && props.isAdmin
                                                    ? <Button
                                                        variant="info"
                                                        size="sm"
                                                        onClick={() => props.handleGiveAdmin(member.user_id)}
                                                    >
                                                        +
                                                    </Button>
                                                    : <div style={{ color: 'red' }}>{!props.isAdmin ? 'You are not admin' : ''}</div>
                                            }
                                        </td>
                                        <td>
                                            {
                                                !member.is_admin && props.isAdmin && !member.is_owner
                                                    ? <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => props.handleRemoveMember(member.user_id)}
                                                    >
                                                        -
                                                    </Button>
                                                    : <div style={{ color: 'red' }}>{member.is_admin || member.is_owner || !props.isAdmin ? 'Cannot remove' : ''}</div>
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    {
                        props.isAdmin
                            ? <AddMemberModal
                                handleError={props.handleError}
                                selectedProject={props.selectedProject}
                                handleProjectChange={props.handleProjectChange}
                                usernames={
                                    props.projectMembers.map(member => {
                                        return member.username;
                                    })
                                }
                            />
                            : <></>
                    }
                </Table>
            </div>
        </div>
    );
}

export default Members;
