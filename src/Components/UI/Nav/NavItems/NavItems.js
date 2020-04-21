import React from 'react';
import styles from './NavItems.module.css';
import NavItem from './NavItem/NavItem';
import { Fragment } from 'react';


const generalLinks = (
    <Fragment> 
         <NavItem link="/" >Gallery</NavItem>
    </Fragment> 
); 

const authenticatedLinks = (
    <Fragment> 
        <NavItem link="/upload">Upload</NavItem> 
        <NavItem link="/logout">Logout</NavItem>
    </Fragment> 
);


const anonLinks = (
     <Fragment> 
        <NavItem link="/login">Login</NavItem>
        <NavItem link="/signup">Signup</NavItem>
    </Fragment> 
); 


const NavItems = (props) => (

    <ul className={styles.NavItems}>
        {generalLinks}
        {props.isAuthenticated ? authenticatedLinks : anonLinks}
    </ul>
);

export default NavItems;