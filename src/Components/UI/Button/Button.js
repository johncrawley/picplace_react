
import React from 'react';
import styles from './Button.module.css';

const button = (props) => {



    return (

        <button 
            className={[styles.Button, styles[props.type]].join(' ')} 
            disabled={props.disabled}
            onClick={props.click}>{props.children}</button>

    );
}

export default button;