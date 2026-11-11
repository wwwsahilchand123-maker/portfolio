# Sahil Chand Rajwar | Cybersecurity Portfolio

A dark, cinematic, single-page portfolio for a cybersecurity student and ethical hacker. Built with HTML5, CSS3, and Vanilla JavaScript. No frameworks, no build step, no npm install.

---

## 1. Overview

- **Stack:** HTML5, CSS3, and Vanilla JavaScript. No frameworks, no build step, no npm install.
- **External resources:** Google Fonts (Unbounded, Inter, JetBrains Mono) and Font Awesome 6.5.2 from CDNs. The site needs internet access to load them.
- **Content:** almost everything you can edit lives in `js/data.js`. Design settings live in CSS variables at the top of `css/style.css`.

---

## 2. Folder structure

```
index.html
README.md
css/
  style.css          design tokens, base styles, components
  responsive.css     breakpoints and mobile layout
  animations.css     keyframes, reveal states, cursor, reduced-motion rules
js/
  data.js            ALL personal content (edit this)
  main.js            rendering, navigation, preloader, contact form
  animations.js      scroll reveal, counters, particles, parallax, cursor
  terminal.js        the interactive terminal section
assets/
  images/            profile photo (profile.jpg)
  projects/          project thumbnails
  certificates/      certificate images (optional)
  icons/             favicon or other icons
```

The asset folders are included for your real profile photo, project images, certificates, and icons. No personal images or certificates were included with the supplied source. Missing optional images use the site fallback.

---

## 3. Run locally

**Option A (quickest):** double-click `index.html`. Everything works except features that need a server.

**Option B (recommended):** from the project folder, run a local server and open the printed address:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

Any static server works (VS Code "Live Server", `npx serve`, etc.).

---

## 4. Edit your content (`js/data.js`)

Open `js/data.js`. Each top-level key below controls one part of the site. Edit values inside the quotes and keep the commas and brackets. **Copy an existing entry and change its values** when adding new items.

| Key | Controls |
|---|---|
| `name`, `fullName`, `initials` | Brand, footer logo, page content |
| `title` | Tag under your name |
| `status` | Hero badge text (for example "AVAILABLE FOR OPPORTUNITIES") |
| `profileImage`, `profileImageAlt` | About-section photo and its alt text |
| `email`, `github`, `linkedin`, `instagram` | Contact list, footer icons, terminal links |
| `hero` | `greeting`, `heading`, `highlight`, `roles`, `description`, `floatCards` |
| `about` | `lead`, `bio`, `education`, `interests`, `goals` |
| `stats` | Counter labels and values |
| `skills` | Skill categories and their items |
| `projects` | Project cards |
| `certificationCategories`, `certifications` | Certification filter buttons and cards |
| `experience` | Learning-journey timeline |
| `terminal` | Terminal prompt (`user`, `host`, `cwd`) and the `whoami` output |
| `contact` | `message` (intro text) and `formEndpoint` (see section 7) |

### 4.1 Name and initials
```javascript
name: "Sahil",
fullName: "Sahil",
initials: "S",
```

### 4.2 Bio and about text
Each entry in `bio` becomes one paragraph. Add or remove paragraphs freely.
```javascript
about: {
  lead: "A short opening sentence.",
  bio: [
    "First paragraph of your biography.",
    "Second paragraph.",
  ],
  education: [
    { degree: "Your degree", institution: "Your university", period: "2023 – Present" },
  ],
  interests: ["Network Security", "Penetration Testing"],
  goals: ["Land a security internship", "Earn a practical certification"],
},
```

### 4.3 Add or edit a project
```javascript
{
  name: "My New Project",
  category: "Web Security",
  description: "One or two sentences about what it does and what you learned.",
  tech: ["Python", "Flask"],
  thumbnail: "assets/projects/my-new-project.jpg", // optional; fallback shows if missing
  github: "https://github.com/your-real-username/my-new-project",
  liveDemo: "", // leave empty to hide the Live Demo button
},
```
- The **GitHub** button is hidden while the URL contains placeholder text such as `your-username`. Replace it with your real URL to show the button.
- The **Live Demo** button appears only when `liveDemo` contains a full `https://` URL.

### 4.4 Skills
Plain strings have no proficiency bar. Add a level only if it reflects an honest self-assessment:
```javascript
{
  name: "Network Security",
  icon: "fa-solid fa-network-wired",   // any Font Awesome 6 free solid/brands class
  items: [
    "TCP/IP",
    "DNS",
    { name: "Nmap", level: 70 },         // level 0–100 draws a meter; omit if unsure
  ],
},
```

