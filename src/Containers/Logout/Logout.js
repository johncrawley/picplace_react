import React  from 'react';

import  { Redirect } from 'react-router-dom';
import  { deleteExistingToken } from '../../Utils/AuthHandler';


const Logout = () => {


    deleteExistingToken();

    return (
        <Redirect to="/Welcome" />
    );
}

export default Logout;