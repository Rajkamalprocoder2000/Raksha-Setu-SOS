import auth from '@react-native-firebase/auth';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';

const webClientId =
  '778610913231-9bvvp6qq6f6utdd8s9i16enaami5s71j.apps.googleusercontent.com';
const iosClientId =
  '778610913231-ousdof70ri7387lmb3fapf8uejh2q6av.apps.googleusercontent.com';

let configured = false;

export function configureGoogleAuth() {
  if (configured) {
    return;
  }

  GoogleSignin.configure({
    webClientId,
    iosClientId,
    offlineAccess: true,
  });

  configured = true;
}

export async function signInWithGoogle() {
  configureGoogleAuth();

  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  const signInResult = await GoogleSignin.signIn();
  const signInPayload = signInResult?.data || signInResult;
  const tokenBundle = await GoogleSignin.getTokens();
  const idToken = signInPayload?.idToken || tokenBundle?.idToken;

  if (!idToken) {
    throw new Error('Google idToken nahi mila.');
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const result = await auth().signInWithCredential(googleCredential);
  const user = result.user;

  return {
    name: user.displayName || signInPayload?.user?.name || 'Google User',
    phone: user.phoneNumber || '',
    email: user.email || signInPayload?.user?.email || '',
  };
}

export async function signOutGoogleAuth() {
  configureGoogleAuth();
  await auth().signOut();

  try {
    const signedIn = await GoogleSignin.isSignedIn();
    if (signedIn) {
      await GoogleSignin.signOut();
    }
  } catch (_) {
    // Ignore local Google cleanup failure after Firebase sign out.
  }
}

export function subscribeToGoogleAuthSession(onUser) {
  configureGoogleAuth();

  return auth().onAuthStateChanged(user => {
    if (!user) {
      return;
    }

    onUser({
      name: user.displayName || 'Google User',
      phone: user.phoneNumber || '',
      email: user.email || '',
    });
  });
}

export function getGoogleAuthErrorMessage(error) {
  if (!error) {
    return 'Google sign in fail ho gaya.';
  }

  if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    return 'Google sign in cancel ho gaya.';
  }

  if (error.code === statusCodes.IN_PROGRESS) {
    return 'Google sign in already in progress hai.';
  }

  if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google Play Services available nahi hai.';
  }

  return error.message || 'Google sign in fail ho gaya.';
}
