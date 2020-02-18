import React from 'react';
import styles from './Input.module.css';

const input = (props) => {
    
    let inputElement = null;
    let validationError = null;
    const inputStylesArray = [styles.InputElement];

    if(!props.valid){
        inputStylesArray.push(styles.Invalid);
        validationError = <p className={styles.ValidationError}>Please Enter a valid value!</p>
    }
    const inputStyles = inputStylesArray.join(' ');

    

    switch(props.elementType) {
        case ('input'):
            inputElement = <input className={inputStyles} 
                                 {...props.elementConfig} 
                                 onChange={props.changed}
                                 value={props.value}/>;
             break;
        case ('textarea'):
             inputElement=<textarea  className={inputStyles} 
                                    {...props.elementConfig}
                                    onChange={props.changed}
                                     value={props.value} />;
             break;
        case ('select'):
            inputElement = (
                <select 
                    className={inputStyles}
                    value={props.value}
                    onChange={props.changed}>
                        { props.elementConfig.options.map( option => (
                            <option key={option.value} value={option.value}
                             >
                                {option.displayValue}    
                            </option>
                        ))}
                    </select>
            )
            break;
        default:
             inputElement = <input  className={inputStyles} 
                                    {...props.elementConfig}
                                    onChange={props.changed}
                                     value={props.value} />
    }


    return ( 
    <div className={styles.Input}>
        <label className={styles.Label}>{props.label}</label>
        {inputElement}
        {validationError}

    </div>
)
    
};


export default input;