### 4.5 Certifications and achievements
Add only credentials you actually hold or events you actually took part in. The `category` must match one entry in `certificationCategories`.
```javascript
{
  title: "Exact certificate title as issued",
  category: "Certification",              // must match certificationCategories
  issuer: "Issuing organization",
  date: "2025-01",
  image: "assets/certificates/my-certificate.jpg", // optional
  verifyUrl: "https://issuer.example/verify/ABC123", // optional, shown only if a real https URL
  description: "Optional one-line summary.",
},
```
Remove the example entries before publishing if they are not yours. The `certifications` array can be empty; the section then shows an empty state.

### 4.6 Learning journey (timeline)
```javascript
{
  type: "ctf",            // education | learning | lab | project | ctf | milestone
  date: "2025",
  title: "CTF participation",
  org: "Team name or event",
  description: "What you did and what you learned.",
},
```

### 4.7 Statistics
```javascript
stats: [
  { label: "Projects Completed", auto: "projects" },        // counts entries in projects
  { label: "Technologies Learned", auto: "technologies" },  // counts unique skill names
  { label: "Certifications", auto: "certifications" },      // counts entries in certifications
  { label: "CTF Challenges", value: 0, suffix: "+" },       // manual: update the number yourself
],
```
`CTF Challenges` is a manual value. It shows `0+` until you change `value`. Set it only to a number you can back up.

### 4.8 Social links
```javascript
email: "you@yourdomain.com",
github: "https://github.com/your-real-username",
linkedin: "https://www.linkedin.com/in/your-real-username",
instagram: "", // empty = hidden
```
Any value containing placeholder text (`your-`, `example.com`) is hidden everywhere: contact list, footer icons, and terminal.

### 4.9 Terminal
```javascript
terminal: {
  user: "sahil",
  host: "portfolio",
  cwd: "~",
  whoami: [
    "Cybersecurity Student",
    "Ethical Hacking Enthusiast",
    "Security Researcher in Progress",
  ],
},
```

### 4.10 Text that lives in `index.html`
Navigation labels, section titles and sub-headings, the footer navigation, the hero call-to-action labels, the contact form labels, and the SEO `<meta>` tags are in `index.html`. Edit them there. The preloader's terminal lines are the `PRELOADER_LINES` array at the top of `js/main.js`.

### 4.11 Placeholder warnings
On load, the browser console lists every value in `js/data.js` that still contains placeholder text, such as `[Your University Name]`, `[Start Year]`, or `your-username`. Open the console (F12) before publishing and replace each one. Placeholder text is hidden or flagged; it is not a real fact about you.

---

## 5. Images

| Image | Path | Recommended size | Notes |
|---|---|---|---|
| Profile photo | `assets/images/profile.jpg` | 800 × 1000 px, under 200 KB | Square or portrait crop works |
| Project thumbnails | `assets/projects/<name>.jpg` | 1600 × 1000 px (16:10), under 250 KB | Set the path in `thumbnail` |
| Certificate images | `assets/certificates/<name>.jpg` | 1600 px wide, under 300 KB | Optional; set `image` |

- Optimize images before uploading (for example with Squoosh or a similar tool). JPG or WebP both work.
- Images load lazily, so they do not slow the first screen.
- **If an image is missing**, the site shows a red-tinted shield placeholder instead of a broken image. Add the file later and the placeholder is replaced automatically on the next load.

---

## 6. Colours, fonts, and spacing (CSS variables)

All design tokens are in the `:root` block at the top of `css/style.css`.

| Variable | Default | Purpose |
|---|---|---|
| `--bg-primary` | `#080808` | Main background |
| `--bg-secondary` | `#111111` | Cards and panels |
| `--accent` | `#E50920` | Primary red accent |
| `--accent-2` | `#FF263D` | Secondary red, hover states |
| `--accent-glow` | `rgba(229, 9, 32, 0.45)` | Glow shadows |
| `--text` | `#FFFFFF` | Main text |
| `--text-muted` | `#A1A1A1` | Secondary text |
| `--border` / `--border-accent` | subtle white / red | Card and input borders |
| `--font-display` / `--font-body` / `--font-mono` | Unbounded / Inter / JetBrains Mono | Typefaces |
| `--container` | `1240px` | Maximum content width |
| `--radius` / `--radius-lg` | `16px` / `24px` | Corner radii |
| `--nav-h` | `76px` | Navbar height (also used for scroll offset) |
| `--ease` / `--dur` | easing curve / `0.35s` | Motion timing |

**Changing the accent colour:** update `--accent`, `--accent-2`, and `--accent-glow` together. The particle canvas reads `--accent` automatically.

**Changing the navbar height:** update `--nav-h` in `style.css`. Scroll offsets are calculated from it.

---

## 7. Contact form and backend setup

