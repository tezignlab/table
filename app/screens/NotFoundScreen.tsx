import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'tailwind-rn';
import { LocaleContext } from '../context/LocaleContext';

import { RootStackScreenProps } from '../navigation/types';

export function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
  const { translate } = React.useContext(LocaleContext)
  
  return (
    <View style={tailwind(`w-full h-full bg-white p-4 justify-center items-center`)}>
      <Text style={tailwind(`font-bold text-lg`)}>{translate('pageNotFound')}</Text>
      <TouchableOpacity onPress={() => navigation.replace('Root')} style={tailwind(`mt-4`)}>
        <Text style={tailwind(`text-blue-500 text-base`)}>{translate('gobackHome')}</Text>
      </TouchableOpacity>
    </View>
  );
}
