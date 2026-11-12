# SIET VLSI Design and Technology Department Website

Official web portal for the Department of Electronics Engineering (VLSI Design and Technology) at Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore. Established in 2024.

## Overview

The website serves as the primary informational hub for the department, providing:
- Academic curriculum, syllabus, and laboratory overviews (Cadence, Synopsys, and FPGA platforms)
- Faculty directory and administrative leadership
- Student cohort directories and portfolios
- Departmental event archives and upcoming technical workshops
- Research disclosures, student awards, and sports/cultural achievements
- Administrative management system for dynamic event and gallery publishing

## Technology Stack

- Markup: Semantic HTML5 with light-theme styling and accessibility metadata
- Styling: Tailwind CSS (CDN-delivered), custom CSS design tokens (`css/main.css`, `css/spatial.css`, `css/events-conducted.css`)
- Scripting: Vanilla ECMAScript (no runtime framework dependencies)
- Icons: Font Awesome 6
- Animations: AOS (Animate on Scroll)
- Backend: Supabase (PostgreSQL, Supabase Auth, Row-Level Security, Storage Buckets)
- Caching: Service Worker (`sw.js`) with cache busting (`vlsi-v21`)
- Hosting: Static web server / GitHub Pages

## Directory Structure

```text
├── index.html                 # Department homepage
├── 404.html                   # Not Found error page
├── offline.html               # Service Worker offline fallback
├── manifest.json              # Progressive Web App manifest
├── robots.txt                 # Search engine crawler policies
├── sitemap.xml                # Canonical XML sitemap
├── sw.js                      # Service Worker cache management
├── assets/                    # Static assets
│   ├── images/                # Department logos, faculty portraits, awards, banners
│   └── videos/                # Departmental video recordings
├── css/                       # Core stylesheets
│   ├── main.css               # Global typography, color variables, layout primitives
│   ├── spatial.css            # Spatial navigation and interaction styles
│   └── events-conducted.css   # Archive styling for past event reports
├── data/                      # Client-side data stores
│   ├── events-data.js         # Canonical unified event archive (22 events)
│   ├── events-conducted.js    # Compatibility wrapper for activity reports
│   ├── gallery-static.js      # Static gallery fallback
│   └── site-data.js           # Static site configuration
├── js/                        # Client-side application modules
│   ├── api.js                 # Unified API client with Supabase + static fallback
│   ├── events-manager.js      # Event loader with Supabase + static merge and deduplication
│   ├── faculty.js             # Faculty rendering and ordering logic
│   ├── supabase-config.js     # Supabase client initialization
│   ├── admin-media.js         # Media upload and storage management
│   └── main.js                # Global navigation, mobile drawer, scroll-to-top
└── pages/                     # Subpages
    ├── achievements.html      # Academic, sports, and cultural achievements
    ├── admin.html             # Protected administrative dashboard
    ├── admin-login.html       # Administrative authentication portal
    ├── admin-gallery.html     # Administrative gallery media manager
    ├── alumni.html            # Alumni directory and engagements
    ├── calendar.html          # Academic calendar and timeline
    ├── contact.html           # Department contact details and inquiry form
    ├── event-detail.html      # Individual event report and photo gallery
    ├── events.html            # Public events tab (Upcoming and Past)
    ├── events-conducted.html  # Comprehensive conducted events archive
    ├── faculty.html           # Faculty directory
    ├── gallery.html           # Photo and video gallery
    ├── hod.html               # HOD desk and message
    ├── labs.html              # Laboratories and EDA toolchain
    ├── leaderboard.html       # Student competition points leaderboard
    ├── news.html              # News and announcements
    ├── notices.html           # Department notice board
    ├── placements.html        # Placement records and recruiters
    ├── privacy.html           # Privacy policy
    ├── research.html          # Research areas and publication updates
    ├── resources.html         # Curriculum downloads and course notes
    ├── setup.html             # Administrative database configuration guide
    ├── stats.html             # Department statistics and metrics
    ├── student-detail.html    # Individual student portfolio
    ├── students.html          # Student directory
    └── workshops.html         # Hands-on technical workshops
```

## Running Locally

Serve the repository with any local HTTP server:

Using Python 3:
```bash
python -m http.server 8080
```

Using Node.js:
```bash
npx serve .
```

Open `http://localhost:8080` in your web browser.

## Administration System

The site includes an administrative management system located at `pages/admin.html` and `pages/admin-login.html`:
- Authentication: Handled through Supabase Auth (email and password). Unauthenticated users are redirected to `pages/admin-login.html`.
- Events Management: Allows authorized administrators to create, edit, toggle publish status, and delete events.
- Data Synchronization: Public pages automatically merge events published in Supabase with the static dataset (`data/events-data.js`), deduplicating records by title and event date.
- Gallery Management: Enables administrators to upload event photographs and link them to categories.
- Security: Protected routes enforce client-side auth checks and meta `noindex, nofollow` headers to prevent search indexing. Database tables utilize Supabase Row-Level Security (RLS) policies.

## Content Security Policy (CSP)

All pages define strict Content Security Policies that restrict resource execution:
- Scripts are restricted to `'self'`, inline hashes/scripts, and trusted CDNs (Tailwind, AOS, Supabase JS, Font Awesome).
- Styles are restricted to `'self'`, inline styles, and Google Fonts / CDN stylesheets.
- External placeholder services (`via.placeholder.com`) are explicitly disallowed. Fallback handlers gracefully hide missing images or resolve locally.

