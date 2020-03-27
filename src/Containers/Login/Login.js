import React, { useState, useEffect, useRef } from 'react';
import axios from '../../axios';
import  { Redirect } from 'react-router-dom';


import Card from '../../Components/UI/Card/Card';
import Input from '../../Components/UI/Input/Input';
import Button from '../../Components/UI/Button/Button';
import LoadingAnimation from '../../Components/UI/LoadingAnimation/LoadingAnimation';
import {saveLoginTokens} from '../../Utils/AuthHandler'

const Login = props => {

    const [controlsState, setControlsState] = useState({controls: {}});
    const [authSuccessState, setAuthSuccessState] = useState(false);
    const [isLoadingState, setLoadingState] = useState(false);
    const resetLoadingTimer = useRef(null);

    useEffect( () => {
        let form = controlsState.controls;
        addFormElement(form, "email", 'input', 'text', 'EmailPlaceholder');
        addFormElement(form, "password", 'input', 'password', 'Password');
        setControlsState( prevState => ({ controls: form}));

    }, []);

    let addFormElement = (form, name, type, inputType, placeholderText) => {

        form[name] = {
            elementType: type,
            elementConfig: {
                type: inputType,
                placeholder: placeholderText
            },
            value: '',
            validationRules: {
                required: true
            },
            isValid: false,
            touched: false
        };
    }

    const onAuthSuccess = (response, authData) => {

        saveLoginTokens(response, authData);
        setLoadingState(false);
        setAuthSuccessState(true);
        localStorage.setItem("test", "hi there!");

    }

    const onAuthFail = () => {


    }




    const submitHandler = (event) => {
        
        event.preventDefault(); //prevents reloading of the page
    
        let authData = {
            username: controlsState.controls.email.value,
            password: controlsState.controls.password.value
        };
        
        setLoadingState(true);

        axios.post('/login', authData)
        .then( response => {
            onAuthSuccess(response, authData);
        })
        .catch( err => { 
            console.log(err);});
            onAuthFail();
            resetLoadingStateAfterTimeout();
    };


    const resetLoadingStateAfterTimeout = () => {
        resetLoadingTimer.current = setTimeout(() => {
          setLoadingState(false);
          resetLoadingTimer.current = null;
        }, 1000);
        
    }

    const inputChangedHandler = (event, controlName) => {
        const validationRules = controlsState.controls[controlName].validationRules;
        const updatedControls = {
            ...controlsState.controls,
            [controlName] : {
                ...controlsState.controls[controlName],
                value: event.target.value,
                isValid: validateInput(event.target.value, validationRules)
            }
        }
        setControlsState(prevState => ({controls: updatedControls}));
    }

    const validateInput = (value, rules) => {

    }

    const formElementsArray = [];
    for( let key in controlsState.controls){
        formElementsArray.push({
            id: key,
            config: controlsState.controls[key]
        })
    }


    let form = formElementsArray.map(  el => (
        <Input  class=""
           key = {el.id}
           elementType={el.config.elementType} 
           elementConfig={el.config.elementConfig}
           changed={(event) => inputChangedHandler(event, el.id)}
           value={el.config.value} 
           valid={el.config.isValid || !el.config.touched} />       
    ));

    let loading = isLoadingState === true ? <LoadingAnimation/> : null;
    

    if(authSuccessState === true){
        return(
            <Redirect to= "/"></Redirect>
        );

    };


           
    return (

        <div className="auth">            
            <Card>
                <h2> You are not authenticated!</h2>
                <p>Please log in to continue.</p>

                <form onSubmit={submitHandler}>
                    {form}
                    <Button type="Success" disabled={isLoadingState} >Submit</Button>
                    <br></br>
                    {loading}
                </form>

            </Card>

        </div>
    );
};

export default Login;