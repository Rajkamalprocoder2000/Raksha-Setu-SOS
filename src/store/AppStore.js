import React, {createContext, useContext, useMemo, useReducer} from 'react';

import {createInitialState, planCatalog} from '../data/demoState';

const AppStoreContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_WITH_PROFILE':
      return {
        ...state,
        auth: {
          isLoggedIn: true,
          user: {
            name: action.payload.name,
            phone: action.payload.phone,
            email: '',
            provider: 'profile',
          },
        },
      };
    case 'LOGIN_WITH_GOOGLE':
      return {
        ...state,
        auth: {
          isLoggedIn: true,
          user: {
            name: action.payload.name || 'Google User',
            phone: action.payload.phone || '',
            email: action.payload.email || '',
            provider: 'google',
          },
        },
      };
    case 'SIGN_OUT':
      return {
        ...state,
        auth: {
          isLoggedIn: false,
          user: null,
        },
        sosActive: false,
      };
    case 'TRIGGER_SOS':
      return {
        ...state,
        sosActive: true,
        alerts: [
          {
            id: `alert-${Date.now()}`,
            title: 'SOS activated',
            subtitle: action.payload || 'Trusted contacts notified',
            tone: 'danger',
          },
          ...state.alerts,
        ],
      };
    case 'STOP_SOS':
      return {
        ...state,
        sosActive: false,
      };
    case 'ADD_CONTACT': {
      const currentPlan = planCatalog[state.currentPlan];
      if (state.contacts.length >= currentPlan.maxContacts) {
        return state;
      }
      return {
        ...state,
        contacts: [{id: `c-${Date.now()}`, ...action.payload}, ...state.contacts],
      };
    }
    case 'REMOVE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(item => item.id !== action.payload),
      };
    case 'ADD_ZONE':
      return {
        ...state,
        zones: [{id: `z-${Date.now()}`, active: true, isInside: false, ...action.payload}, ...state.zones],
      };
    case 'TOGGLE_ZONE':
      return {
        ...state,
        zones: state.zones.map(zone =>
          zone.id === action.payload ? {...zone, active: !zone.active} : zone,
        ),
      };
    case 'REMOVE_ZONE':
      return {
        ...state,
        zones: state.zones.filter(zone => zone.id !== action.payload),
      };
    case 'TOGGLE_TRACKING':
      return {
        ...state,
        trackingEnabled: !state.trackingEnabled,
      };
    case 'SET_PLAN':
      return {
        ...state,
        currentPlan: action.payload,
      };
    case 'CREATE_NEARBY_REQUEST':
      return {
        ...state,
        nearby: {
          ...state.nearby,
          activeRequest: action.payload,
        },
        alerts: [
          {
            id: `nearby-${Date.now()}`,
            title: 'Nearby help request sent',
            subtitle: action.payload,
            tone: 'blue',
          },
          ...state.alerts,
        ],
      };
    case 'CLEAR_NEARBY_REQUEST':
      return {
        ...state,
        nearby: {
          ...state.nearby,
          activeRequest: null,
        },
      };
    default:
      return state;
  }
}

export function AppProvider({children}) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const value = useMemo(() => ({state, dispatch}), [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used inside AppProvider');
  }
  return context;
}
