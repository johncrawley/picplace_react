
import { LOCAL_STORAGE_AUTH_KEY, AUTH_USER_ID, AUTH_JWT_TOKEN, AUTH_EXPIRATION_DATE } from '../consts';


export const saveLoginTokens = (response, authData) => {
    const auth_info = {
        [AUTH_JWT_TOKEN] : response.headers.authorization,
        [AUTH_EXPIRATION_DATE]: createExpirationDate(response.headers.expires),
        [AUTH_USER_ID]: authData.username
    };

    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(auth_info));
}


export const getAuth = () => {
    return localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
}


export const getAuthInfo = () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_AUTH_KEY));
}

export const getAuthToken = () => {
    if( isAuthenticated()){
        const authInfo = getAuthInfo();
        return authInfo[AUTH_JWT_TOKEN];
    }
    return null;
}


const createExpirationDate = (expiresIn) => {
    expiresIn = expiresIn * 1;
    if(expiresIn === 0){
        expiresIn = 1_000_000;
    }
    const expiresInSeconds = expiresIn * 1000;
    return new Date( getCurrentTime() + expiresInSeconds);
};

const getCurrentTime = () => {
    return new Date().getTime();
}


export const isAuthenticated = () => {
    const authInfo = getAuthInfo();

    if( doesTokenExist(authInfo) && isTokenFresh(authInfo)){
        return true;
    }
    deleteExistingToken();
    return false;
}


export const deleteExistingToken = () => {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
}

const doesTokenExist = (authInfo) => {
    return authInfo != null;
}

const retrieveExpirationDate = (authInfo) => {
    return new Date(authInfo[AUTH_EXPIRATION_DATE]);
}

const isTokenFresh = (authInfo) => {
    return retrieveExpirationDate(authInfo) > new Date();
}