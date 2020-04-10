import React from 'react';
import Input from '../Components/UI/Input/Input';


export const addFormElement = (form, name, type, inputType, placeholderText, labelText) => {

    form[name] = {
        elementType: type,
        label: labelText,
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


const validateInput = (value, rules) => {
}

const inputChangedHandler = (event, controlName, controls, setControlsFunction) => {
    const validationRules = controls[controlName].validationRules;
    const updatedControls = {
        ...controls,
        [controlName] : {
            ...controls[controlName],
            value: event.target.value,
            isValid: validateInput(event.target.value, validationRules)
        }
    }
    setControlsFunction(prevState => (updatedControls));
}


export const buildForm = (controls, setControlsFunction) => {

    const formElementsArray = [];
    for( let key in controls){
        formElementsArray.push({
            id: key,
            config: controls[key]
        })
    }
        

    let form = formElementsArray.map(  el => (
        <Input  class=""
           key={el.id}
           label={el.config.label}
           type={el.config.elementConfig.type} 
           elementConfig={el.config.elementConfig}
           changed={(event) => inputChangedHandler(event, el.id, controls, setControlsFunction)}
           value={el.config.value} 
           valid={el.config.isValid || !el.config.touched} />       
    ));

    return form;
}



