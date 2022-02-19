import { createContext } from 'react';


type TUserContext = {
    isLogin: boolean;
    user: any;
    setIsLogin: (value: boolean) => void;
    setUser: (value: any) => void;
    refreshIdentity: () => void;
}

export const UserContext = createContext<TUserContext>({
    isLogin: false,
    user: {},
    setIsLogin: (value: boolean) => {},
    setUser: (value: any) => {},
    refreshIdentity: () => {}
});