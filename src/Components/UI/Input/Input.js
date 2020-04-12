import React from 'react';
import styles from './Input.module.css';

const input = (props) => {
    
    const inputStylesArray = [styles.InputElement];

    if(!props.valid){
        inputStylesArray.push(styles.Invalid);
    }
    const inputStyles = inputStylesArray.join(' ');
    const inputType = props.type == null ? "input" : props.type;

    let  inputElement = <input className={inputStyles}
                                onClick = {props.onClick}
                                 type = {inputType}
                                 placeholder ={props.placeholder}
                                 onChange={props.changed}
                                 value={props.value}/>;


    return ( 
    <div className={styles.Input}>
        <label className={styles.Label}>{props.label} </label>
         {inputElement}
        <br></br>
    </div>
)
    
};


export default input;