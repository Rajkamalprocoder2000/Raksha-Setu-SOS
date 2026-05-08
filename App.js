import React, {useEffect, useState} from 'react';

import {AuthFlow} from './src/screens/AuthFlow';
import {MainFlow} from './src/screens/MainFlow';
import {subscribeToGoogleAuthSession} from './src/services/googleAuth';
import {AppProvider, useAppStore} from './src/store/AppStore';
import {getTheme} from './src/theme';

function RootApp() {
  const theme = getTheme();
  const {state, dispatch} = useAppStore();
  const [routeStack, setRouteStack] = useState(['home']);

  useEffect(() => {
    const unsubscribe = subscribeToGoogleAuthSession(user => {
      if (!user) {
        return;
      }

      dispatch({
        type: 'LOGIN_WITH_GOOGLE',
        payload: user,
      });
      setRouteStack(['home']);
    });

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (!state.auth.isLoggedIn) {
      setRouteStack(['home']);
    }
  }, [state.auth.isLoggedIn]);

  function setRootRoute(route) {
    setRouteStack([route]);
  }

  function pushRoute(route) {
    setRouteStack(current => [...current, route]);
  }

  function popRoute() {
    setRouteStack(current => (current.length > 1 ? current.slice(0, -1) : current));
  }

  if (!state.auth.isLoggedIn) {
    return <AuthFlow theme={theme} />;
  }

  return (
    <MainFlow
      theme={theme}
      routeStack={routeStack}
      setRootRoute={setRootRoute}
      pushRoute={pushRoute}
      popRoute={popRoute}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootApp />
    </AppProvider>
  );
}
