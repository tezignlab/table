/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TCollection } from "../hooks/useCollections";
import { TInspiration } from '../hooks/useInspirations';


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }
}

export type HomeStackParamList = {
    Recommend: undefined;
    Latest: undefined;
}

export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
    Modal: undefined;
    NotFound: undefined;
    ProjectDetail: {
        id: string;
    };
    Login: undefined;
    Register: undefined;
    Settings: undefined;
    Language: undefined;
    Likes: undefined;
    Collections: {
        value: string;
    };
    CollectedProjects: {
        collection: TCollection;
        n: number;
    };
    CollectionCreate: undefined;
    Report: {
        header: string;
        title: string;
    }
    Views: undefined;
    Inspiration: undefined;
    InspirationCreate: {
        inspiration: TInspiration | null;
    };
    About: undefined;
    PrivacyPolicy: undefined;
    TermsOfService: undefined;
};


export type RootTabParamList = {
    Home: NavigatorScreenParams<HomeStackParamList> | undefined;
    Search: {
        keyword: string;
    };
    InspirationCreate: {
        inspiration: TInspiration | null;
    };
    Mine: {
        login: boolean;
    };
    NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof (RootStackParamList)> = NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabScreenProps<Screen extends keyof (RootTabParamList)> = CompositeScreenProps<BottomTabScreenProps<RootTabParamList, Screen>, NativeStackScreenProps<RootStackParamList>>;
