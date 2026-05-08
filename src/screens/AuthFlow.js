import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  getGoogleAuthErrorMessage,
  signInWithGoogle as signInWithGoogleAuth,
} from '../services/googleAuth';
import {useAppStore} from '../store/AppStore';
import {
  InfoStrip,
  InputField,
  Panel,
  PrimaryButton,
  ScreenFrame,
  ScreenScroll,
  SecondaryButton,
  StatusBadge,
} from '../ui/components';

export function AuthFlow({theme}) {
  const {dispatch} = useAppStore();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  function submitPhone() {
    if (phone.trim().length !== 10) {
      setError('10 digit mobile number dalo.');
      return;
    }
    setError('');
    setStep('otp');
  }

  function submitOtp() {
    if (otp.trim() !== '9342') {
      setError('Demo OTP 9342 use karo.');
      return;
    }
    setError('');
    setStep('profile');
  }

  function submitProfile() {
    if (name.trim().length < 2) {
      setError('Naam kam se kam 2 letters ka hona chahiye.');
      return;
    }

    dispatch({
      type: 'LOGIN_WITH_PROFILE',
      payload: {
        name: name.trim(),
        phone: `+91 ${phone.trim()}`,
      },
    });
  }

  async function signInWithGoogle() {
    setError('');
    setLoadingGoogle(true);
    try {
      const user = await signInWithGoogleAuth();
      dispatch({
        type: 'LOGIN_WITH_GOOGLE',
        payload: user,
      });
    } catch (authError) {
      setError(getGoogleAuthErrorMessage(authError));
    } finally {
      setLoadingGoogle(false);
    }
  }

  return (
    <ScreenFrame theme={theme}>
      <ScreenScroll contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <StatusBadge theme={theme} label="Classic White UI" tone="accent" />
          <Text style={[styles.brand, {color: theme.colors.accent}]}>Raksha Setu</Text>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            Purane Raksha Setu jaisa simple white onboarding.
          </Text>
          <Text style={[styles.copy, {color: theme.colors.textMuted}]}>
            Clean white cards, red safety focus, quick access auth aur same safety modules.
          </Text>
        </View>

        <Panel theme={theme}>
          <Text style={[styles.panelTitle, {color: theme.colors.text}]}>
            {step === 'phone' ? 'Login with Mobile' : step === 'otp' ? 'Verify OTP' : 'Complete Profile'}
          </Text>
          <Text style={[styles.panelCopy, {color: theme.colors.textMuted}]}>
            {step === 'phone'
              ? 'Mobile number se quick entry.'
              : step === 'otp'
                ? 'Demo build ke liye OTP 9342 use karo.'
                : 'Naam save karte hi dashboard open ho jayega.'}
          </Text>

          {step === 'phone' ? (
            <InputField
              theme={theme}
              label="Mobile Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="9876543210"
              keyboardType="number-pad"
              maxLength={10}
            />
          ) : null}

          {step === 'otp' ? (
            <>
              <InputField
                theme={theme}
                label="OTP"
                value={otp}
                onChangeText={setOtp}
                placeholder="9342"
                keyboardType="number-pad"
                maxLength={4}
              />
              <InfoStrip
                theme={theme}
                title="Demo OTP"
                text="Is white-theme build me demo verification 9342 rakha gaya hai."
                tone="gold"
              />
            </>
          ) : null}

          {step === 'profile' ? (
            <InputField
              theme={theme}
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Aarohi Singh"
            />
          ) : null}

          {error ? <Text style={[styles.error, {color: theme.colors.danger}]}>{error}</Text> : null}

          <PrimaryButton
            theme={theme}
            label={step === 'phone' ? 'Send OTP' : step === 'otp' ? 'Verify OTP' : 'Enter App'}
            onPress={step === 'phone' ? submitPhone : step === 'otp' ? submitOtp : submitProfile}
          />

          <View style={styles.dividerWrap}>
            <View style={[styles.divider, {backgroundColor: theme.colors.border}]} />
            <Text style={[styles.dividerText, {color: theme.colors.textMuted}]}>or</Text>
            <View style={[styles.divider, {backgroundColor: theme.colors.border}]} />
          </View>

          <SecondaryButton
            theme={theme}
            label={loadingGoogle ? 'Connecting Google...' : 'Sign up with Google'}
            onPress={signInWithGoogle}
            disabled={loadingGoogle}
          />
        </Panel>

        <Panel theme={theme}>
          <Text style={[styles.panelTitle, {color: theme.colors.text}]}>Included Safety Modules</Text>
          <View style={styles.moduleWrap}>
            {['Emergency SOS', 'Trusted Contacts', 'Safe Zones', 'Nearby Help', 'Live Tracking', 'Alerts'].map(
              item => (
                <View key={item} style={[styles.moduleChip, {backgroundColor: theme.colors.panelAlt}]}>
                  <Text style={[styles.moduleText, {color: theme.colors.text}]}>{item}</Text>
                </View>
              ),
            )}
          </View>
        </Panel>
      </ScreenScroll>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  content: {
    minHeight: '100%',
    justifyContent: 'center',
  },
  hero: {
    marginTop: 28,
    marginBottom: 18,
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    marginBottom: 8,
  },
  copy: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  panelCopy: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  error: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 4,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  moduleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moduleChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  moduleText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
