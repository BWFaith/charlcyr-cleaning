# Charlcyr Cleaning Website

Pages: index, about, services, pricing, gallery, booking (quote calculator + booking), areas, faq, contact.
Open `index.html` in a browser to preview. Upload the whole folder to any host (Netlify, Hostinger, GoDaddy, cPanel).

## 1. Replace the placeholders
- **Gallery photos:** `assets/gallery/placeholder-before.svg` and `placeholder-after.svg` are used in `gallery.html` (search `placeholder-`). Change each `<img src>` to your own photos (800x600 works best).
- **Founder photo:** `about.html` ("Meet the founder"). No owner photo was in the files provided, so a placeholder is used.
- **Reviews:** the three testimonials in `index.html` are sample text. Replace with real client reviews.
- **Hero photo:** `assets/img/room.jpg` is cropped from your ad. For best quality, replace with a high-resolution photo of the same name.

## 2. Make booking emails work (client copy + owner copy)
The site has no server, so it uses **EmailJS** (free plan available).
1. Create an account at emailjs.com and connect your email service (Gmail works). Copy the **Service ID**.
2. Create ONE email template. Set **To Email** to `{{to_email}}`, and use these variables in the body:
   `{{audience}} {{to_name}} {{customer_email}} {{customer_phone}} {{address}} {{service}} {{sqft}} {{bedrooms}} {{bathrooms}} {{frequency}} {{addons}} {{date}} {{time}} {{notes}} {{estimate}} {{breakdown}}`
   Copy the **Template ID**.
3. Copy your **Public Key** (Account > General).
4. Open `js/config.js` and paste the three values into `emailjs`.
On every booking the site sends the quote to the client AND a copy to `charlcyrgroup@gmail.com`. Until the keys are added, a prefilled email to the owner opens instead, so no booking is lost.

## 3. Set your real prices
Edit `js/config.js`: rates per sq ft, minimums, add-ons, discounts. Current numbers are **placeholders**, not your real prices.

## 4. Other notes
- Colours are CSS variables at the top of `css/style.css`.
- Contact page form uses the visitor's email app; the booking form is the better lead channel.
