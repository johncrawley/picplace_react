import React from 'react';
import styles from './TopNav.module.css'
import NavItems from '../Nav/NavItems/NavItems';
import { isAuthenticated }from '../../../Utils/AuthHandler';


const TopNav = () => {

    console.log("Loading TopNav");
    return (

        <div className={styles.background}>
            <NavItems isAuthenticated={isAuthenticated()}/>
        </div>
    );


}

export default TopNav;