import os
import re
import glob

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Fonts to Space Mono
    content = re.sub(
        r'<link href="https://fonts\.googleapis\.com/css2\?family=[^"]*" rel="stylesheet"/>',
        '<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"/>',
        content,
        flags=re.DOTALL
    )

    # 2. Update Tailwind config
    tailwind_config_replacement = """    tailwind.config = {
      theme: {                                                
        extend: {
          colors: {
            'ink-navy':   '#000000',
            'ink-light':  '#000000',
            'circuit-blue':'#000000',
            'circuit-dark':'#000000',
            'signal-cyan': '#FF2A2A',
            mist:          '#ffffff',
            accent:        '#FF2A2A',
            surface:       '#ffffff',
            'surface-2':   '#f4f4f0',
            default:       '#000000',
          },
          fontFamily: {
            display: ['"Space Mono"','monospace'],
            body:    ['"Space Mono"','monospace'],
            mono:    ['"Space Mono"','monospace'],
          },
          borderRadius: { 'lg':'0', 'xl':'0', '2xl':'0', '3xl':'0', '4xl':'0', '5xl':'0', 'full':'0' },
          boxShadow: {
            'sm': '2px 2px 0px #000',
            DEFAULT: '4px 4px 0px #000',
            'md': '4px 4px 0px #000',
            'lg': '6px 6px 0px #000',
            'xl': '8px 8px 0px #000',
            '2xl': '12px 12px 0px #000',
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

    # 3. Strip rounded classes directly just to be safe
    content = re.sub(r'\brounded-(sm|md|lg|xl|2xl|3xl|full|[a-z0-9]+)\b', 'rounded-none', content)
    
    # 4. Enforce solid borders instead of subtle ones
    content = re.sub(r'border-white/10', 'border-black border-2', content)
    content = re.sub(r'border-white/20', 'border-black border-2', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def process_css_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        css = f.read()

    brutalist_css = """
/* =========================================================================
   BRUTALIST REDESIGN CSS OVERRIDES
   ========================================================================= */

:root {
  --clr-bg: #ffffff;
  --clr-surface: #ffffff;
  --clr-surface-2: #f4f4f0;
  --clr-border: #000000;
  --clr-text-primary: #000000;
  --clr-text-secondary: #000000;
  --clr-text-muted: #000000;
  --clr-accent: #FF2A2A;
  --font-display: "Space Mono", monospace;
  --font-body: "Space Mono", monospace;
  --font-mono: "Space Mono", monospace;
  --ink-navy: #000000;
  --circuit-blue: #000000;
  --signal-cyan: #FF2A2A;
  --mist: #ffffff;
  --paper: #ffffff;
}

/* Force sharp corners */
* {
  border-radius: 0 !important;
}

/* Typography Overrides */
body, h1, h2, h3, h4, h5, h6, p, a, span, div {
  font-family: "Space Mono", monospace !important;
}
h1, h2, h3, h4 {
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: -0.03em !important;
  color: #000000 !important;
}
.hero-line, .hero-subhead {
  text-shadow: none !important;
  color: #000 !important;
}

/* Layout Structural Borders */
section, header, footer {
  border-bottom: 3px solid #000 !important;
  background-color: #fff !important;
}
#hero {
  background: #fff !important;
}
.hero-bg-video, .hero-video-overlay, #hero::before, .trace-draw, .trace-pulse {
  display: none !important;
}

/* Header & Nav */
#site-header {
  background-color: #fff !important;
  border-bottom: 3px solid #000 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}
#site-header.is-scrolled {
  background-color: #fff !important;
  box-shadow: none !important;
}
#site-header .nav-link, .brand-text {
  color: #000 !important;
  text-transform: uppercase;
  font-weight: 700 !important;
  border-right: 2px solid #000;
  border-radius: 0 !important;
  margin: 0 !important;
}
#site-header .nav-link:hover {
  background-color: #000 !important;
  color: #fff !important;
}
body:has(#hero) #site-header:not(.is-scrolled),
body.home-page #site-header:not(.is-scrolled) {
  background-color: #fff !important; 
}
body:has(#hero) #site-header:not(.is-scrolled) .nav-link,
body.home-page #site-header:not(.is-scrolled) .nav-link,
body:has(#hero) #site-header:not(.is-scrolled) .brand-text,
body.home-page #site-header:not(.is-scrolled) .brand-text {
  color: #000 !important;
}

/* Buttons */
.btn-primary, .btn-secondary, .btn-ghost, button {
  background-color: #fff !important;
  color: #000 !important;
  border: 3px solid #000 !important;
  box-shadow: 4px 4px 0px #000 !important;
  text-transform: uppercase;
  font-weight: 700 !important;
  transition: none !important;
  border-radius: 0 !important;
  padding: 0.75rem 1.5rem !important;
}
.btn-primary:hover, .btn-secondary:hover, .btn-ghost:hover, button:hover {
  background-color: #000 !important;
  color: #fff !important;
  box-shadow: none !important;
  transform: translate(4px, 4px) !important;
}

/* Cards (Surface, Faculty, Student, etc.) */
.surface-card, .surface-card-2, .glass-card, .faculty-card, .student-card {
  background-color: #fff !important;
  border: 3px solid #000 !important;
  box-shadow: 6px 6px 0px #000 !important;
  transition: none !important;
  border-radius: 0 !important;
}
.surface-card::before, .surface-card::after {
  display: none !important;
}
.surface-card:hover, .faculty-card:hover, .student-card:hover {
  box-shadow: none !important;
  transform: translate(6px, 6px) !important;
  background-color: #f4f4f0 !important;
}

/* Filters & Inputs */
.filter-btn {
  background-color: #fff !important;
  color: #000 !important;
  border: 2px solid #000 !important;
}
.filter-btn.active {
  background-color: #000 !important;
  color: #fff !important;
}
.search-input {
  border: 3px solid #000 !important;
  box-shadow: 4px 4px 0px #000 !important;
  background: #fff !important;
}
.search-input:focus {
  box-shadow: none !important;
  transform: translate(4px, 4px);
}

/* Data Tables */
.data-table th {
  background: #000 !important;
  color: #fff !important;
  border: 2px solid #000 !important;
  text-transform: uppercase;
}
.data-table td {
  border: 2px solid #000 !important;
  background: #fff !important;
  color: #000 !important;
}

/* Podium & Badges */
.podium-base {
  background: #fff !important;
  border: 3px solid #000 !important;
  box-shadow: 4px 4px 0px #000 !important;
}
.badge {
  background: #fff !important;
  color: #000 !important;
  border: 2px solid #000 !important;
  text-transform: uppercase;
  font-weight: 700;
}
"""
    # Append the brutalist styles to the end of main.css to override everything
    css += "\n\n" + brutalist_css

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(css)

def main():
    base_dir = r"C:\Users\gokul\.gemini\antigravity-ide\scratch\webofvlsi"
    
    # Process CSS
    css_path = os.path.join(base_dir, "css", "main.css")
    if os.path.exists(css_path):
        process_css_file(css_path)
        print("Updated main.css")

    # Process all HTML files
    html_files = glob.glob(os.path.join(base_dir, "*.html")) + glob.glob(os.path.join(base_dir, "pages", "*.html"))
    for html_file in html_files:
        process_html_file(html_file)
        print(f"Updated {html_file}")

if __name__ == "__main__":
    main()
