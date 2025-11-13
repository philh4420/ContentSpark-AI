import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {TwitterApi} from "twitter-api-v2";
import * as crypto from "crypto";

admin.initializeApp();

// IMPORTANT: Replace with your actual Twitter App credentials from Firebase config
const TWITTER_CLIENT_ID = functions.config().twitter?.client_id || "YOUR_TWITTER_CLIENT_ID";
const TWITTER_CLIENT_SECRET = functions.config().twitter?.client_secret || "YOUR_TWITTER_CLIENT_SECRET";
// IMPORTANT: Make sure this callback URL is registered in your Twitter App settings
// and points to your function that will handle the callback.
const TWITTER_CALLBACK_URL = "YOUR_TWITTER_CALLBACK_URL";

// IMPORTANT: Replace with your actual LinkedIn App credentials from Firebase config
const LINKEDIN_CLIENT_ID = functions.config().linkedin?.client_id || "YOUR_LINKEDIN_CLIENT_ID";
const LINKEDIN_CLIENT_SECRET = functions.config().linkedin?.client_secret || "YOUR_LINKEDIN_CLIENT_SECRET";
// IMPORTANT: Make sure this redirect URI is registered in your LinkedIn App settings
const LINKEDIN_REDIRECT_URI = "YOUR_LINKEDIN_REDIRECT_URI";

export const getTwitterAuthUrl = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  }

  const client = new TwitterApi({
    clientId: TWITTER_CLIENT_ID,
    clientSecret: TWITTER_CLIENT_SECRET,
  });

  const {url, codeVerifier, state} = client.generateOAuth2AuthLink(
    TWITTER_CALLBACK_URL,
    {
      scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
    },
  );

  // Store the codeVerifier and state in Firestore to verify the callback
  await admin.firestore()
    .collection("users").doc(context.auth.uid)
    .collection("connections").doc("twitterState")
    .set({codeVerifier, state});

  return {authUrl: url};
});


export const getLinkedInAuthUrl = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  }

  const state = crypto.randomBytes(20).toString("hex");
  const scope = "r_liteprofile r_emailaddress w_member_social";

  // Store state to prevent CSRF attacks
  await admin.firestore()
    .collection("users").doc(context.auth.uid)
    .collection("connections").doc("linkedinState")
    .set({state});

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&state=${state}&scope=${encodeURIComponent(scope)}`;

  return {authUrl};
});
