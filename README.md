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

AI image/video generation, Firebase Authentication, Firestore cloud sync and Firebase Storage are **not connected yet**. The interface does not fake AI generation. You can prepare and save creative briefs locally; real generation requires a supported inference provider.

Projects and assets in this version are stored in the current browser only. They are not cloud-backed.

## Roadmap

1. Configure Firebase Authentication, Firestore and Storage with secure rules.
2. Add secure server-side integration for supported AI inference providers.
3. Add real generation jobs, previews, history and downloads.
4. Add user profiles and cloud-synced projects.

Repository: https://github.com/AbdulRafay-2011/rafay-ai-studio
