import React from "react";
import NewProjectModal from "./NewProjectModal";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table';
import DeleteProjectModal from "./DeleteProjectModal";
import AddMemberModal from "./AddMemberModal";
import MakeAdminModal from "./MakeAdminModal";
import RemoveMemberModal from "./RemoveMemberModal";
import Cookies from "universal-cookie";
import './Members.scss';
const cookies = new Cookies();

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

            {
                props.projects.length > 0
                    ? <div id="project_members">
                        <Table responsive striped bordered hover variant="dark"
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
                                                }}>{member.username + (member.user_id === parseInt(cookies.get('USER_ID')) ? ' (you)' : '')}</td>
                                                <td>{member.email}</td>
                                                <td>
                                                    {
                                                        !member.is_admin && props.isAdmin
                                                            ? <MakeAdminModal
                                                                member={member}
                                                                handleGiveAdmin={props.handleGiveAdmin}
                                                            />
                                                            : <div style={{ color: 'red' }}>{!props.isAdmin ? 'You are not admin' : ''}</div>
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        ((member.user_id === parseInt(cookies.get('USER_ID')) && !member.is_owner)
                                                            || (props.isAdmin && !member.is_admin)
                                                            || (props.isOwner && !member.is_owner))
                                                            ? <RemoveMemberModal
                                                                member={member}
                                                                handleRemoveMember={props.handleRemoveMember}
                                                            />
                                                            : <div style={{ color: 'red' }}>{
                                                                member.is_owner
                                                                    ? 'owner'
                                                                    : member.is_admin
                                                                        ? 'admin'
                                                                        : 'member'
                                                            }</div>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </Table>
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
                    </div>
                    : <></>
            }
        </div>
    );
}

export default Members;
