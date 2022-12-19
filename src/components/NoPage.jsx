import React from "react";
import { NavLink } from "react-router-dom";

export default function NoPage() {
    return (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h1 style={{ color: 'lightgray' }}>Oops, seems you might have gotten lost.</h1>
            <NavLink to='/interface'>Go back to the app.</NavLink>
        </div>
    );
}
