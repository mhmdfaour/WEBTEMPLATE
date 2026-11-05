# Studio & Form — static business website template

A responsive HTML, CSS and vanilla JavaScript template with parallax scrolling, reveal animations, catalogue filters, mobile navigation, product enquiries, WhatsApp and Google Maps directions. All illustrations are local SVGs; no build tools required.

## Run locally

From this directory:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Open the site in your local browser. Deploy this directory to any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.). `index.html` is Home; `catalogue.html`, `about.html`, and `contact.html` are separate pages. Navigation works as normal file links, including when opened directly from your computer. No npm installation is needed.

## Make it yours

1. Edit `BUSINESS` at the top of `script.js`: email, phone, WhatsApp number (international digits only), address, Google Maps destination and greeting.
2. Replace business name, copy, page title and metadata in `index.html`. Update the fallback email, phone, map and WhatsApp links in the HTML too, so they work without JavaScript. Remove the placeholder-details notice once configured.
3. Replace products and local SVG illustrations. Adjust colours and fonts in `styles.css`. Catalogue can also be renamed Menu for a restaurant; update the category labels and matching `data-category` / `data-filter` values.
4. Google Fonts is optional; local system fonts are used if offline. Remove the CSS import to make the site fully self-contained.

## Contact form and business email

By default, submitting opens the visitor's email app with the business recipient, subject and message prepared. **The visitor must send the email.** This requires a configured email app; it does not deliver mail from the website itself.

For direct delivery, create a form with an HTTPS form provider (for example Formspree), verify your business inbox there, then set `BUSINESS.formEndpoint` to the supplied endpoint. The endpoint must accept JSON fields `name`, `email`, `subject`, `message`, return an HTTP success code only after acceptance, and permit browser CORS requests from your deployed domain. Configure recipient routing, spam protection and any privacy requirements in that service. Test delivery to the actual inbox before launch. Never place SMTP passwords or private API keys in this static site.

The map card is decorative; the arrow opens real Google Maps directions to your configured destination. It does not require an API key. Replace the placeholder destination before publishing. WhatsApp also requires a real business number.

## Accessibility

Includes semantic landmarks, visible keyboard focus, labelled inputs, native required/email validation, an accessible mobile menu, live form status and reduced-motion support. Parallax is disabled when reduced motion is preferred.
