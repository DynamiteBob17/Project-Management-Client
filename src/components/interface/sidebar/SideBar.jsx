import DeleteModal from "./DeleteModal";
import React from "react";
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    CDBIcon
} from "cdbreact";
import "./SideBar.scss";
import { Button } from "react-bootstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function SideBar(props) {
    return (
        <div style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}>
            <CDBSidebar>
                <CDBSidebarHeader prefix={<CDBIcon icon="bars" size="lg" className="icon_hover" />}>
                    {props.selectedProject.project_name}
                </CDBSidebarHeader>

                <CDBSidebarContent>
                    <CDBSidebarMenu>
                        <a href="#members" className="sidebar_link">
                            <CDBSidebarMenuItem icon="users">Members</CDBSidebarMenuItem>
                        </a>
                        <a href="#tasks" className="sidebar_link">
                            <CDBSidebarMenuItem icon="tasks">Tasks</CDBSidebarMenuItem>
                        </a>
                        <a href="#analytics" className="sidebar_link">
                            <CDBSidebarMenuItem icon="chart-line">Analytics</CDBSidebarMenuItem>
                        </a>
                        <CDBSidebarMenuItem>
                            <DeleteModal handleError={props.handleError} />
                        </CDBSidebarMenuItem>
                    </CDBSidebarMenu>
                </CDBSidebarContent>

                <CDBSidebarFooter style={{ textAlign: "center" }}>
                    <div
                        style={{
                            padding: "20px 5px"
                        }}
                    >
                        <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => {
                                Object.keys(cookies.getAll()).forEach(cookie => {
                                    cookies.remove(cookie);
                                });
                                window.location.href = '/';
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
}

export default SideBar;
