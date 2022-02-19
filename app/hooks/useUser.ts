import {useEffect, useState} from 'react';
import http from "../services/http";

const EMPTY_USER = {
    id: '',
    username: '',
    nickname: '',
    avatar: 'https://ai.tezign.com/static/naodong/app-icon.png'
}

export interface IUser {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
    email?: string;
    location?: string;
    bio?: string;
}

export default function useUser() {

    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState<IUser>(EMPTY_USER);

    function refreshIdentity() {
        http.get(`/api/v1/user`, false).then(data => {
            setUser(data)
            setIsLogin(true)
        }).catch(() => setIsLogin(false));
    }

    useEffect(() => {
        refreshIdentity()
    }, [])

    return {
        isLogin,
        user,
        setIsLogin,
        setUser,
        refreshIdentity,
    }

}