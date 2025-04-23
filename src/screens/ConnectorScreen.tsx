import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QuilttBankLink } from '../components/QuilttBankLink';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { QuilttButton, ConnectorSDKCallbackMetadata } from '@quiltt/react';
import { QuilttConnector } from '@quiltt/react-native';



type ConnectorScreenProps = {
  navigation: NavigationProp<any, any>
}

export const ConnectorScreen = ({ navigation }: ConnectorScreenProps) => {
  return (
    <QuilttConnector
      connectorId="fa75kvbjwe"
      oauthRedirectUrl="https://auth.expo.io/@RewardsFeatureMVP/rewardsfeaturemvp"
      // See the JavaScript API for the full list of available callbacks
      onExitSuccess={(metadata: ConnectorSDKCallbackMetadata) => {
        console.log('Successfully connected ' + metadata.connectionId)
        navigation.navigate('Home')
      }}
      onExitAbort={() => navigation.navigate('Home')}
    />
  )
}