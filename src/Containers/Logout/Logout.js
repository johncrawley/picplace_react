import React  from 'react';

import  { Redirect } from 'react-router-dom';
import  { logout } from '../../Utils/AuthHandler';


const Logout = () => {

    logout();

    return (
        <Redirect to="/Welcome" />
    );
}

export default Logout;