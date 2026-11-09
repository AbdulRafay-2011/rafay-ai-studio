# RAFAY AI STUDIO

**Imagine. Create. Transform.**

A creative workspace for preparing AI image, video and storyboard projects.

## Included in this first frontend version

- Responsive dark interface with emerald accents
- Home dashboard and creative tool navigation
- Image studio: text-to-image and image-to-image project preparation
- Video studio: text-to-video and image-to-video project preparation
- Storyboard builder with add/remove scenes
- Local project saving, searching, filtering and deleting
- Reference image asset library
- Settings page with integration status

## Open the app

The frontend uses standard HTML, CSS and JavaScript. Open `index.html` in a browser. No build step is required.

## Integration status

AI image/video generation and Firebase Storage are **not connected yet**. Google Authentication, Firestore profile storage and per-user project sync are implemented in the frontend. The interface does not fake AI generation. You can prepare and save creative briefs locally; real generation requires a supported inference provider.

Projects are stored locally and synced to Firestore after Google sign-in. Reference assets remain local to the current browser in this version.

## Roadmap

1. Configure Firebase Authentication, Firestore and Storage with secure rules.
2. Add secure server-side integration for supported AI inference providers.
3. Add real generation jobs, previews, history and downloads.
4. Add user profiles and cloud-synced projects.

Repository: https://github.com/AbdulRafay-2011/rafay-ai-studio

## Firebase setup

The web client is configured in `firebase.js` for Google Authentication and per-user Firestore project sync. The Firebase web config is public client configuration; never add service-account credentials to this repository.

Before using cloud sync:
1. In Firebase Authentication settings, add `abdulrafay-2011.github.io` to Authorized domains.
2. In Firestore Database > Rules, publish the contents of `firestore.rules`.

The Firestore rules allow each signed-in user to access only documents under their own `users/{uid}` path. `firebase.json` points Firebase CLI deployments to the same rules file.


## Account and admin features
- Google sign-in and private per-user cloud projects.
- Browser-local authentication persistence, so refreshes should keep the session active.
- Cloud deletion for projects.
- Editable user profile stored at `users/{uid}`.
- Owner-only read-only admin overview of profiles and project counts.
- The owner UID is restricted in both `firebase.js` and `firestore.rules`; update both files if the owner account changes.

Publish the updated `firestore.rules` in Firebase Console > Firestore Database > Rules. Users can only modify their own profile and projects; the owner can read user profiles and projects for the admin overview.
