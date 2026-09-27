import os
import re
import glob

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Fonts to Nunito
    content = re.sub(
        r'<link href="https://fonts\.googleapis\.com/css2\?family=[^"]*" rel="stylesheet"/>',
        '<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>',
        content,
        flags=re.DOTALL
    )

    # 2. Update Tailwind config
    tailwind_config_replacement = """    tailwind.config = {
      theme: {                                                
        extend: {
          colors: {
            'ink-navy':   '#2D3748',
            'ink-light':  '#4A5568',
            'circuit-blue':'#5A67D8',
            'circuit-dark':'#434190',
            'signal-cyan': '#00B5D8',
            mist:          '#EDF2F7',
            accent:        '#5A67D8',
            surface:       '#F7FAFC',
            'surface-2':   '#E2E8F0',
            default:       '#A0AEC0',
          },
          fontFamily: {
            display: ['"Nunito"','sans-serif'],
            body:    ['"Nunito"','sans-serif'],
            mono:    ['"Nunito"','sans-serif'],
          },
          borderRadius: { 'lg':'16px', 'xl':'24px', '2xl':'32px', '3xl':'40px', '4xl':'48px', '5xl':'56px', 'full':'9999px' },
          boxShadow: {
            'sm': '4px 4px 10px rgba(166,180,200,0.5), -4px -4px 10px rgba(255,255,255,0.9), inset 1px 1px 2px rgba(255,255,255,0.8), inset -1px -1px 2px rgba(166,180,200,0.2)',
            DEFAULT: '8px 8px 16px rgba(166,180,200,0.5), -8px -8px 16px rgba(255,255,255,0.9), inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(166,180,200,0.2)',
            'md': '10px 10px 20px rgba(166,180,200,0.5), -10px -10px 20px rgba(255,255,255,0.9), inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(166,180,200,0.2)',
            'lg': '12px 12px 24px rgba(166,180,200,0.5), -12px -12px 24px rgba(255,255,255,0.9), inset 3px 3px 6px rgba(255,255,255,0.8), inset -3px -3px 6px rgba(166,180,200,0.2)',
            'xl': '20px 20px 40px rgba(166,180,200,0.6), -20px -20px 40px rgba(255,255,255,1), inset 4px 4px 8px rgba(255,255,255,0.9), inset -4px -4px 8px rgba(166,180,200,0.3)',
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

    claymorphism_css = """
/* =========================================================================
   3D CLAYMORPHISM REDESIGN CSS OVERRIDES
   ========================================================================= */

:root {
  --clr-bg: #E6EEF4;
  --clr-surface: #E6EEF4;
  --clr-border: transparent;
  --clr-text-primary: #2D3748;
  --clr-text-secondary: #4A5568;
  --clr-accent: #5A67D8;
  --font-display: "Nunito", sans-serif;
  --font-body: "Nunito", sans-serif;
  --font-mono: "Nunito", sans-serif;
}

body {
  background-color: var(--clr-bg) !important;
  color: var(--clr-text-primary) !important;
  font-family: var(--font-body) !important;
}

h1, h2, h3, h4, h5, h6, .font-display {
  font-family: var(--font-display) !important;
  font-weight: 900 !important;
  color: var(--clr-text-primary) !important;
}

/* Force pill shapes and rounded corners globally on all standard elements */
* {
  border-color: transparent !important;
}
img, svg {
  border-radius: inherit !important;
}

/* Header & Nav */
#site-header {
  background-color: rgba(230, 238, 244, 0.8) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: none !important;
  box-shadow: 0px 10px 20px rgba(166, 180, 200, 0.4), inset 0px -2px 4px rgba(255,255,255,0.6) !important;
  border-radius: 0 0 32px 32px !important;
  margin: 0 !important;
}
#site-header.is-scrolled {
  background-color: rgba(230, 238, 244, 0.95) !important;
}
#site-header .nav-link {
  color: var(--clr-text-secondary) !important;
  font-weight: 700 !important;
  transition: all 0.2s ease !important;
  border-radius: 9999px !important;
  padding: 8px 16px !important;
}
#site-header .nav-link:hover {
  background-color: #D6E4F0 !important;
  color: var(--clr-accent) !important;
  box-shadow: inset 3px 3px 6px rgba(166,180,200,0.5), inset -3px -3px 6px rgba(255,255,255,0.9) !important;
}

/* Hero Section */
#hero {
  background: var(--clr-bg) !important;
}
.trace-draw, .trace-pulse {
  display: none !important;
}
#hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at top left, #FFFFFF 0%, transparent 60%),
              radial-gradient(circle at bottom right, rgba(90, 103, 216, 0.1) 0%, transparent 60%);
  z-index: -1;
}

