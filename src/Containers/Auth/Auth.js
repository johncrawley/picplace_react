import React, { useState, useEffect, useRef } from 'react';
import axios from '../../axios';
import  { Redirect } from 'react-router-dom';


import Card from '../../Components/UI/Card/Card';
import Input from '../../Components/UI/Input/Input';
import Button from '../../Components/UI/Button/Button';
import LoadingAnimation from '../../Components/UI/LoadingAnimation/LoadingAnimation';
import TopNav from '../../Components/UI/TopNav/TopNav';


const Auth = props => {

    const [controlsState, setControlsState] = useState({controls: {}});
    const [authSuccessState, setAuthSuccessState] = useState(false);
    const [isLoadingState, setLoadingState] = useState(false);
    const resetLoadingTimer = useRef(null);

    useEffect( () => {

        console.log("Entered useEffect()");
        let form = controlsState.controls;
        addFormElement(form, "email", 'input', 'text', 'EmailPlaceholder');
        addFormElement(form, "password", 'input', 'password', 'Password');
        console.log("Entered useEffect in Auth.js");
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

        storeTokens(response, authData);
        setLoadingState(false);
        setAuthSuccessState(true);

    }

    const onAuthFail = () => {


    }

    const getExpirationDate = (expiresIn) => {
        expiresIn = expiresIn * 1;
        if(expiresIn === 0){
            expiresIn = 1_000_000;
        }
        const expiresInSeconds = expiresIn * 1000;
        const now = new Date().getTime();
        return new Date( now + expiresInSeconds);
    };



    const storeTokens = ( response, authData ) => {
        localStorage.setItem('jwtToken', response.headers.authorization);
        localStorage.setItem('expirationDate', getExpirationDate(response.headers.expires));
        localStorage.setItem('userId', authData.username);
    }


    const submitHandler = (event) => {
        
        event.preventDefault(); //prevents reloading of the page
    
        let authData = {
            username: controlsState.controls.email.value,
            password: controlsState.controls.password.value
        };
        console.log("About to set loading state to true!");
        setLoadingState(true);
        console.log("Loading state after set = " + isLoadingState);
        axios.post('/login', authData)
        .then( response => {
            onAuthSuccess(response, authData);
        })
        .catch( err => { 
            console.log("ERROR sending login request:");
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
            <TopNav/>
            <br></br>
            
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

export default Auth;