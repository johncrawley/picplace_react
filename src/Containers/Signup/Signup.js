import React, { useState, useEffect, Fragment } from 'react';

import axios from '../../axios';
import Input from '../../Components/UI/Input/Input';
import Card from '../../Components/UI/Card/Card';
import Button from '../../Components/UI/Button/Button';

import { postLoginRequest } from '../../Utils/AuthHandler';

const EMAIL_PATTERN = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const USERNAME = "username";
const EMAIL = "email";
const PASSWORD = "password";
const CONFIRM_PASSWORD = "confirmPassword";

const ERR = {
    PASSWORD_TOO_SHORT : "Password_too_short",
    PASSOWRD_NOT_ALPHANUMERIC : "Password_not_alphanumeric",
    PASSWORD_CONFIRM_DOESNT_MATCH : "Password_confirm_doesnt_match",
    USERNAME_NOT_ALPHANUMERIC : "username_not_alphanumeric",
    USERNAME_TOO_SHORT : "username_too_short",
    EMAIL_INCORRECT_FORMAT : "email_incorrect_format"
}

const PASSWORD_MIN_LENGTH = 10;
const USERNAME_MIN_LENGTH = 3;


const Signup = () => {

    const [formControls, setFormControls] = useState({});
    const [existingTimeout, setExistingTimeout] = useState(null);
    const [inputErrors, setInputErrors] = useState({});
    const [areFieldsValid, setAreFieldsValid] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [isWaitingForResponse, setWaitingForResponse] = useState(false);
    const [wasUserCreated, setWasUserCreated] = useState(false);
    const [hasLoginFailed, setLoginFailed] = useState(false);
    

    useEffect(() => {
        setupInputs();
        setupInputErrors();
    },[]);


    const setupInputs = () => {
        let formItems = [];
        const inputNames = [ USERNAME, EMAIL, PASSWORD, CONFIRM_PASSWORD];
        for(let i in inputNames){
            let name = inputNames[i];
            formItems[name] = {value: '', isValid: true, isTouched: false};
        }
        setFormControls(prev => formItems);
    }


    const setupInputErrors = () => {
        let errors = {
            [ERR.PASSWORD_TOO_SHORT]            :{  text: 'The password must be at least ' + PASSWORD_MIN_LENGTH + ' characters long' },
            [ERR.PASSOWRD_NOT_ALPHANUMERIC]     :{  text: 'The password can only contain numbers, letters and underscores' },
            [ERR.PASSWORD_CONFIRM_DOESNT_MATCH] :{  text: 'The passwords do not match' },
            [ERR.USERNAME_NOT_ALPHANUMERIC]     :{  text: 'The user name can only contain numbers, letters and underscores' },
            [ERR.USERNAME_TOO_SHORT]            :{  text: 'The user name must be at least ' + USERNAME_MIN_LENGTH + ' characters long' },
            [ERR.EMAIL_INCORRECT_FORMAT]        :{  text: 'The email address is not valid' } 
        };
        for(let key in errors){
            errors[key].isVisible = false;
        }
        setInputErrors(errors);
    }


    const inputChangedHandler = (event, config) => {
        let updatedValue = event.target.value;
        let controlName = config.controlName;
        let isValid = validate(updatedValue, config.validationRules, controlName);
        updateState(controlName, updatedValue, isValid);
        if(isValid){
            runMiscFunctions(config.miscFunctions, updatedValue);
        }
    }


    const runMiscFunctions = (miscFunctions, updatedValue) => {
        for( let i in miscFunctions){
            miscFunctions[i](updatedValue);
        }
    }


    const updateState = (controlName, updatedValue, isValid) => {

        const updatedControls = {
            ...formControls,
            [controlName] : {
                ...formControls[controlName],
                value: updatedValue,
                isValid: isValid,
                isTouched: true
            }
        };
        setFormControls(prevState => (updatedControls));
    }


    const validate = (value, rules, controlName) => {
        let isValid = true;
        for( let i in rules){
            let isCurrentRuleValid = rules[i](value, controlName);
            isValid = isCurrentRuleValid && isValid;
        }
        setAreFieldsValid(isValid);
        return isValid;
    }


    const queryServerForValidUsername = (currentValue) => {
      
        if(existingTimeout != null){
            clearTimeout(existingTimeout);
        }
        let timeout = setTimeout(() =>{checkIfUsernameExists(currentValue);}, 2000);
        setExistingTimeout(timeout);
    }


    const checkIfUsernameExists = (username) => {
        axios.get('/available?username='+ username)
        .then( response => handleUsernameAvailable(response.status))
        .catch(error => handleUsernamePresentError(error.response.status));
    }


    const handleUsernamePresentError = (status) => {
        setIsUsernameAvailable(false);
        console.log("Username present error: " + status);
    }


    const handleUsernameAvailable = (statusCode) => {
        setIsUsernameAvailable(true);
        console.log("Username is available! "  + statusCode);
    }


    const submitUserAddRequest = () => {    
        let form =  {
            username: formControls.username.value,
            email: formControls.email.value,
            password: formControls.password.value
        };
        console.log("SubmitUserAddRequest() form to send: " + JSON.stringify(form));
        setWaitingForResponse(true);
       axios.post('/signup', form).then(response => handleUserCreatedResponse(response));
    }

    const handleUserCreatedResponse = (response) => {
        setWaitingForResponse(false);
        const authData = {
            username: formControls[USERNAME].value,
            password: formControls[PASSWORD].value
        }
        postLoginRequest(authData, onLoginSuccess, onLoginFail);
    }

    const onLoginFail = () => {
        setLoginFailed(true);
    }

    const onLoginSuccess = () => {
        setWasUserCreated(true);
    }
    
    const displayInputErrorIfNot = (condition, errorKey) => {

        setInputErrors( prev => ({
            ...prev,
            [errorKey] : {
                isVisible : !condition,
                text : prev[errorKey].text
            }
        }));
    }
        

    const isPasswordMinLength = (value) => {
        return isMinLength(value, PASSWORD_MIN_LENGTH, ERR.PASSWORD_TOO_SHORT );
    }


    const isMinLength = (value, minLength, errCode) => {
        let isMinimumLength = value.length >= minLength;
        displayInputErrorIfNot(isMinimumLength, errCode);
        return isMinimumLength;
    }


    const isUsernameMinLength = (value) => {
        return isMinLength(value, USERNAME_MIN_LENGTH, ERR.USERNAME_TOO_SHORT );
    }


    const isPasswordAlphaNumeric = (value) => {
        return isAlphaNumeric(value, ERR.PASSOWRD_NOT_ALPHANUMERIC);
    }


    const isAlphaNumeric = (str, errCode) => {
        var patt = new RegExp(/\W/g);
        let alphaNumeric = !(patt.test(str));
        displayInputErrorIfNot(alphaNumeric, errCode);
        return alphaNumeric;
    }


    const isUsernameAlphaNumeric = (value) => {
        return isAlphaNumeric(value, ERR.USERNAME_NOT_ALPHANUMERIC);
    }


    const arePasswordsTheSame = (updatedValue, controlName) => {
        if(!formControls[CONFIRM_PASSWORD].isTouched){
            return true;
        }        
        let otherFieldName = controlName === CONFIRM_PASSWORD ? PASSWORD : CONFIRM_PASSWORD;
        let otherPasswordFieldValue = formControls[otherFieldName].value;
        let arePasswordsEqual = updatedValue === otherPasswordFieldValue;
        displayInputErrorIfNot(arePasswordsEqual, ERR.PASSWORD_CONFIRM_DOESNT_MATCH);

        if(!arePasswordsEqual){
            formControls[CONFIRM_PASSWORD].isValid = false;
        }
        return arePasswordsEqual;
    }
    

    const isReadyToSendRequest = () => {
        return areFieldsValid && isUsernameAvailable && isEveryFieldTouched();
    }


    const isEveryFieldTouched = () => {
        return Object.keys(formControls).map(key => formControls[key].isTouched).reduce((total, current) => total && current, true);
    }


    const setConfirmPasswordFieldTouched = () => {
        formControls[CONFIRM_PASSWORD].isTouched = true;
    }


    const isValid = (controlName) => {
        if(formControls[controlName] === undefined){
            return true;
        }
        return formControls[controlName].isValid;
    }


    const isErrorShown = (key) => {
        return inputErrors[key].isVisible;
    }


    const errorMessages = Object.keys(inputErrors)
                                .filter(isErrorShown)
                                .map( (err, count) => <p key={"error_" + count}>
                                                         {inputErrors[err].text}
                                                     </p>);


    const isEmailFormatCorrect = (value) => {
        let isEmailValid = EMAIL_PATTERN.test(value);
        displayInputErrorIfNot(isEmailValid, ERR.EMAIL_INCORRECT_FORMAT);
        return isEmailValid;
    }

    let loadingMessage = isWaitingForResponse ?  <h3>...Creating User</h3> : null;

    let userCreated = null;
    
    if(wasUserCreated){
        let message = hasLoginFailed ? "Your account was created but there is an error with the server and you cannot currently sign in. Please try again later":
            "Your user account has been registered! Click here to upload some pictures.";
        userCreated = <h3>{message}</h3>
    }



    const wasRequestProcessed = isWaitingForResponse || wasUserCreated;


    let form = wasRequestProcessed ? null : <Fragment>
                    <h2>Create an Account</h2>

                    <Input  
                        label="User Name"
                        maxLength="16"
                        valid={isValid(USERNAME)}
                        changed={(event) => inputChangedHandler(event, {
                                                controlName: USERNAME,
                                                validationRules: [ isUsernameAlphaNumeric, isUsernameMinLength ],
                                                miscFunctions : [ queryServerForValidUsername ]
                                            })}/> 
                    <Input  
                            label="Email"
                            maxLength = "42"
                            valid={isValid(EMAIL)}
                            changed={(event) => inputChangedHandler(event, {
                                                    controlName: EMAIL,
                                                    validationRules: [ isEmailFormatCorrect ]
                                                })}/> 
                    <Input 
                        label="Password"
                        type="password"
                        maxLength = "22"
                        valid={isValid(PASSWORD)}
                        changed={(event) => inputChangedHandler(event, {
                                                controlName: PASSWORD,
                                                validationRules: [ isPasswordMinLength, isPasswordAlphaNumeric],
                                                miscFunctions: [ arePasswordsTheSame ]
                                                })} /> 
                    <Input 
                        label="Confirm Password"
                        type="password"
                        maxLength = "22"
                        onClick={setConfirmPasswordFieldTouched}
                        valid={isValid(CONFIRM_PASSWORD)}
                        changed={(event) => inputChangedHandler(event, {
                                                controlName: CONFIRM_PASSWORD,
                                                validationRules: [ arePasswordsTheSame ]
                                                })}/> 
                    {errorMessages}
                    <Button  click={submitUserAddRequest} 
                                disabled={!isReadyToSendRequest()}>Create Account</Button>
                 </Fragment>;



    return (
            <div>
                <Card>
                    {form}
                    {loadingMessage}
                    {userCreated}
                    </Card>
            </div>

    );

}

export default Signup;
