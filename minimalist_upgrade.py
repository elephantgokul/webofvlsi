import os
import re
import glob

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Fonts to Instrument Serif and Manrope
    content = re.sub(
        r'<link href="https://fonts\.googleapis\.com/css2\?family=[^"]*" rel="stylesheet"/>',
        '<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>',
        content,
        flags=re.DOTALL
    )

    # 2. Update Tailwind config
    tailwind_config_replacement = """    tailwind.config = {
      theme: {                                                
        extend: {
          colors: {
            'ink-navy':   '#111111',
            'ink-light':  '#333333',
            'circuit-blue':'#111111',
            'circuit-dark':'#000000',
            'signal-cyan': '#EAEAEA',
            mist:          '#FBFBFA',
            accent:        '#111111',
            surface:       '#FFFFFF',
            'surface-2':   '#F9F9F8',
            default:       '#EAEAEA',
            'text-primary':'#111111',
            'text-secondary':'#787774',
            'pale-blue':   '#E1F3FE',
            'pale-blue-text':'#1F6C9F',
          },
          fontFamily: {
            display: ['"Instrument Serif"','serif'],
            body:    ['"Manrope"','sans-serif'],
            mono:    ['"JetBrains Mono"','monospace'],
          },
          borderRadius: { 'lg':'8px', 'xl':'12px', '2xl':'16px', '3xl':'20px', '4xl':'24px', '5xl':'32px' },
          boxShadow: {
            'sm': '0 1px 2px rgba(0,0,0,0.02)',
            DEFAULT: '0 2px 8px rgba(0,0,0,0.04)',
            'md': '0 4px 12px rgba(0,0,0,0.04)',
            'lg': '0 10px 24px rgba(0,0,0,0.04)',
            'xl': '0 20px 40px rgba(0,0,0,0.04)',
          }
        }
      }
    }"""
    content = re.sub(
        r'tailwind\.config\s*=\s*\{.*?\}\s*\}',
        tailwind_config_replacement,
        content,
        flags=re.DOTALL
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def process_css_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        css = f.read()

    minimalist_css = """
/* =========================================================================
   MINIMALIST EDITORIAL REDESIGN CSS OVERRIDES
   ========================================================================= */

:root {
  --clr-bg: #FBFBFA;
  --clr-surface: #FFFFFF;
  --clr-surface-2: #F9F9F8;
  --clr-border: #EAEAEA;
  --clr-text-primary: #111111;
  --clr-text-secondary: #787774;
  --clr-text-muted: #A3A3A3;
  --clr-accent: #111111;
  --font-display: "Instrument Serif", serif;
  --font-body: "Manrope", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --ink-navy: #111111;
  --circuit-blue: #111111;
  --signal-cyan: #EAEAEA;
  --mist: #FBFBFA;
  --paper: #FFFFFF;
}

body {
  background-color: var(--clr-bg) !important;
  color: var(--clr-text-primary) !important;
  font-family: var(--font-body) !important;
  line-height: 1.6;
}

h1, h2, h3, h4, .font-display {
  font-family: var(--font-display) !important;
  font-weight: 400 !important;
  letter-spacing: -0.02em !important;
  line-height: 1.1 !important;
  color: var(--clr-text-primary) !important;
}

/* Header & Nav */
#site-header {
  background-color: rgba(255, 255, 255, 0.8) !important;
  border-bottom: 1px solid var(--clr-border) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  box-shadow: none !important;
}
#site-header.is-scrolled {
  background-color: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important;
}
#site-header .nav-link {
  color: var(--clr-text-secondary) !important;
  font-weight: 500 !important;
  transition: color 0.2s ease !important;
}
#site-header .nav-link:hover {
  color: var(--clr-text-primary) !important;
}
.brand-text {
  color: var(--clr-text-primary) !important;
  font-weight: 600 !important;
}
body:has(#hero) #site-header:not(.is-scrolled),
body.home-page #site-header:not(.is-scrolled) {
  background-color: transparent !important;
  border-bottom: none !important;
}
body:has(#hero) #site-header:not(.is-scrolled) .nav-link,
body.home-page #site-header:not(.is-scrolled) .nav-link {
  color: var(--clr-text-secondary) !important;
}
body:has(#hero) #site-header:not(.is-scrolled) .brand-text,
body.home-page #site-header:not(.is-scrolled) .brand-text {
  color: var(--clr-text-primary) !important;
}

/* Hero Section */
#hero {
  background: var(--clr-bg) !important;
}
.hero-bg-video, .hero-video-overlay, #hero::before, .trace-draw, .trace-pulse {
  display: none !important;
}
.hero-line, .hero-subhead {
  text-shadow: none !important;
  color: var(--clr-text-primary) !important;
}

/* Buttons */
.btn-primary, button {
  background-color: #111111 !important;
  color: #FFFFFF !important;
  border: none !important;
  box-shadow: none !important;
  font-family: var(--font-body);
  font-weight: 500 !important;
  border-radius: 6px !important;
  padding: 0.6rem 1.25rem !important;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease !important;
}
.btn-primary:hover, button:hover {
  background-color: #333333 !important;
  transform: scale(0.98) !important;
}
.btn-ghost {
  background-color: transparent !important;
  color: #111111 !important;
  border: 1px solid #EAEAEA !important;
  font-weight: 500 !important;
  border-radius: 6px !important;
}
.btn-ghost:hover {
  background-color: #F9F9F8 !important;
  border-color: #D4D4D4 !important;
}

/* Cards (Bento style) */
.surface-card, .surface-card-2, .glass-card, .faculty-card, .student-card {
  background-color: #FFFFFF !important;
  border: 1px solid #EAEAEA !important;
  box-shadow: none !important;
  border-radius: 12px !important;
  transition: box-shadow 0.3s ease, transform 0.3s ease !important;
}
.surface-card::before, .surface-card::after {
  display: none !important;
}
.surface-card:hover, .faculty-card:hover, .student-card:hover {
  box-shadow: 0 12px 32px rgba(0,0,0,0.04) !important;
  transform: translateY(-2px) !important;
  border-color: #D4D4D4 !important;
}

/* Pastels for badges and accents */
.badge {
  background-color: #E1F3FE !important;
  color: #1F6C9F !important;
  border: none !important;
  border-radius: 9999px !important;
  padding: 4px 10px !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.03em !important;
  font-weight: 600 !important;
}

/* Filters & Inputs */
.filter-btn {
  background-color: #F9F9F8 !important;
  color: #787774 !important;
  border: 1px solid transparent !important;
  border-radius: 6px !important;
}
.filter-btn.active {
  background-color: #FFFFFF !important;
  color: #111111 !important;
  border-color: #EAEAEA !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
}
.search-input {
  border: 1px solid #EAEAEA !important;
  background: #FFFFFF !important;
  border-radius: 8px !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
}
.search-input:focus {
  border-color: #111111 !important;
  outline: none !important;
  box-shadow: 0 0 0 1px #111111 !important;
}

/* Data Tables */
.data-table {
  border: 1px solid #EAEAEA !important;
  border-radius: 8px !important;
  overflow: hidden;
}
.data-table th {
  background: #F9F9F8 !important;
  color: #787774 !important;
  border-bottom: 1px solid #EAEAEA !important;
  font-family: var(--font-body) !important;
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
}
.data-table td {
  border-bottom: 1px solid #EAEAEA !important;
  background: #FFFFFF !important;
  color: #111111 !important;
}

/* General cleanups */
section {
  background-color: var(--clr-bg) !important;
}
.bg-mist {
  background-color: var(--clr-bg) !important;
}
.bg-white {
  background-color: var(--clr-surface) !important;
}
"""
    css += "\n\n" + minimalist_css

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(css)

def main():
    base_dir = r"C:\Users\gokul\.gemini\antigravity-ide\scratch\webofvlsi"
    
    css_path = os.path.join(base_dir, "css", "main.css")
    if os.path.exists(css_path):
        process_css_file(css_path)
        print("Updated main.css")

    html_files = glob.glob(os.path.join(base_dir, "*.html")) + glob.glob(os.path.join(base_dir, "pages", "*.html"))
    for html_file in html_files:
        process_html_file(html_file)
        print(f"Updated {html_file}")

if __name__ == "__main__":
    main()
