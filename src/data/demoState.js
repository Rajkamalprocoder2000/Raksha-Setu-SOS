export const emergencyHotlines = [
  {label: 'Women Helpline', number: '1091'},
  {label: 'Emergency', number: '112'},
  {label: 'Police', number: '100'},
];

export const planCatalog = {
  free: {
    id: 'free',
    label: 'Free',
    monthlyPrice: 0,
    maxContacts: 3,
    hasNearby: false,
    hasLiveTracking: false,
  },
  plus: {
    id: 'plus',
    label: 'Plus',
    monthlyPrice: 99,
    maxContacts: 8,
    hasNearby: true,
    hasLiveTracking: true,
  },
  family: {
    id: 'family',
    label: 'Family',
    monthlyPrice: 199,
    maxContacts: 12,
    hasNearby: true,
    hasLiveTracking: true,
  },
};

export function createInitialState() {
  return {
    auth: {
      isLoggedIn: false,
      user: null,
    },
    currentPlan: 'plus',
    sosActive: false,
    trackingEnabled: true,
    contacts: [
      {id: 'c1', name: 'Maa', relation: 'Mother', phone: '+91 9876543210'},
      {id: 'c2', name: 'Riya', relation: 'Friend', phone: '+91 9898989898'},
    ],
    zones: [
      {id: 'z1', name: 'Home', radius: 150, active: true, isInside: true},
      {id: 'z2', name: 'Office Route', radius: 300, active: true, isInside: false},
    ],
    alerts: [
      {id: 'a1', title: 'Safe arrival recorded', subtitle: 'Home zone detected 8 mins ago', tone: 'green'},
      {id: 'a2', title: 'Nearby help signal', subtitle: 'One support ping available within 1.2 km', tone: 'danger'},
      {id: 'a3', title: 'Tracking live', subtitle: 'Trusted contacts can view your route', tone: 'blue'},
    ],
    nearby: {
      activeRequest: null,
      currentLocation: {
        label: 'Connaught Place, New Delhi',
        latitude: 28.6317,
        longitude: 77.2167,
      },
      devices: [
        {
          id: 'd1',
          name: 'Metro Gate Volunteer',
          distance: '350m',
          signal: 'Strong',
          address: 'Gate 2, Rajiv Chowk Metro',
          latitude: 28.6331,
          longitude: 77.2198,
        },
        {
          id: 'd2',
          name: 'Cafe Safe Point',
          distance: '700m',
          signal: 'Medium',
          address: 'Outer Circle, Block M',
          latitude: 28.6289,
          longitude: 77.2204,
        },
      ],
    },
  };
}
