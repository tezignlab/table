import * as React from 'react';
import {Text, TextInput} from './Themed';
import {KeyboardTypeOptions, View} from 'react-native';
import tailwind from "tailwind-rn";


interface IProps {
    errorMsg?: string;
    handleChange: ((text: string) => void);
    name: string;
    value: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    numberOfLines?: number;
    maxLength?: number;
    textContentType?:
        | 'none'
        | 'URL'
        | 'addressCity'
        | 'addressCityAndState'
        | 'addressState'
        | 'countryName'
        | 'creditCardNumber'
        | 'emailAddress'
        | 'familyName'
        | 'fullStreetAddress'
        | 'givenName'
        | 'jobTitle'
        | 'location'
        | 'middleName'
        | 'name'
        | 'namePrefix'
        | 'nameSuffix'
        | 'nickname'
        | 'organizationName'
        | 'postalCode'
        | 'streetAddressLine1'
        | 'streetAddressLine2'
        | 'sublocality'
        | 'telephoneNumber'
        | 'username'
        | 'password'
        | 'newPassword'
        | 'oneTimeCode';
}

export function CTextInput({name, placeholder, value, errorMsg, handleChange, secureTextEntry = false, textContentType = 'none', keyboardType = 'default', numberOfLines = 1, maxLength}: IProps) {
    const minHeight = {minHeight: 24 * numberOfLines}
    return (
        <View style={tailwind(`mt-4`)}>
            <View style={tailwind(`flex flex-row items-center justify-between`)}>
                <Text style={tailwind(`font-medium text-sm mb-1 ml-1`)}>{name}</Text>
                {errorMsg && <Text style={tailwind(`mt-1 ml-1 text-red-500 font-medium text-xs`)}>{errorMsg}</Text>}
            </View>
            <TextInput
                style={{...tailwind(`w-full px-4 py-2 rounded-md`), ...minHeight}}
                numberOfLines={numberOfLines}
                multiline={numberOfLines > 1}
                onChangeText={handleChange}
                value={value}
                placeholder={placeholder}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                textContentType={textContentType}
                maxLength={maxLength}
            />
        </View>
    )
}
