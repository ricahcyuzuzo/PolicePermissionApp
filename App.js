import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DPU_HOME, LOGIN, NOTIFICATIONS, OFFICER_HOME, SIGNUP } from './src/constants';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import AppContext from './src/Context/AppContext';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Home from './src/screens/Officer/Home';
import HomeDPU from './src/screens/DPU/HomeDPU';
import NotificationsScreen from './src/screens/DPU/Notifications';
import NotificationsOfficer from './src/screens/Officer/Notifications';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState('not-logged-in');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


  useEffect(() => {
    loggedIn();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log(token);
      setExpoPushToken(token.data);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  const loggedIn = async () => {
      const value = await AsyncStorage.getItem('loggedIn');
      setIsLoggedIn(value);
  }

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, expoPushToken, }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}>
          {
            isLoggedIn === 'dpu-logged-in' ?
            <>
              <Stack.Screen name={DPU_HOME} component={HomeDPU} />
              <Stack.Screen name={NOTIFICATIONS} component={NotificationsScreen} />
            </>
            :
            isLoggedIn === 'officer-logged-in' ?
            <>
              <Stack.Screen name={OFFICER_HOME} component={Home} />
              <Stack.Screen name={NOTIFICATIONS} component={NotificationsOfficer} />
            </>
            :
            <>
              <Stack.Screen name={LOGIN} component={Login} />
              <Stack.Screen name={SIGNUP} component={Signup} />
            </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
