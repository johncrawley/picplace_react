import React, { useState, useEffect, useRef } from 'react';

import axios from '../../axios';
import { addFormElement, buildForm} from '../../Utils/FormBuilder';

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
    
    const PASSWORD_MIN_LENGTH = 10;



    useEffect(() => {
        setupInputs();
        setupInputErrors();
    },[]);

    const setupInputs = () => {
        let formItems = [];
        const inputNames = [ USERNAME, EMAIL, PASSWORD, CONFIRM_PASSWORD];
        for(let name in inputNames){
            formItems[name] = {value: ''};
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


    const inputChangedHandler = (event, controlName) => {
        
       const validationRules = "";// formControls[controlName].validationRules;
        const updatedControls = {
            ...formControls,
            [controlName] : {
                ...formControls[controlName],
                value: event.target.value,
                isValid: validateInput(event.target.value, validationRules)
            }
        }
        setFormControls(prevState => (updatedControls));
    }

    const isNonAlphaNumeric = (str) => {
        var patt = new RegExp(/\W/g);
        return patt.test(str); 
    }




    const validateInput = (value, rules) => {
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



    const passwordChangedHandler = (event, controlName) => {
        inputChangedHandler(event, controlName);
        let value = event.target.value;
        let tooShort = isPasswordTooShort(value);
        console.log("Password too short? " + tooShort);
        
        displayInputError(ERR_PASSWORD_TOO_SHORT, tooShort);
        displayInputError(ERR_PASSOWRD_NOT_ALPHANUMERIC, isNonAlphaNumeric(value));

    }

    const displayInputError = (errorKey, isDisplayed) => {

        setInputErrors( prev => ({
            ...prev,
            [errorKey] : {
                isVisible : isDisplayed,
                text : prev[errorKey].text
            }
        }));



    }
    const displayInputErrorOld = (errorKey, isDisplayed) => {

        let updatedErrors = {
            ...inputErrors,
            [errorKey] : {
                isVisible : isDisplayed,
                text : inputErrors[errorKey].text
            }
        }
        setInputErrors( prev => updatedErrors);
    }



    

    const isPasswordTooShort = (value) => {
        console.log("isPasswordTooShort : " + value.length + " password min length: " + PASSWORD_MIN_LENGTH );
        return value.length < PASSWORD_MIN_LENGTH ? true : false;
    }



    const confirmPasswordChangedHandler = (event, controlName) => {

        inputChangedHandler(event, controlName);

        if(event.target.value !== formControls[PASSWORD].value ){
            console.log("Password needs to match!");
        }

    }

    const isDataValid = () => {

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
                            changed={(event) => passwordChangedHandler(event, PASSWORD)}
                            valid="true" /> 

                        <Input 
                            label="Confirm Password"
                            type="password"
                            placeholder='Put'
                            changed={(event) => confirmPasswordChangedHandler(event, CONFIRM_PASSWORD)}
                            valid="true" /> 
                    {errorMessages}


                    <button onClick={submitUserAddRequest} disabled={!isDataValid}>send</button>
                </Card>
            </div>

    );

}

export default Signup;
