# FarlandsTech

A small, static personal website designed as a custom Linktree alternative.

## Files

- `index.html` — page structure and content
- `style.css` — all visual styling and responsive behavior
- `script.js` — links, interactions, reveal animations and phone parallax
- `images/phones/` — put your real transparent phone PNG/WebP files here
- `images/icons/` — optional custom icons

## Add your real phone images

Replace these placeholder files with your own:

- `images/phones/phone1.png`
- `images/phones/phone2.png`
- `images/phones/phone3.png`
- `images/phones/phone4.png`
- `images/phones/phone5.png`
- `images/phones/phone6.png`
- `images/phones/phone7.png`
- `images/phones/phone8.png`

Transparent PNG/WebP renders work best.

## Change links

Open `script.js` and edit the `LINKS` array near the top. Every button is controlled from that one location.

## Change text

The FarlandsTech title and intro are in `index.html`.

## Profile image

The current profile is an `FT` monogram made with CSS. If you want a real profile image, replace the `.profile-photo` content in `index.html` with an `<img>` and point it at your image.

## GitHub Pages

1. Create a GitHub repository.
2. Upload the contents of this folder.
3. In GitHub, open **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select the branch containing `index.html` and `/root`.
6. Save.

No build step or framework is required.
