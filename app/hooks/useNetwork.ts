import * as React from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useNetwork() {
    const [isNetworkAvailable, setIsNetworkAvailable] = React.useState(false);

    // App 启动时，检查网络可用性
    React.useEffect(() => {
        // 监听网络状态
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsNetworkAvailable(state.isConnected || false)
            state.isConnected && unsubscribe()
        });

        // 测试网络可用性
        NetInfo.fetch().then(state => {
            setIsNetworkAvailable(state.isConnected || false)
        });

    }, []);

    return isNetworkAvailable;

}
