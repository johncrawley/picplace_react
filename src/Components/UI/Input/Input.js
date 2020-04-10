import React from 'react';
import styles from './Input.module.css';

const input = (props) => {
    
    
    let validationError = null;
    const inputStylesArray = [styles.InputElement];



    if(!props.valid){
        inputStylesArray.push(styles.Invalid);
        validationError = <p className={styles.ValidationError}>Please Enter a valid value!</p>
    }
    const inputStyles = inputStylesArray.join(' ');
    const inputType = props.type == null ? "input" : props.type;

    let  inputElement = <input className={inputStyles}
                                 type = {inputType}
                                 placeholder ={props.placeholder}
                                 onChange={props.changed}
                                 value={props.value}/>;


    return ( 
    <div className={styles.Input}>
        <label className={styles.Label}>{props.label} </label>
         {inputElement}
        {validationError}
        <br></br>
    </div>
)
    
};


export default input;