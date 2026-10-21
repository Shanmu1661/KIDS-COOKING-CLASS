# 🧑‍🍳 Little Chefs Academy
### Kids Cooking Class & Culinary Camp HTML5 Template

A fun, hands-on, modern, and accessible website template built specifically for **Kids Cooking Schools, Children's Culinary Camps, and Youth Baking Workshops**. 

Built with **HTML5, CSS3, ES6 JavaScript, Bootstrap 5.3, and Tailwind CSS**. Includes a dedicated **Parent Login Portal** and **Parent Dashboard** for managing child enrollments, tracking upcoming class schedules, and accessing session photo albums.

---

## 🌟 Key Features

1. **Young Chef Highlights & Hall of Fame**:
   - Showcase weekly student culinary milestones with star ratings and photos.
   - Non-repetitive, contextually relevant, high-resolution photography on every single card.

2. **Classes Organized by Age Group**:
   - **Tiny Tasters (Ages 3–5)**: Sensorial food play, dough kneading, berry parfaits, measuring fun.
   - **Little Chefs (Ages 6–9)**: Safe knife ergonomics, handmade pasta & gnocchi, skillet quesadillas, mini quiches.
   - **Junior Gourmet (Ages 10–13)**: Induction sautéing, emulsion sauces, yeast fermentation, chemistry concepts.
   - **Teen Masterclass (Ages 14–17)**: French patisserie, macaronage, mother sauces, knife speed, culinary career prep.

3. **Summer Camps Portal**:
   - 4 Signature camp tracks (*Global Gastronomy, Master Baker, Farm-to-Kitchen, Junior Iron Chef*).
   - Weekly dates and availability status table with real-time slot tags.
   - "A Day in the Life at Camp" schedule timeline.

4. **Parent Login Portal & Dashboard**:
   - **Tabbed Sign In & Register** with 1-click Quick Demo Parent Login (`Sarah Miller`).
   - Password strength indicator meter & visibility toggle.
   - **Child Profile Management**: Register children, track severe allergy alerts (peanut-free, dairy, gluten), and view earned skill badges.
   - **Class & Camp Session Enrollment Engine**: Select child, pick session dates, and checkout via simulated payment.
   - **Upcoming Schedule & Attendance**: Track confirmed kitchen island workstations with one-click calendar export (iCal/Google Calendar format) and session rescheduling.
   - **Session Photo Albums**: High-resolution photo gallery with zoom lightbox modal and download button.
   - **Family Recipe Vault**: Step-by-step printable recipes taught in class.

5. **Universal Design & Technical Highlights**:
   - 🌓 **Dark / Light Mode Toggle**: Seamless switcher with `localStorage` persistence and system preference detection (`prefers-color-scheme`).
   - 🌐 **Full RTL (Right-to-Left) Support**: Native RTL toggle with mirrored layouts and direction-aware icons for Arabic and Hebrew.
   - ♿ **WCAG 2.1 AA Accessibility**: Semantic HTML5, skip-to-content links, ARIA landmarks, and high-contrast keyboard focus rings.
   - ⚡ **Skeleton Loaders**: Dedicated interactive preview toggle to showcase skeleton placeholder states.
   - ⏱️ **Interactive Cook-Along Timer**: Real-time start, pause, and reset timer widget for recipes.
   - 🛡️ **Client-Side Live Form Validation**: Instant feedback, validation checkmarks, tooltips, and toast alert notifications.

---

## 📁 File Structure

```
child-cooking-class/
├── index.html                   # Root redirect to pages/index.html
├── robots.txt                   # Production-ready SEO crawler instructions
├── sitemap.xml                  # XML sitemap template
├── README.md                    # Project README & guide
├── assets/
│   ├── css/
│   │   ├── style.css            # Main CSS variables, design tokens & components
│   │   ├── dark-mode.css        # Dark mode color tokens & Bootstrap overrides
│   │   └── rtl.css              # Complete Right-to-Left (RTL) layout overrides
│   ├── js/
│   │   ├── main.js              # Theme switcher, RTL toggle, form validation & timer
│   │   └── dashboard.js         # Child management, enrollment engine, schedule & photos
│   └── images/                  # Local assets directory
├── pages/
│   ├── index.html               # Home page with hero, highlights, camps & parent teaser
│   ├── about.html               # Company story, safety standards & certified chef mentors
│   ├── services.html            # Core culinary services, party packages, STEM field trips & starter kits
│   ├── classes.html             # Age-organized curriculum with category filters & skeleton preview
│   ├── camps.html               # Summer culinary camps, weekly schedule & daily routine
│   ├── gallery.html             # Young chef highlights & photo/video lightbox gallery
│   ├── blog.html                # Culinary articles, kid recipes & food chemistry
│   ├── blog-detail.html         # Canonical blog detail page with proper layout, sticky sidebar & comments
│   ├── blog-*.html              # 9+ dedicated blog detail guides (recipes, STEM experiments, safety)
│   ├── contact.html             # Contact form with validation, map mockup, hours & FAQs
│   ├── login.html               # Parent portal sign-in/register with demo auto-fill
│   ├── dashboard.html           # Full parent portal with enrollment, schedules & photos
│   ├── 404.html                 # Playful "Oops! The Soufflé Collapsed!" error page
│   └── coming-soon.html         # Pre-launch countdown timer & notification signup
└── documentation/
    └── index.html               # Comprehensive interactive HTML documentation guide
```

---

## 🚀 Quick Start Guide

This template is built with zero build-step dependencies. You can run it immediately in any browser or local web server:

### Option 1: Live Server (VS Code)
Right-click on `index.html` or `pages/index.html` and select **"Open with Live Server"**.

### Option 2: Python HTTP Server
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000/` in your browser.

---

## 🎨 Color Palette & Design Tokens

Edit `assets/css/style.css` to customize the primary color palette:

```css
:root {
  --color-primary: #FF5E36;          /* Tangerine Chef Apron */
  --color-primary-hover: #E04822;
  --color-secondary: #10B981;        /* Fresh Basil Mint */
  --color-accent-gold: #FFB703;      /* Honey Dijon */
  --color-accent-purple: #8B5CF6;    /* Berry Purple */
}
```

---

## 📜 Credits & Third-Party Assets

- **Frameworks**: [Bootstrap 5.3](https://getbootstrap.com/) & [Tailwind CSS CDN](https://tailwindcss.com/)
- **Icons**: [Font Awesome 6.5.1](https://fontawesome.com/)
- **Typography**: [Google Fonts (Fredoka & Plus Jakarta Sans)](https://fonts.google.com/)
- **Photography**: [Unsplash](https://unsplash.com/) (Hand-curated, non-repetitive culinary photography)

---

## 📄 License
Created for **Little Chefs Academy**. All code is standard-compliant HTML5/CSS3/JavaScript.
