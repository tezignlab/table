import {navigate} from "../navigation/root";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from "react-native";
import Constants from "expo-constants";

const { manifest } = Constants;

const debugHost = manifest?.debuggerHost ? manifest?.debuggerHost.split(':')[0] : '127.0.0.1'

export const HOST = `http://${debugHost}:8080`;

const checkUnauthorized = (resp: Response) => {
    if (resp.status === 401) {
        AsyncStorage.removeItem('access_token').then(() => navigate('Login', undefined))
    }
}

const http = {

    getAll(url: string) {
        return AsyncStorage.getItem('access_token').then(token => fetch(HOST + url, {
            headers: {
                Authorization: token != null ? `Bearer ${token}` : ''
            },
        }).then(resp => {
            checkUnauthorized(resp);
            return resp.json();
        }).then(data => {
            if (data.code === 0) {
                return Promise.resolve(data);
            }
            return Promise.reject(data.message);
        }))
    },

    getText(url: string) {
        return AsyncStorage.getItem('access_token').then(token => fetch(HOST + url, {
            headers: {
                Authorization: token != null ? `Bearer ${token}` : ''
            },
        }).then(resp => {
            checkUnauthorized(resp);
            return resp.text();
        }).then(data => Promise.resolve(data)))
    },

    get(url: string, autoLogin: boolean = true) {
        return AsyncStorage.getItem('access_token').then(token => fetch(HOST + url, {
            headers: {
                Authorization: token != null ? `Bearer ${token}` : ''
            },
        }).then(resp => {
            autoLogin && checkUnauthorized(resp);
            return resp.json();
        }).then(data => {
            if (data.code === 0) {
                return Promise.resolve(data.data);
            }
            return Promise.reject(data.message);
        }))
    },

    post(url: string, body?: any) {
        return AsyncStorage.getItem('access_token').then(token => fetch(HOST + url, {
            method: 'POST',
            headers: {
                Authorization: token != null ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: body != null ? JSON.stringify(body) : ''
        }).then(resp => {
            checkUnauthorized(resp);
            return resp.json();
        }).then(data => {
            if (data.code === 0) {
                return Promise.resolve(data.data);
            }
            return Promise.reject(data.message || data);
        }))
    },

    put(url: string, body?: any) {
        return AsyncStorage.getItem('access_token').then(token => fetch(HOST + url, {
            method: 'PUT',
            headers: {
                Authorization: token != null ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: body != null ? JSON.stringify(body) : ''
        }).then(resp => {
            checkUnauthorized(resp);
            return resp.json();
        }).then(data => {
            if (data.code === 0) {
                return Promise.resolve(data.data);
            }
            return Promise.reject(data.message);
        }))
    },

    delete(url: string, body?: any) {
        return AsyncStorage.getItem('access_token').then(token => fetch(HOST + url, {
            method: 'DELETE',
            headers: {
                Authorization: token != null ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: body != null ? JSON.stringify(body) : ''
        }).then(resp => {
            checkUnauthorized(resp);
            return resp.json();
        }).then(data => {
            if (data.code === 0) {
                return Promise.resolve(data.data);
            }
            return Promise.reject(data.message);
        }))
    },

    upload(uri: string, type?: string) {
        const formData = new FormData();
        const fileType = type ? {type} : {}
        formData.append('file', {
            // @ts-ignore
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            name: uri.split('/').pop(),
            ...fileType
        });
        return AsyncStorage.getItem('access_token').then(token => fetch(HOST + '/api/nd/v1/file/upload', {
            method: 'POST',
            headers: {
                Authorization: token != null ? `Bearer ${token}` : ''
            },
            body: formData
        }).then(resp => {
            checkUnauthorized(resp);
            return resp.json();
        }).then(data => {
            if (data.code === 0) {
                return Promise.resolve(data.data);
            }
            return Promise.reject(data.message || data);
        }))
    },

};

export default http;
