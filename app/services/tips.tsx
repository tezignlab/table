import {Alert} from "react-native";

const Tips = {

    dev() {
        Alert.alert(
            "正在开发中，敬请期待！",
            undefined,
            [
                {text: "确定"}
            ]
        )
    },

    success(title: string = '操作成功！', message?: string ) {
        Alert.alert(
            title,
            message,
            [
                {text: "确定"}
            ]
        )
    },

    successCallback(title: string, message: string, callback: () => void) {
        Alert.alert(
            title,
            message,
            [
                {text: "确定", onPress: callback}
            ]
        )
    },

    error(title: string, message: string) {
        Alert.alert(
            title,
            message,
            [
                {text: "确定"}
            ]
        )
    },

};

export default Tips;
