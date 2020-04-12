import React, { useState, useEffect } from 'react';

import axios from '../../axios';
import Input from '../../Components/UI/Input/Input';
import Card from '../../Components/UI/Card/Card';
import Button from '../../Components/UI/Button/Button';


const Signup = () => {

    const [formControls, setFormControls] = useState({});
    const [existingTimeout, setExistingTimeout] = useState(null);
    const [inputErrors, setInputErrors] = useState({});
    
    const USERNAME = "username";
    const EMAIL = "email";
    const PASSWORD = "password";
    const CONFIRM_PASSWORD = "confirmPassword";

    const ERR_PASSWORD_TOO_SHORT = "Password_too_short";
    const ERR_PASSOWRD_NOT_ALPHANUMERIC = "Password_not_alphanumeric";
    const ERR_PASSWORD_CONFIRM_DOESNT_MATCH = "Password_confirm_doesnt_match";
    
    const PASSWORD_MIN_LENGTH = 10;


    useEffect(() => {
        setupInputs();
        setupInputErrors();
    },[]);


    const setupInputs = () => {
        let formItems = [];
        const inputNames = [ USERNAME, EMAIL, PASSWORD, CONFIRM_PASSWORD];
        for(let i in inputNames){
            let name = inputNames[i];
            formItems[name] = {value: '', valid: true, touched: false};
        }
        setFormControls(prev => formItems);
    }


    const setupInputErrors = () => {

        let errors = {
            [ERR_PASSWORD_TOO_SHORT] : {
                isVisible : false,
                text : 'The password must be at least ' + PASSWORD_MIN_LENGTH + ' characters long'
            },
            [ERR_PASSOWRD_NOT_ALPHANUMERIC] :{
                isVisible : false,
                text: 'The password can only contain numbers, letters and underscores'
            },
            [ERR_PASSWORD_CONFIRM_DOESNT_MATCH] :{
                isVisible : false,
                text: 'The passwords do not match'
            }
        };
        setInputErrors(errors);
    }


    const usernameChangedHandler = (event, controlName) => {
        let currentValue = event.target.value;
        inputChangedHandler(event, controlName);

        if(isNonAlphaNumeric(currentValue)){
            console.log("username is not valid!");
            return;
        }
        queryServerForValidUsername(currentValue);
    }


    const inputChangedHandler = (event, controlName, validationRules) => {
        const updatedControls = {
            ...formControls,
            [controlName] : {
                ...formControls[controlName],
                value: event.target.value,
                isValid: validateInput(event.target.value, validationRules, controlName)
            }
        };
        setFormControls(prevState => (updatedControls));
    }


    const isNonAlphaNumeric = (str) => {
        var patt = new RegExp(/\W/g);
        return patt.test(str); 
    }


    const validateInput = (value, rules, controlName) => {
        let isValid = true;
        for( let i in rules){
            let isCurrentRuleValid = !rules[i](value, controlName);
            isValid = isCurrentRuleValid && isValid;
        }
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
        console.log("Username present error: " + status);
    }


    const handleUsernameAvailable = (statusCode) => {
        console.log("Username is available! "  + statusCode);
    }


    const submitUserAddRequest = () => {    
        let form =  {
            username: formControls.username.value,
            email: formControls.email.value,
            password: formControls.password.value
        };
        axios.post('/signup', form).then(response => console.log(response.data));
    }

    
    const displayInputErrorIf = (isDisplayed, errorKey) => {

        setInputErrors( prev => ({
            ...prev,
            [errorKey] : {
                isVisible : isDisplayed,
                text : prev[errorKey].text
            }
        }));
    }
        

    const isPasswordTooShort = (value) => {
        let isTooShort = value.length < PASSWORD_MIN_LENGTH;
        displayInputErrorIf(isTooShort, ERR_PASSWORD_TOO_SHORT);
        return isTooShort;
    }

    const isPasswordNonAlphaNumeric = (value) => {
        let isNonAlpha = isNonAlphaNumeric(value);
        displayInputErrorIf(isNonAlpha, ERR_PASSOWRD_NOT_ALPHANUMERIC);
        return isNonAlpha;
    }

    const doPasswordsDiffer = (value, controlName) => {
        if(!formControls[CONFIRM_PASSWORD].touched){
            return false;
        }        
        let otherFieldName = controlName === PASSWORD ? CONFIRM_PASSWORD : PASSWORD;
        let otherPasswordFieldValue = formControls[otherFieldName].value;
        let passwordsDiffer = value !== otherPasswordFieldValue;
        displayInputErrorIf(passwordsDiffer, ERR_PASSWORD_CONFIRM_DOESNT_MATCH);

        return passwordsDiffer;
    }



    const isDataValid = () => {

    }

    const setConfirmPasswordFieldTouched = () => {
        formControls[CONFIRM_PASSWORD].touched = true;
    }




    const isErrorShown = (key) => {

        return inputErrors[key].isVisible;

    }

    const errorMessages = Object.keys(inputErrors).filter(isErrorShown).map( err => <p> {inputErrors[err].text} </p>);


// valid={el.config.isValid || !el.config.touched} /> 
    return (
            <div>
                <Card>
                    <h2>Create an Account</h2>

                    <Input  
                        label="User Name"
                        placeholder='Put'
                        changed={(event) => usernameChangedHandler(event, USERNAME)}
                        valid="true" /> 

                    <Input  
                            label="Email"
                            placeholder='Put'
                            changed={(event) => inputChangedHandler(event, EMAIL)}
                            valid="true" /> 

                    <Input 
                        label="Password"
                        type="password"
                        placeholder='Put'
                        changed={(event) => inputChangedHandler(event, PASSWORD, [ isPasswordTooShort, isPasswordNonAlphaNumeric, doPasswordsDiffer])}
                        valid="true" /> 

                    <Input 
                        label="Confirm Password"
                        type="password"
                        placeholder='Put'
                        onClick={setConfirmPasswordFieldTouched}
                        changed={(event) => inputChangedHandler(event, CONFIRM_PASSWORD, [ doPasswordsDiffer ])}
                        valid={false} /> 

                    {errorMessages}


                    <button onClick={submitUserAddRequest} disabled={!isDataValid}>send</button>
                </Card>
            </div>

    );

}

export default Signup;
