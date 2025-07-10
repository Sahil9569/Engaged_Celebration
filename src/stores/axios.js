// axios.js (or any other suitable name)
import axios from 'axios';
import BASE_URL from '@/stores/myVar';
axios.defaults.baseURL = BASE_URL

const instance = axios.create({withCredentials: true});

instance.interceptors.request.use(
(config) => {
// Add your logic here to get the value from local storage
const token = localStorage.getItem('access_token');
// Add the token to the request headers
if (token) { config.headers.Authorization = `Bearer ${token}`; }
return config;
},
(error) => { return Promise.reject(error); });
export default instance;