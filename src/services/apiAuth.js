import axios from 'axios';
import {AsyncStorage} from 'react-native';

const _apiAuth = axios.create({
    baseURL: 'http://localhost:3000'
});

_apiAuth.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export const apiAuth = _apiAuth;