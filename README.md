# Abdulrahman Suddy — personal website

Single-page site for Abdulrahman Suddy (business & financial advisory), hosted with GitHub Pages.

- `index.html` is the whole site: HTML, CSS, JS and photos in one file.
- `google-apps-script/Code.gs` is the script that saves email signups to a Google Sheet.
- Brand: orange `#EA6134`, navy `#32344C`, amber `#F8A420`; Poppins, Nunito Sans and Caveat.

## Google setup

Both links go in the `SITE_CONFIG` block near the bottom of `index.html`.

### Email list on Google (`SHEET_ENDPOINT`)

1. Go to sheets.new and name the sheet "Website subscribers".
2. Menu **Extensions ▸ Apps Script**. Delete the sample code, paste in all of `google-apps-script/Code.gs`, click **Save**.
3. Click **Deploy ▸ New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the permissions prompt, then copy the **Web app URL** (ends in `/exec`).
5. Paste it into `SHEET_ENDPOINT`. Both the popup and the newsletter form then add rows (Date, Email, Name, Source) to the sheet, skipping duplicates.

### Booking on Google Calendar (`BOOKING_URL`, `BOOKING_EMBED_URL`)

1. In Google Calendar click **Create ▸ Appointment schedule**.
2. Set the title, 30-minute duration, your available hours and the booking form, then save.
3. Open the schedule ▸ **Share**. Copy the booking page link (looks like `https://calendar.app.google/XXXX`) into `BOOKING_URL`.
4. Optional, to show the schedule inside the page: in the same Share panel, copy the **Embed** code and paste only its `src` URL into `BOOKING_EMBED_URL`.

Appointment schedules need a Google account that supports them (a personal Gmail works).

## Still to fill in

| Item | Where | What to put |
|---|---|---|
| `[Date]`, `[X] min read`, article titles | `#blog` | your real articles (to come) |
| "Coming soon" resource cards | `#resources` | direct file links (to come) |

## Publishing changes

Push to `main`; GitHub Pages redeploys in about a minute.
