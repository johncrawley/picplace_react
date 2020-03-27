import React, { Fragment } from 'react';
import { isAuthenticated } from '../Utils/AuthHandler';
import { Redirect } from 'react-router-dom';

const Auth = (WrappedComponent) => {
    

    let content = isAuthenticated() ? 
            <WrappedComponent />
           : <Redirect to="/login" /> ;


    return () => {
        return (
            <Fragment>

                {content}
            </Fragment>
        );
    };

    
}

/*
class Auth extends Component {

    constructor(props) {
        super(props);

    }


}
*/

export default Auth;