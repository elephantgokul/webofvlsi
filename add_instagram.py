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
            
        # The linkedin link in the pages footer
        linkedin_pattern = r'(<a href="[^"]*linkedin[^"]*"[^>]*><i class="fa-brands fa-linkedin"></i> LinkedIn</a>)'
        
        instagram_html = r'\1\n        <a href="https://www.instagram.com/vlsicrew_28/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 mt-4 text-xs hover:text-white transition-colors ml-4" style="color:#1652c4"><i class="fa-brands fa-instagram"></i> Instagram</a>'
        
        if 'vlsicrew_28' not in content:
            new_content = re.sub(linkedin_pattern, instagram_html, content)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
            
    print(f"Added Instagram link to {count} pages HTML files.")

if __name__ == "__main__":
    main()
