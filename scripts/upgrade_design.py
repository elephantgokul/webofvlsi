import os
import re
import glob

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Fonts
    content = re.sub(
        r'<link href="https://fonts\.googleapis\.com/css2\?family=Space\+Grotesk.*?rel="stylesheet"/>',
        '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>',
        content,
        flags=re.DOTALL
    )

    # 2. Update Tailwind config
    tailwind_config_replacement = """    tailwind.config = {
      theme: {                                                
        extend: {
          colors: {
            'ink-navy':   '#0a0a0a',
            'ink-light':  '#171717',
            'circuit-blue':'#0f172a',
            'circuit-dark':'#020617',
            'signal-cyan': '#3b82f6',
            mist:          '#f7f7f8',
          },
          fontFamily: {
            display: ['Outfit','sans-serif'],
            body:    ['Plus Jakarta Sans','sans-serif'],
            mono:    ['JetBrains Mono','monospace'],
          },
          borderRadius: { '3xl':'1.5rem', '4xl':'2rem', '5xl':'2.5rem' },
        }
      }
    }"""
    content = re.sub(
        r'tailwind\.config\s*=\s*\{.*?\}\s*\}',
        tailwind_config_replacement,
        content,
        flags=re.DOTALL
    )

    # 3. Update Spacing in one pass to avoid cascaded replacement
    def replacer(match):
        val = match.group(0)
        mapping = {
            'py-28': 'py-40',
            'py-24': 'py-32',
            'py-20': 'py-32',
            'py-16': 'py-24',
            'py-10': 'py-24',
            'md:py-24': 'md:py-32',
            'md:py-16': 'md:py-24',
        }
        return mapping.get(val, val)

    content = re.sub(r'\b(py-28|py-24|py-20|py-16|py-10|md:py-24|md:py-16)\b', replacer, content)

    # Add button HTML redesign if needed. The CSS now handles most of it, but let's change `btn-primary` padding 
    # to be cleaner if they had inline styles. We'll strip inline styles from btn-primary in HTML.
    content = re.sub(r'(class="[^"]*?btn-primary[^"]*?")\s+style="[^"]*?"', r'\1', content)
    content = re.sub(r'(class="[^"]*?btn-ghost[^"]*?")\s+style="[^"]*?"', r'\1', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def process_css_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        css = f.read()

    # Update CSS variables
    css = re.sub(r'--ink-navy:\s*#0b1b33;', '--ink-navy: #0a0a0a;', css)
    css = re.sub(r'--ink-navy-light:\s*#122a4d;', '--ink-navy-light: #171717;', css)
    css = re.sub(r'--circuit-blue:\s*#1652c4;', '--circuit-blue: #0f172a;', css)
    css = re.sub(r'--circuit-blue-dark:\s*#103e94;', '--circuit-blue-dark: #020617;', css)
    css = re.sub(r'--signal-cyan:\s*#2fe6dd;', '--signal-cyan: #3b82f6;', css)
    css = re.sub(r'--mist:\s*#f4f7fb;', '--mist: #f7f7f8;', css)
    css = re.sub(r'--font-display:\s*"Space Grotesk",\s*sans-serif;', '--font-display: "Outfit", sans-serif;', css)
    css = re.sub(r'--font-body:\s*"IBM Plex Sans",\s*sans-serif;', '--font-body: "Plus Jakarta Sans", sans-serif;', css)
    css = re.sub(r'--font-mono:\s*"IBM Plex Mono",\s*monospace;', '--font-mono: "JetBrains Mono", monospace;', css)

    # Enhance Surface Card with Double-Bezel (pseudo-elements)
    new_surface_card = """
.surface-card {
  position: relative;
  background: var(--paper);
  border-radius: calc(2rem - 0.375rem);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
  border: none;
  z-index: 1;
  transition: transform 0.6s cubic-bezier(0.32,0.72,0,1), box-shadow 0.6s cubic-bezier(0.32,0.72,0,1);
}
.surface-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 1px 1px rgba(255,255,255,1);
  pointer-events: none;
  z-index: 2;
}
.surface-card::before {
  content: "";
  position: absolute;
  inset: -0.375rem;
  border-radius: 2rem;
  background: rgba(0, 0, 0, 0.03);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  z-index: -1;
  transition: transform 0.6s cubic-bezier(0.32,0.72,0,1);
}
.surface-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.1);
}
.surface-card:hover::before {
  transform: translateY(2px) scale(1.01);
}
"""
    # Replace existing surface-card
    css = re.sub(r'\.surface-card\s*\{[^}]*\}\s*\.surface-card:hover\s*\{[^}]*\}', new_surface_card, css, flags=re.DOTALL)

    # Enhance Buttons
    new_primary_btn = """
.btn-primary {
  background: var(--ink-navy);
  color: var(--paper);
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all 0.6s cubic-bezier(0.32,0.72,0,1);
  box-shadow: 0 8px 20px -8px rgba(10, 10, 10, 0.5);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 1px solid rgba(255,255,255,0.1);
}
.btn-primary:hover {
  background: var(--ink-light);
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -10px rgba(10, 10, 10, 0.6);
}
.btn-primary:active {
  transform: scale(0.98);
}
.btn-primary i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(255,255,255,0.15);
  border-radius: 9999px;
  transition: transform 0.6s cubic-bezier(0.32,0.72,0,1);
}
.btn-primary:hover i {
  transform: translateX(4px) scale(1.05);
}

.btn-ghost {
  border: 1.5px solid rgba(0,0,0,0.1);
  color: var(--ink-navy);
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.6s cubic-bezier(0.32,0.72,0,1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-ghost:hover {
  border-color: var(--ink-navy);
  background-color: rgba(0,0,0,0.03);
  transform: translateY(-2px);
}
.btn-ghost:active {
  transform: scale(0.98);
}
"""
    css = re.sub(r'\.btn-primary\s*\{[^}]*\}\s*\.btn-primary:hover\s*\{[^}]*\}', new_primary_btn, css, flags=re.DOTALL)
    css = re.sub(r'\.btn-ghost\s*\{[^}]*\}\s*\.btn-ghost:hover\s*\{[^}]*\}', '', css, flags=re.DOTALL) # remove old

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
