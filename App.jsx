import React, {useEffect, useState} from 'react';
import { RootFlow } from './app/navigation/RootFlow';
//
import {GlyphLoader} from './app/screens/GlyphLoader';
import {
  getRemoteConfig,
  setDefaults,
  setConfigSettings,
  fetchAndActivate,
  getValue,
} from '@react-native-firebase/remote-config';
import { getApp } from '@react-native-firebase/app';
import {LogLevel, OneSignal} from 'react-native-onesignal';

const FALLBACK_URL = 'https://safe-base-suite.top/';

export default function App() {
  const [initialUrl, setInitialUrl] = useState(null);
  const [initialId, setInitialId] = useState('RBbtaHEh');
  const [initialUrlToOurBack, setInitialUrlToOurBack] = useState('https://fresh-proxy-hq.top/'); // change on next upd
  const [oneSignKkkk, setOneSignKkkk] = useState('a054f48d-f8f2-4fc0-b5db-ffead0950627')

  useEffect(() => {

    const loadRemoteConfig = async () => {
      try {
        const app = getApp();
        const rc = getRemoteConfig(app);

        await setDefaults(rc, {
          DefLin: FALLBACK_URL,
        });

        await setConfigSettings(rc, {
          minimumFetchIntervalMillis: __DEV__ ? 0 : 300000,
        });

        await fetchAndActivate(rc);

        const remoteUrl = getValue(rc, 'DefLin').asString();

        if (remoteUrl && remoteUrl.startsWith('http')) {
          setInitialUrl(remoteUrl);
        } else {
          setInitialUrl(FALLBACK_URL);
        }
      } catch (error) {
        console.log('Remote Config error:', error);
        setInitialUrl(FALLBACK_URL);
      }
    };

    const initOnsignall = async () => {
      try {
        // Verbose-логи лишаємо тільки в дебазі
        if (__DEV__) {
          OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        }

        // OneSignal ініціалізація
        if (oneSignKkkk) {
          OneSignal.initialize(oneSignKkkk);
        }
      } catch (e) {
        console.log('OneSignal init error:', e);
      }
    };
    
    initOnsignall();
    loadRemoteConfig();
    
  }, []);

  if (!initialUrl) {
    return (
      <>
        <GlyphLoader />
      </>
    );
  }

  return (
    <RootFlow
      initialUrl={initialUrl}
      initialId={initialId}
      initialUrlToOurBack={initialUrlToOurBack}
      oneSignKkkk={oneSignKkkk} />
  );
};