/* Buttons */
.btn-primary, button {
  background-color: var(--clr-accent) !important;
  color: #FFFFFF !important;
  border: none !important;
  font-weight: 800 !important;
  border-radius: 9999px !important;
  padding: 0.75rem 2rem !important;
  box-shadow: 6px 6px 12px rgba(90, 103, 216, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.8), inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.1) !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.btn-primary:hover, button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 8px 8px 16px rgba(90, 103, 216, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 2px 2px 4px rgba(255,255,255,0.6), inset -2px -2px 4px rgba(0,0,0,0.15) !important;
}
.btn-primary:active, button:active {
  transform: translateY(2px) !important;
  box-shadow: inset 4px 4px 8px rgba(0,0,0,0.2), inset -4px -4px 8px rgba(255,255,255,0.2) !important;
}
.btn-ghost {
  background-color: var(--clr-bg) !important;
  color: var(--clr-accent) !important;
  border-radius: 9999px !important;
  box-shadow: 6px 6px 12px rgba(166,180,200,0.5), -6px -6px 12px rgba(255,255,255,0.9), inset 1px 1px 2px rgba(255,255,255,0.8), inset -1px -1px 2px rgba(166,180,200,0.2) !important;
  font-weight: 800 !important;
}
.btn-ghost:active {
  box-shadow: inset 4px 4px 8px rgba(166,180,200,0.6), inset -4px -4px 8px rgba(255,255,255,0.9) !important;
}

/* 3D Cards */
.surface-card, .surface-card-2, .glass-card, .faculty-card, .student-card {
  background-color: var(--clr-bg) !important;
  border: none !important;
  border-radius: 32px !important;
  box-shadow: 12px 12px 24px rgba(166, 180, 200, 0.55), -12px -12px 24px rgba(255, 255, 255, 1), inset 2px 2px 4px rgba(255, 255, 255, 0.9), inset -2px -2px 4px rgba(166, 180, 200, 0.2) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  overflow: hidden !important;
}
.surface-card::before, .surface-card::after {
  display: none !important;
}
.surface-card:hover, .faculty-card:hover, .student-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 16px 16px 32px rgba(166, 180, 200, 0.6), -16px -16px 32px rgba(255, 255, 255, 1), inset 3px 3px 6px rgba(255, 255, 255, 0.9), inset -3px -3px 6px rgba(166, 180, 200, 0.2) !important;
}

/* Specific elements inside cards */
.faculty-photo img, .student-photo img, .photo-wrapper img {
  border-radius: 50% !important;
  box-shadow: 4px 4px 8px rgba(166,180,200,0.5), -4px -4px 8px rgba(255,255,255,0.9) !important;
  border: 4px solid var(--clr-bg) !important;
}

/* Filters & Inputs */
.filter-btn {
  background-color: var(--clr-bg) !important;
  color: var(--clr-text-secondary) !important;
  border-radius: 9999px !important;
  box-shadow: 4px 4px 10px rgba(166,180,200,0.5), -4px -4px 10px rgba(255,255,255,0.9) !important;
  font-weight: 700 !important;
}
.filter-btn.active {
  color: var(--clr-accent) !important;
  box-shadow: inset 4px 4px 8px rgba(166,180,200,0.5), inset -4px -4px 8px rgba(255,255,255,0.9) !important;
}
.search-input {
  background: var(--clr-bg) !important;
  border: none !important;
  border-radius: 9999px !important;
  box-shadow: inset 4px 4px 8px rgba(166,180,200,0.5), inset -4px -4px 8px rgba(255,255,255,0.9) !important;
  padding: 12px 24px !important;
  color: var(--clr-text-primary) !important;
}
.search-input:focus {
  outline: none !important;
  box-shadow: inset 6px 6px 12px rgba(166,180,200,0.6), inset -6px -6px 12px rgba(255,255,255,1), 0 0 0 2px var(--clr-accent) !important;
}

/* Badges */
.badge {
  background-color: var(--clr-bg) !important;
  color: var(--clr-accent) !important;
  border-radius: 9999px !important;
  box-shadow: 2px 2px 5px rgba(166,180,200,0.5), -2px -2px 5px rgba(255,255,255,0.9) !important;
  font-weight: 800 !important;
  padding: 4px 12px !important;
}

/* Data Tables */
.data-table {
  background: var(--clr-bg) !important;
  border-radius: 24px !important;
  box-shadow: inset 4px 4px 10px rgba(166,180,200,0.4), inset -4px -4px 10px rgba(255,255,255,0.8) !important;
  overflow: hidden;
  border: none !important;
}
.data-table th {
  background: transparent !important;
  color: var(--clr-text-primary) !important;
  font-weight: 800 !important;
  text-transform: uppercase;
  border-bottom: 2px solid rgba(166,180,200,0.2) !important;
}
.data-table td {
  background: transparent !important;
  border-bottom: 1px solid rgba(166,180,200,0.2) !important;
}

/* General Layout */
section {
  background-color: var(--clr-bg) !important;
}
.bg-mist, .bg-white {
  background-color: var(--clr-bg) !important;
}

/* Leaderboard Podium 3D */
.podium-place {
  border-radius: 24px 24px 0 0 !important;
  box-shadow: 8px 8px 16px rgba(166, 180, 200, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 2px 2px 4px rgba(255,255,255,0.8) !important;
  background: var(--clr-bg) !important;
  border: none !important;
}
.podium-1 {
  z-index: 10;
  box-shadow: 0px -10px 20px rgba(166, 180, 200, 0.4), 0px -2px 4px rgba(255, 255, 255, 0.9), inset 2px 2px 4px rgba(255,255,255,0.8) !important;
}
"""
    css += "\n\n" + claymorphism_css

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
