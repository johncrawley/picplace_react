import React, { useState, Fragment}  from 'react';


import Card from '../../Components/UI/Card/Card';
import Button from '../../Components/UI/Button/Button';
import { axiosAuth } from '../../axios';
import { logout } from '../../Utils/AuthHandler';
import { Redirect } from 'react-router';



const Register = () => {


    const [isLoggedOut, setLoggedOut] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const removeAccount = () =>{

        axiosAuth().post("/unregister").then(handleSuccess()).catch(err => setErrorMessage(err));
    }

    const setErrorMessage = (err) => {
        console.log("There was a problem: " + err.body);
        setErrMessage("There was a problem: " + err.body);
    }


    const handleSuccess = () => {
        console.log("Success!");
        logout();
        setLoggedOut(true);
    }

    
    let homeRedirect = isLoggedOut ? <Redirect to="/Welcome/" /> : null;
    let errorMessage = errMessage.length >0 ? <p> {errMessage}</p> : null;


    return(
       <Fragment>
            {homeRedirect}
            <Card>

                <h2>Are you sure you want to delete your account? All your photos stored on PicPlace will be permanently deleted. </h2>
                <Button click={removeAccount}> Yes </Button>
                {errorMessage}  
            </Card>
       </Fragment> 

    );


}

export default Register;