The contact form validates input in the browser (required fields, email format, length limits). It has a hidden honeypot field that silently blocks many bots. What happens after validation depends on `contact.formEndpoint` in `js/data.js`.

### Option A: No backend (default, `formEndpoint: ""`)
When the form is valid, the visitor's **email app opens** with the subject and message pre-filled, addressed to your `email`. The visitor presses Send in their own mail client.

- Pros: zero setup, no third-party service, no data stored by anyone but the visitor's mail provider.
- Limits: the visitor needs an email app or webmail configured. Very long messages can be truncated by some mail clients. Nothing is stored on the server, so there is no inbox record of the message on the site side.

### Option B: Formspree (recommended for direct delivery)
1. Create a free account at **https://formspree.io** and create a new form.
2. Set the recipient to your email and confirm it when Formspree asks.
3. Copy the form endpoint, which looks like `https://formspree.io/f/abcd1234`.
4. In `js/data.js`:
   ```javascript
   contact: {
     message: "…",
     formEndpoint: "https://formspree.io/f/abcd1234",
   },
   ```
5. Submit a test message and check your inbox and spam folder.

Check Formspree's current plan limits and privacy terms before relying on it.

### Option C: Web3Forms
1. Get a free access key at **https://web3forms.com** using your email address.
2. In `index.html`, add this hidden field inside `<form id="contactForm">`:
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
   ```
3. In `js/data.js`:
   ```javascript
   formEndpoint: "https://api.web3forms.com/submit",
   ```
4. Submit a test message. Web3Forms sends it to the email tied to your access key.

The access key is public by design (it appears in the page source). It only allows submissions to your own address.

### Option D: Your own backend
If you run a server, set `formEndpoint` to its URL. The site sends a `POST` with `multipart/form-data` containing `name`, `email`, `subject`, `message`, and an empty `hp_field`. Return a 2xx status for success and any other status for failure. The browser will show the success or error message accordingly.

### Spam and privacy notes
- The honeypot blocks simple bots. For stronger protection, enable the spam filter in your form provider. Adding a CAPTCHA requires editing `index.html` and is outside the scope of this template.
- If you collect messages, add a short privacy note near the form that says who receives the message and how long it is kept.

---

## 8. Terminal

The terminal is read-only. It only runs the predefined commands in `js/terminal.js`. It never executes anything on your computer or sends data anywhere.

| Command | Output |
|---|---|
| `help` | List of commands |
| `about` | Name, title, and the lead sentence |
| `skills` | Each skill category and its tools |
| `projects` | Numbered project list with GitHub links where usable |
| `contact` | Contact links and a link to the contact form |
| `whoami` | The three lines from `terminal.whoami` |
| `clear` | Clears the output |

Navigation tips: press **↑ / ↓** to cycle through command history. Tap the quick-command buttons under the terminal on touch screens.

To add a command, add a function to the `COMMANDS` object in `js/terminal.js`, and add its name to `COMMAND_NAMES` so it appears as a button.

---

## 9. Animations, accessibility, and performance

- **Preloader:** a terminal-style boot sequence, then a fade into the homepage. It takes about two seconds and is shorter with reduced motion.
- **Reduced motion:** when the operating system's "reduce motion" setting is on, the site turns off the preloader animation, typing, particles, count-up, parallax, meter animation, and scroll reveal motion. Content appears immediately.
- **Custom cursor:** desktop mouse users only. Touch devices and reduced-motion visitors see the normal cursor.
- **Keyboard:** all links, buttons, filters, form fields, and terminal commands are reachable by Tab. A skip link jumps to the main content. Focus rings are visible. The mobile menu closes with Escape.
- **Contrast:** primary text is white on near-black; muted text is `#A1A1A1` on black. Red accents are used for decoration and large headings, not for small body text.
- **Performance:** no frameworks or large libraries. Images are lazy-loaded with reserved dimensions. Particles are capped at 56 and pause when the tab is hidden.

---

## 10. SEO and sharing

Open `index.html` and update the `<title>`, `<meta name="description">`, Open Graph tags, and the canonical URL to match your real domain. Add your favicon to `assets/icons/` and link it in the `<head>`.

---

## 11. Deploy

Upload the entire folder so `index.html` is at the root of the site.

- **GitHub Pages:** push the folder to a repository, then go to Settings → Pages → deploy from the main branch, root folder.
- **Netlify or Cloudflare Pages:** drag the folder onto the dashboard, or connect the repository. No build command is needed.

After deploying, test on a real phone, not only in browser DevTools.

---

## 12. Manual test checklist

Work through this before publishing. The template was reviewed by reading the code; it has not been checked in every browser or device, so these tests are the verification step.

