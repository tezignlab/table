import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from '../../components/SafeAreaView';
import { RootTabScreenProps } from '../../navigation/types';
import tailwind from 'tailwind-rn';
import { ProjectList } from "../../components/project/ProjectList";
import { SearchIcon } from 'react-native-heroicons/outline';
import { LocaleContext } from '../../context/LocaleContext';


export function SearchScreen({ navigation, route }: RootTabScreenProps<'Search'>) {
    const [showCancel, setSHowCancel] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [inputValue, setInputValue] = useState('');
    const { translate } = React.useContext(LocaleContext)

    const refTextInput = useRef<TextInput>(null);

    useEffect(() => {
        setInputValue(route.params.keyword)
        setKeyword(route.params.keyword)
    }, [route.params.keyword])

    return (
        <View style={tailwind(`w-full h-full bg-white`)}>
            <SafeAreaView style={tailwind(`w-full h-full`)}>
                <View style={tailwind(`flex-row justify-between items-center m-2`)}>
                    <View style={[tailwind(`flex-grow rounded-full bg-gray-100`)]}>
                        <View style={tailwind(`flex-row items-center h-10`)}>
                            <SearchIcon size={20} style={tailwind(`ml-4 mr-2 text-gray-400`)} />
                            <TextInput
                                ref={refTextInput}
                                style={{ ...tailwind(`text-sm border-0 flex-auto mr-2`), lineHeight: 18 }}
                                placeholder={translate('search')}
                                value={inputValue}
                                onChangeText={setInputValue}
                                returnKeyType='search'
                                clearButtonMode='always'
                                onSubmitEditing={({ nativeEvent: { text } }) => setKeyword(text)}
                                onFocus={() => setSHowCancel(true)}
                                onBlur={() => setSHowCancel(false)}
                            />
                        </View>
                    </View>

                    {
                        showCancel && <TouchableOpacity onPressIn={() => refTextInput.current?.blur()} style={tailwind(`flex-none`)}>
                            <Text style={tailwind(`text-base font-medium ml-2`)}>取消</Text>
                        </TouchableOpacity>
                    }

                </View>
                {
                    inputValue.length > 0 ? <ProjectList mode='search' value={keyword} /> : <></>
                }
            </SafeAreaView>

        </View>

    );
}
