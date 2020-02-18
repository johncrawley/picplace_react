import React from 'react';
import styles from './LoadingAnimation.module.css';


const LoadingAnimation = () => {

    return ( 
        <div className={styles.lds_ring}>
            <div />
            <div />
            <div />
            <div />
        </div>
    );
}

export default LoadingAnimation;