**Load and preloader**
- [ ] Preloader runs, progress reaches 100%, then the homepage fades in.
- [ ] With the OS "reduce motion" setting on, the preloader is short and no motion plays.
- [ ] Browser console shows no red errors. Placeholder warnings are listed and handled.

**Navigation**
- [ ] Every navbar link scrolls to the correct section, and the heading is not hidden under the navbar.
- [ ] The active navbar link updates as you scroll.
- [ ] The footer navigation links work. The back-to-top button returns to the top.
- [ ] Mobile menu opens, closes with the X button and with Escape, and closes after a link is tapped.
- [ ] The skip link moves focus to the main content.

**Hero and about**
- [ ] Badge, heading (red words highlighted), greeting, role line, description, and both CTAs appear correctly.
- [ ] Typing effect cycles through the roles.
- [ ] Floating cards appear on desktop and do not cover the heading on phones.
- [ ] Profile photo shows, or the placeholder shows when the file is missing.
- [ ] Statistics count up to the values in `data.js`. CTF Challenges shows `0+` until you change it.

**Skills, projects, certifications, timeline**
- [ ] Each skill category and item appears. No proficiency bars appear unless a `level` is set.
- [ ] Five project cards appear. GitHub buttons are hidden while URLs contain placeholders. Live Demo is hidden when empty.
- [ ] Project thumbnails scale correctly; missing images show the placeholder.
- [ ] Certification filter buttons show the right counts and filter the cards. The empty state appears for a category with no entries.
- [ ] Verify links open in a new tab and only when a real URL is set.
- [ ] Timeline items alternate and display their type labels and dates.

**Terminal**
- [ ] `help`, `about`, `skills`, `projects`, `contact`, `whoami`, and `clear` all work.
- [ ] An unknown command prints the "command not found" message.
- [ ] Up and down arrows cycle through command history.
- [ ] Quick-command buttons run the command and focus the input.
- [ ] Clicking empty terminal space focuses the input.
- [ ] The `contact` command's form link scrolls to the contact section.

**Contact form**
- [ ] Submitting an empty form shows errors for all four fields and focuses the first invalid field.
- [ ] An invalid email shows a format error. Errors clear as you correct the field.
- [ ] A valid submission opens your email app (Option A) or shows success or error (Options B–D).
- [ ] The submit button shows "Sending…" and is disabled while a request is in progress.
- [ ] A non-empty hidden honeypot field silently blocks submission.

**Footer**
- [ ] Social icons appear only for usable links and open in a new tab.
- [ ] The copyright year is the current year.

**Responsive**
- [ ] No horizontal scrolling at 360, 390, 768, 1024, and 1440 px widths.
- [ ] Text is readable and buttons are easy to tap on a phone.
- [ ] Landscape phone layout works.
- [ ] Custom cursor does not appear on touch devices.

**Accessibility and quality**
- [ ] Tab through the whole page. Focus rings are visible on every interactive element.
- [ ] Run Lighthouse (Chrome DevTools) for Accessibility, Performance, and SEO. Fix any issues flagged.
- [ ] Validate `index.html` with the W3C validator.

---

## 13. Troubleshooting and known limitations

- **The page stays on the preloader or the hero text is invisible:** open the console and look for a red error. The most common cause is a wrong `<script>` path in `index.html`, or a syntax error in `js/data.js` (a missing comma or bracket).
- **A section is empty:** check that its key in `js/data.js` exists and that its entries are inside `[ ]`.
- **Icons are missing:** Font Awesome loads from a CDN. Check your internet connection.
- **Fonts look like system fonts:** Google Fonts did not load. Check your connection.
- **Mailto message is cut off:** some mail clients limit the length of pre-filled messages. Use Option B, C, or D for long messages.
- **The GitHub button is missing:** the URL still contains placeholder text such as `your-username`. Replace it with your real URL.
- **A project shows the placeholder image:** the file path in `thumbnail` is wrong, or the image is not uploaded yet.
- **Placeholder text matched a real word:** the placeholder check looks for `your-`, `your_`, `example.com`, and bracketed text such as `[Year]`. If a real value triggers it, rephrase the value.
- **Cursor looks off-centre:** the custom cursor elements must be centred with `transform: translate(-50%, -50%)` in `css/animations.css`.


## Build and verification status

The JavaScript files were checked for syntax during packaging. Browser interaction, mobile layout, contact service delivery, and external CDN loading still need a manual check using section 12. Keep your links, images, and portfolio details current in js/data.js before publishing.

The TryHackMe achievement panel links to the public profile so visitors can see its latest rooms and badges there. The portfolio does not scrape TryHackMe or display unverified live counters; an official, stable embed would be needed for that.



