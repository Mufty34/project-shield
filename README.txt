PROJECT SHIELD MVP — FIRST DEMO

What this is:
A lightweight, installable web-app prototype for tracking purchases, return deadlines,
warranty dates and receipt filenames. It is designed to run in a browser without a build
step or paid services.

Run locally:
1. Extract the ZIP into a folder.
2. Open index.html in a modern browser.
   The core demo works locally. PWA installation/offline caching requires serving it
   over HTTPS or localhost.
3. For local PWA testing on a computer with Python installed, open Command Prompt in
   this folder and run: python -m http.server 8000
   Then visit http://localhost:8000

Important demo limitations:
- Data is stored in this browser's localStorage, not in a cloud account.
- Receipt upload currently records the file name only; it does NOT upload or store the
  actual document. Do not enter real sensitive information.
- No login, shared household, notifications, AI or payment processing yet.
- Browser storage can be cleared. Export/backup and cloud sync must be added before
  real public use.
- This is a prototype, not legal, financial or warranty advice.

Next development steps:
1. Validate the problem with 10–15 people.
2. Add secure authentication and cloud database.
3. Add real private receipt storage and scheduled notifications.
4. Add privacy policy, account deletion and security review before public launch.
