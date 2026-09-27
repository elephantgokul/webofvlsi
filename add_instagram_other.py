import os
import glob
import re

def main():
    base_dir = r"C:\Users\gokul\.gemini\antigravity-ide\scratch\webofvlsi"
    html_files = glob.glob(os.path.join(base_dir, "pages", "*.html"))
    
    count = 0
    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Match the linkedin block in pages like leaderboard.html
        linkedin_pattern = r'(<a href="[^"]*linkedin[^"]*"[^>]*aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>)'
        
        instagram_html = r'\1\n        <a href="https://www.instagram.com/vlsicrew_28/" target="_blank" rel="noopener noreferrer" class="text-lg hover:text-accent transition-colors" style="color:var(--clr-text-muted)" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>'
        
        if 'vlsicrew_28' not in content:
            new_content = re.sub(linkedin_pattern, instagram_html, content)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
            
    print(f"Added Instagram link to {count} remaining pages HTML files.")

if __name__ == "__main__":
    main()
