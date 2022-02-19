import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export function navigate(name: keyof RootStackParamList, params: RootStackParamList[keyof RootStackParamList]) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
