import {useContext, useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/core";
import {UserContext} from "../context/UserContext";
import { CommonActions } from '@react-navigation/native';

const EMPTY_USER = {
    id: '',
    username: '',
    nickname: '',
    avatar: 'https://ai.tezign.com/static/naodong/app-icon.png'
}

export default function useIdentity() {

    const {setIsLogin, setUser, refreshIdentity} = useContext(UserContext)
    const navigation = useNavigation();

    function login(access_token: string, token_expire: string) {
        AsyncStorage.setItem('access_token', access_token).then(() => {
            AsyncStorage.setItem('token_expire', token_expire).then(() => {
                refreshIdentity()
                setIsLogin(true)
                navigation.goBack()
            })
        })
    }

    function logout() {
        AsyncStorage.removeItem('access_token').then(() => {
            AsyncStorage.removeItem('token_expire').then(() => {
                setIsLogin(false)
                setUser(EMPTY_USER)
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'Home',
                        params: {},
                    })
                );
            })
        })
    }

    useEffect(() => {
        refreshIdentity()
    }, [])

    function goLogin() {
        navigation.navigate('Login')
    }

    return {
        login,
        logout,
        goLogin,
    }

}