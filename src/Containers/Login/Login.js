import React, { useState, useEffect, useRef } from 'react';
import  { Redirect } from 'react-router-dom';

import Card from '../../Components/UI/Card/Card';
import Button from '../../Components/UI/Button/Button';
import LoadingAnimation from '../../Components/UI/LoadingAnimation/LoadingAnimation';
import { addFormElement, buildForm} from '../../Utils/FormBuilder';
import { postLoginRequest } from '../../Utils/AuthHandler';

const Login = props => {

    const [controls, setControls] = useState({});
    const [wasAuthenticationSuccessful, setAuthenticationSuccessful] = useState(false);
    const [isLoadingState, setLoadingState] = useState(false);
    const resetLoadingTimer = useRef(null);
    

    useEffect( () => {
        console.log("Login.js useEffect()");
        let form = [];
        addFormElement(form, "email", 'input', 'text', 'EmailPlaceholder', 'User Name:');
        addFormElement(form, "password", 'input', 'password', 'Password', 'Password:');
        setControls( prevState => (form));

    }, []);


    const onAuthSuccess = (response, authData) => {
        setLoadingState(false);
        setAuthenticationSuccessful(true);
        resetLoadingStateAfterTimeout();
    }

    const onAuthFail = () => {

        resetLoadingStateAfterTimeout();
    }


    const submitHandler = (event) => {
        
        event.preventDefault(); //prevents reloading of the page
        let authData = {
            username: controls.email.value,
            password: controls.password.value
        };
        setLoadingState(true);
        postLoginRequest(authData, onAuthSuccess, onAuthFail);
    }


    const resetLoadingStateAfterTimeout = () => {
        resetLoadingTimer.current = setTimeout(() => {
          setLoadingState(false);
          resetLoadingTimer.current = null;
        }, 1000);
    }


    let form = buildForm(controls, setControls);

    let loadingAnimation = isLoadingState === true ? <LoadingAnimation/> : null;

    if(wasAuthenticationSuccessful === true){
        return(
            <Redirect to= "/"></Redirect>
        );
    }
           
    return (
        <div className="auth">            
            <Card>
                <h2> You are not authenticated!</h2>
                <p>Please log in to continue.</p>

                <form onSubmit={submitHandler}>
                    {form}
                    <Button type="Success" disabled={isLoadingState} >Submit</Button>
                    <br></br>
                    {loadingAnimation}
                </form>
            </Card>
        </div>
    );
}

export default Login;