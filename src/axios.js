import axios from 'axios';
import { getAuthToken } from './Utils/AuthHandler';

const basePath = 'http://localhost:8090/svc';

const instance = axios.create( { 
    baseURL: basePath
});



export const axiosAuth = axios.create( {
    baseURL: basePath,
    headers : { 'Authorization' : getAuthToken() }
});




export default instance;