import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';

import {emergencyHotlines, planCatalog} from '../data/demoState';
import {signOutGoogleAuth} from '../services/googleAuth';
import {useAppStore} from '../store/AppStore';
import {
  BottomTabs,
  EmptyState,
  InfoStrip,
  InputField,
  MetricCard,
  Panel,
  PrimaryButton,
  ScreenFrame,
  ScreenScroll,
  SecondaryButton,
  SectionTitle,
  SheetModal,
  StatusBadge,
  ToggleRow,
  TopBar,
} from '../ui/components';

const mainTabs = [
  {key: 'home', label: 'Home'},
  {key: 'alerts', label: 'Alerts'},
  {key: 'nearby', label: 'Nearby'},
  {key: 'settings', label: 'Settings'},
];

function createNearbyMapHtml(currentLocation, devices, theme) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""
    />
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
      }

      body {
        background: ${theme.colors.panelAlt};
        font-family: Arial, sans-serif;
      }

      .leaflet-container {
        background: ${theme.colors.panelAlt};
      }

      .map-popup {
        font-size: 12px;
        line-height: 1.4;
        color: ${theme.colors.text};
      }

      .map-popup strong {
        display: block;
        margin-bottom: 2px;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script
      src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      crossorigin=""
    ></script>
    <script>
      const currentLocation = ${JSON.stringify(currentLocation)};
      const devices = ${JSON.stringify(devices)};

      function escapeHtml(value) {
        return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      const map = L.map('map', {
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({position: 'bottomright'}).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const bounds = [];

      const userMarker = L.circleMarker([currentLocation.latitude, currentLocation.longitude], {
        radius: 10,
        color: '${theme.colors.accentStrong}',
        fillColor: '${theme.colors.accent}',
        fillOpacity: 1,
        weight: 3,
      }).addTo(map);

      userMarker.bindPopup(
        '<div class="map-popup"><strong>Your location</strong>' +
          escapeHtml(currentLocation.label) +
          '</div>'
      );
      bounds.push([currentLocation.latitude, currentLocation.longitude]);

      devices.forEach(function (point) {
        const marker = L.marker([point.latitude, point.longitude]).addTo(map);
        marker.bindPopup(
          '<div class="map-popup"><strong>' +
            escapeHtml(point.name) +
            '</strong>' +
            escapeHtml(point.address) +
            '<br />' +
            escapeHtml(point.distance + ' | ' + point.signal) +
            '</div>'
        );
        bounds.push([point.latitude, point.longitude]);
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, {padding: [24, 24]});
      } else {
        map.setView(bounds[0], 15);
      }
    </script>
  </body>
</html>`;
}

function openDirections(destination) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${destination.latitude},${destination.longitude}`,
  )}`;
  return Linking.openURL(url);
}

function NearbyMapCard({theme, currentLocation, devices}) {
  return (
    <View style={[styles.mapFrame, {borderColor: theme.colors.border}]}>
      <WebView
        originWhitelist={['*']}
        source={{html: createNearbyMapHtml(currentLocation, devices, theme)}}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        nestedScrollEnabled
        setSupportMultipleWindows={false}
        startInLoadingState
        renderLoading={() => (
          <View style={[styles.mapLoader, {backgroundColor: theme.colors.panelAlt}]}>
            <ActivityIndicator color={theme.colors.accent} />
            <Text style={[styles.mapLoaderText, {color: theme.colors.textMuted}]}>
              Map load ho raha hai...
            </Text>
          </View>
        )}
      />
    </View>
  );
}

export function MainFlow({theme, routeStack, setRootRoute, pushRoute, popRoute}) {
  const currentRoute = routeStack[routeStack.length - 1];
  const isMainTab = mainTabs.some(item => item.key === currentRoute);

  return (
    <ScreenFrame theme={theme}>
      {currentRoute === 'home' ? <HomeScreen theme={theme} pushRoute={pushRoute} /> : null}
      {currentRoute === 'alerts' ? <AlertsScreen theme={theme} /> : null}
      {currentRoute === 'nearby' ? <NearbyScreen theme={theme} /> : null}
      {currentRoute === 'settings' ? <SettingsScreen theme={theme} pushRoute={pushRoute} /> : null}
      {currentRoute === 'contacts' ? <ContactsScreen theme={theme} onBack={popRoute} /> : null}
      {currentRoute === 'zones' ? <ZonesScreen theme={theme} onBack={popRoute} /> : null}
      {currentRoute === 'plans' ? <PlansScreen theme={theme} onBack={popRoute} /> : null}

      {isMainTab ? (
        <BottomTabs
          theme={theme}
          currentRoute={currentRoute}
          routes={mainTabs}
          onChange={setRootRoute}
        />
      ) : null}
    </ScreenFrame>
  );
}

function HomeScreen({theme, pushRoute}) {
  const {state, dispatch} = useAppStore();
  const plan = planCatalog[state.currentPlan];
  const hold = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);

  function startHold() {
    setHolding(true);
    Animated.timing(hold, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start(() => {
      dispatch({
        type: 'TRIGGER_SOS',
        payload: 'Trusted contacts and tracking relay notified',
      });
      hold.setValue(0);
      setHolding(false);
    });
  }

  function stopHold() {
    if (!holding) {
      return;
    }
    hold.stopAnimation();
    hold.setValue(0);
    setHolding(false);
  }

  const scale = hold.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  return (
    <ScreenScroll>
      <TopBar
        theme={theme}
        title="Raksha Setu"
        subtitle={`${state.auth.user?.name || 'User'} dashboard`}
        rightLabel="Contacts"
        onRightPress={() => pushRoute('contacts')}
      />

      <InfoStrip
        theme={theme}
        title="Classic White Safety Dashboard"
        text="Purane Raksha Setu jaisa clean white layout with red safety focus."
        tone="accent"
      />

      <Panel theme={theme}>
        <SectionTitle theme={theme} title="Safety Overview" />
        <View style={styles.metricsRow}>
          <MetricCard theme={theme} label="Contacts" value={`${state.contacts.length}`} tone="blue" />
          <MetricCard theme={theme} label="Zones" value={`${state.zones.length}`} tone="green" />
          <MetricCard theme={theme} label="Plan" value={plan.label} tone="gold" />
        </View>
      </Panel>

      <Panel theme={theme} style={styles.sosPanel}>
        <StatusBadge
          theme={theme}
          label={state.sosActive ? 'SOS ACTIVE' : holding ? 'HOLDING' : 'PRESS & HOLD'}
          tone={state.sosActive ? 'danger' : 'accent'}
        />
        <Text style={[styles.sosTitle, {color: theme.colors.text}]}>Emergency SOS</Text>
        <Text style={[styles.bodyCopy, {color: theme.colors.textMuted}]}>
          Hold red button to trigger emergency flow. White UI ke andar SOS ko prominent rakha gaya hai.
        </Text>

        <View style={styles.sosWrap}>
          <Animated.View
            style={[
              styles.sosRing,
              {
                backgroundColor: theme.colors.accentSoft,
                transform: [{scale}],
              },
            ]}
          />
          <TouchableOpacity
            activeOpacity={0.92}
            onPressIn={startHold}
            onPressOut={stopHold}
            style={[
              styles.sosButton,
              {backgroundColor: state.sosActive ? theme.colors.danger : theme.colors.accent},
            ]}>
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>
        </View>

        {state.sosActive ? (
          <PrimaryButton theme={theme} label="Stop SOS" onPress={() => dispatch({type: 'STOP_SOS'})} />
        ) : null}
      </Panel>

      <Panel theme={theme}>
        <SectionTitle theme={theme} title="Quick Access" />
        <View style={styles.tileGrid}>
          <QuickTile
            theme={theme}
            title="Trusted Contacts"
            subtitle="Emergency reach list"
            tone="blue"
            onPress={() => pushRoute('contacts')}
          />
          <QuickTile
            theme={theme}
            title="Safe Zones"
            subtitle="Home and route radius"
            tone="green"
            onPress={() => pushRoute('zones')}
          />
          <QuickTile
            theme={theme}
            title="Nearby Help"
            subtitle="Community support"
            tone="gold"
            onPress={() => pushRoute('nearby')}
          />
          <QuickTile
            theme={theme}
            title="Plans"
            subtitle="Upgrade features"
            tone="accent"
            onPress={() => pushRoute('plans')}
          />
        </View>
      </Panel>

      <Panel theme={theme}>
        <SectionTitle theme={theme} title="Emergency Numbers" />
        <View style={styles.tileGrid}>
          {emergencyHotlines.map(item => (
            <TouchableOpacity
              key={item.number}
              onPress={() => Linking.openURL(`tel:${item.number}`)}
              style={[styles.hotlineCard, {backgroundColor: theme.colors.panelAlt}]}>
              <Text style={[styles.hotlineNumber, {color: theme.colors.text}]}>{item.number}</Text>
              <Text style={[styles.hotlineLabel, {color: theme.colors.textMuted}]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Panel>
    </ScreenScroll>
  );
}

function ContactsScreen({theme, onBack}) {
  const {state, dispatch} = useAppStore();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');

  function addContact() {
    if (!name.trim() || !relation.trim() || phone.trim().length !== 10) {
      return;
    }

    dispatch({
      type: 'ADD_CONTACT',
      payload: {
        name: name.trim(),
        relation: relation.trim(),
        phone: `+91 ${phone.trim()}`,
      },
    });
    setVisible(false);
    setName('');
    setRelation('');
    setPhone('');
  }

  return (
    <>
      <ScreenScroll>
        <TopBar theme={theme} title="Trusted Contacts" subtitle="Emergency call list" onBack={onBack} rightLabel="Add" onRightPress={() => setVisible(true)} />

        {state.contacts.map(item => (
          <Panel theme={theme} key={item.id}>
            <View style={styles.rowBetween}>
              <View style={styles.copyBlock}>
                <Text style={[styles.cardTitle, {color: theme.colors.text}]}>{item.name}</Text>
                <Text style={[styles.bodyCopy, {color: theme.colors.textMuted}]}>
                  {item.relation} . {item.phone}
                </Text>
              </View>
              <TouchableOpacity onPress={() => dispatch({type: 'REMOVE_CONTACT', payload: item.id})}>
                <Text style={[styles.removeText, {color: theme.colors.danger}]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Panel>
        ))}
      </ScreenScroll>

      <SheetModal visible={visible} onClose={() => setVisible(false)} theme={theme}>
        <Text style={[styles.sheetTitle, {color: theme.colors.text}]}>Add Trusted Contact</Text>
        <InputField theme={theme} label="Name" value={name} onChangeText={setName} placeholder="Maa" />
        <InputField theme={theme} label="Relation" value={relation} onChangeText={setRelation} placeholder="Mother" />
        <InputField
          theme={theme}
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="9876543210"
          keyboardType="number-pad"
          maxLength={10}
        />
        <PrimaryButton theme={theme} label="Save Contact" onPress={addContact} />
      </SheetModal>
    </>
  );
}

function ZonesScreen({theme, onBack}) {
  const {state, dispatch} = useAppStore();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [radius, setRadius] = useState('150');

  function addZone() {
    if (!name.trim()) {
      return;
    }

    dispatch({
      type: 'ADD_ZONE',
      payload: {
        name: name.trim(),
        radius: Number(radius) || 150,
      },
    });
    setVisible(false);
    setName('');
    setRadius('150');
  }

  return (
    <>
      <ScreenScroll>
        <TopBar theme={theme} title="Safe Zones" subtitle="Home and route protection" onBack={onBack} rightLabel="Add" onRightPress={() => setVisible(true)} />

        {state.zones.map(zone => (
          <Panel theme={theme} key={zone.id}>
            <View style={styles.rowBetween}>
              <View style={styles.copyBlock}>
                <Text style={[styles.cardTitle, {color: theme.colors.text}]}>{zone.name}</Text>
                <Text style={[styles.bodyCopy, {color: theme.colors.textMuted}]}>
                  Radius {zone.radius}m . {zone.isInside ? 'Inside now' : 'Outside now'}
                </Text>
              </View>
              <StatusBadge theme={theme} label={zone.active ? 'ACTIVE' : 'PAUSED'} tone={zone.active ? 'green' : 'gold'} />
            </View>
            <View style={styles.inlineButtons}>
              <SecondaryButton
                theme={theme}
                label={zone.active ? 'Pause' : 'Resume'}
                onPress={() => dispatch({type: 'TOGGLE_ZONE', payload: zone.id})}
                style={styles.flexButton}
              />
              <SecondaryButton
                theme={theme}
                label="Delete"
                onPress={() => dispatch({type: 'REMOVE_ZONE', payload: zone.id})}
                style={styles.flexButton}
              />
            </View>
          </Panel>
        ))}
      </ScreenScroll>

      <SheetModal visible={visible} onClose={() => setVisible(false)} theme={theme}>
        <Text style={[styles.sheetTitle, {color: theme.colors.text}]}>Create Safe Zone</Text>
        <InputField theme={theme} label="Zone Name" value={name} onChangeText={setName} placeholder="Office Route" />
        <InputField
          theme={theme}
          label="Radius"
          value={radius}
          onChangeText={setRadius}
          placeholder="150"
          keyboardType="number-pad"
        />
        <PrimaryButton theme={theme} label="Save Zone" onPress={addZone} />
      </SheetModal>
    </>
  );
}

function NearbyScreen({theme}) {
  const {state, dispatch} = useAppStore();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const currentLocation = state.nearby.currentLocation;

  function createRequest() {
    if (!message.trim()) {
      return;
    }
    dispatch({type: 'CREATE_NEARBY_REQUEST', payload: message.trim()});
    setVisible(false);
    setMessage('');
  }

  return (
    <>
      <ScreenScroll>
        <TopBar theme={theme} title="Nearby Help" subtitle="Support around you" rightLabel="Request" onRightPress={() => setVisible(true)} />

        <InfoStrip
          theme={theme}
          title="Community Help Flow"
          text="Nearby support points ab live map ke saath dikh rahe hain, taaki closest help jaldi mil sake."
          tone="blue"
        />

        <Panel theme={theme}>
          <SectionTitle theme={theme} title="Live Safety Map" />
          <Text style={[styles.bodyCopy, {color: theme.colors.textMuted}]}>
            Current area: {currentLocation.label}
          </Text>
          <NearbyMapCard
            theme={theme}
            currentLocation={currentLocation}
            devices={state.nearby.devices}
          />
          <SecondaryButton
            theme={theme}
            label="Open In Google Maps"
            onPress={() => openDirections(currentLocation)}
          />
        </Panel>

        <Panel theme={theme}>
          <SectionTitle theme={theme} title="My Active Request" />
          {state.nearby.activeRequest ? (
            <>
              <Text style={[styles.cardTitle, {color: theme.colors.text}]}>{state.nearby.activeRequest}</Text>
              <SecondaryButton
                theme={theme}
                label="Stop Request"
                onPress={() => dispatch({type: 'CLEAR_NEARBY_REQUEST'})}
              />
            </>
          ) : (
            <EmptyState
              theme={theme}
              title="No active request"
              text="Need ho to nearby help message raise kar sakte ho."
            />
          )}
        </Panel>

        <Panel theme={theme}>
          <SectionTitle theme={theme} title="Nearby Safe Points" />
          {state.nearby.devices.map(item => (
            <View key={item.id} style={[styles.safePointCard, {borderColor: theme.colors.border}]}>
              <View style={styles.listRow}>
                <View style={styles.copyBlock}>
                  <Text style={[styles.cardTitle, {color: theme.colors.text}]}>{item.name}</Text>
                  <Text style={[styles.bodyCopy, {color: theme.colors.textMuted}]}>
                    {item.address}
                  </Text>
                  <Text style={[styles.safePointMeta, {color: theme.colors.textMuted}]}>
                    {item.distance} . {item.signal}
                  </Text>
                </View>
                <StatusBadge theme={theme} label="Available" tone="green" />
              </View>
              <SecondaryButton
                theme={theme}
                label="Get Directions"
                onPress={() => openDirections(item)}
              />
            </View>
          ))}
        </Panel>
      </ScreenScroll>

      <SheetModal visible={visible} onClose={() => setVisible(false)} theme={theme}>
        <Text style={[styles.sheetTitle, {color: theme.colors.text}]}>Nearby Help Request</Text>
        <InputField
          theme={theme}
          label="Message"
          value={message}
          onChangeText={setMessage}
          placeholder="Mujhe pickup point tak safe support chahiye..."
          multiline
        />
        <PrimaryButton theme={theme} label="Send Request" onPress={createRequest} />
      </SheetModal>
    </>
  );
}

function AlertsScreen({theme}) {
  const {state} = useAppStore();

  return (
    <ScreenScroll>
      <TopBar theme={theme} title="Alerts" subtitle={`${state.alerts.length} updates`} />

      {state.alerts.length ? (
        state.alerts.map(item => (
          <Panel theme={theme} key={item.id}>
            <View style={styles.rowBetween}>
              <View style={styles.copyBlock}>
                <Text style={[styles.cardTitle, {color: theme.colors.text}]}>{item.title}</Text>
                <Text style={[styles.bodyCopy, {color: theme.colors.textMuted}]}>{item.subtitle}</Text>
              </View>
              <StatusBadge theme={theme} label="Live" tone={item.tone} />
            </View>
          </Panel>
        ))
      ) : (
        <EmptyState theme={theme} title="No alerts" text="SOS, zone and nearby updates yahin dikhengi." />
      )}
    </ScreenScroll>
  );
}

function SettingsScreen({theme, pushRoute}) {
  const {state, dispatch} = useAppStore();

  async function handleSignOut() {
    try {
      await signOutGoogleAuth();
    } finally {
      dispatch({type: 'SIGN_OUT'});
    }
  }

  return (
    <ScreenScroll>
      <TopBar theme={theme} title="Settings" subtitle="Account and feature controls" />

      <Panel theme={theme}>
        <StatusBadge theme={theme} label={state.currentPlan.toUpperCase()} tone="blue" />
        <Text style={[styles.cardTitle, {color: theme.colors.text}]}>
          {state.auth.user?.name || 'User'}
        </Text>
        <Text style={[styles.bodyCopy, {color: theme.colors.textMuted}]}>
          {state.auth.user?.phone || state.auth.user?.email || 'No account details'}
        </Text>
      </Panel>

      <Panel theme={theme}>
        <SectionTitle theme={theme} title="Tracking" />
        <ToggleRow
          theme={theme}
          label="Live tracking"
          description="Trusted contacts ko route visibility dene ke liye."
          value={state.trackingEnabled}
          onValueChange={() => dispatch({type: 'TOGGLE_TRACKING'})}
        />
      </Panel>

      <Panel theme={theme}>
        <SectionTitle theme={theme} title="Manage Modules" />
        <SecondaryButton theme={theme} label="Trusted Contacts" onPress={() => pushRoute('contacts')} />
        <SecondaryButton theme={theme} label="Safe Zones" onPress={() => pushRoute('zones')} />
        <SecondaryButton theme={theme} label="Plans" onPress={() => pushRoute('plans')} />
      </Panel>

      <Panel theme={theme}>
        <PrimaryButton
          theme={theme}
          label="Sign Out"
          onPress={() =>
            Alert.alert('Sign out', 'Current session band karni hai?', [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Sign out', style: 'destructive', onPress: handleSignOut},
            ])
          }
        />
      </Panel>
    </ScreenScroll>
  );
}

function PlansScreen({theme, onBack}) {
  const {state, dispatch} = useAppStore();

  return (
    <ScreenScroll>
      <TopBar theme={theme} title="Plans" subtitle="Feature access and pricing" onBack={onBack} />

      {Object.values(planCatalog).map(plan => {
        const isCurrent = plan.id === state.currentPlan;
        return (
          <Panel theme={theme} key={plan.id}>
            <View style={styles.rowBetween}>
              <View style={styles.copyBlock}>
                <Text style={[styles.cardTitle, {color: theme.colors.text}]}>{plan.label}</Text>
                <Text style={[styles.bodyCopy, {color: theme.colors.textMuted}]}>
                  Contacts {plan.maxContacts} . Nearby {plan.hasNearby ? 'Yes' : 'No'} . Tracking {plan.hasLiveTracking ? 'Yes' : 'No'}
                </Text>
              </View>
              <StatusBadge theme={theme} label={plan.monthlyPrice === 0 ? 'FREE' : `Rs ${plan.monthlyPrice}`} tone="gold" />
            </View>
            <PrimaryButton
              theme={theme}
              label={isCurrent ? 'Current Plan' : `Switch to ${plan.label}`}
              onPress={() => dispatch({type: 'SET_PLAN', payload: plan.id})}
              disabled={isCurrent}
            />
          </Panel>
        );
      })}
    </ScreenScroll>
  );
}

function QuickTile({theme, title, subtitle, tone, onPress}) {
  const toneMap = {
    accent: {background: theme.colors.accentSoft, color: theme.colors.accent},
    blue: {background: theme.colors.blueSoft, color: theme.colors.blue},
    green: {background: theme.colors.greenSoft, color: theme.colors.green},
    gold: {background: theme.colors.goldSoft, color: theme.colors.gold},
  };
  const selected = toneMap[tone] || toneMap.blue;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[styles.quickTile, {backgroundColor: selected.background}]}>
      <Text style={[styles.quickTileTitle, {color: selected.color}]}>{title}</Text>
      <Text style={[styles.quickTileCopy, {color: selected.color}]}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
  },
  sosPanel: {
    alignItems: 'center',
  },
  sosTitle: {
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 8,
  },
  bodyCopy: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  sosWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  sosRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 2,
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickTile: {
    width: '48%',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    minHeight: 104,
    justifyContent: 'space-between',
  },
  quickTileTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  quickTileCopy: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  hotlineCard: {
    width: '31%',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  hotlineNumber: {
    fontSize: 22,
    fontWeight: '900',
  },
  hotlineLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyBlock: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 5,
  },
  removeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  sheetTitle: {
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 14,
  },
  inlineButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  flexButton: {
    flex: 1,
    marginRight: 8,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapFrame: {
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 14,
    marginBottom: 8,
    height: 300,
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mapLoader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  mapLoaderText: {
    fontSize: 13,
    fontWeight: '600',
  },
  safePointCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  safePointMeta: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },
});
