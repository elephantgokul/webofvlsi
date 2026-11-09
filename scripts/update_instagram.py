import os
import glob
import re

def main():
    base_dir = r"C:\Users\gokul\.gemini\antigravity-ide\scratch\webofvlsi"
    html_files = glob.glob(os.path.join(base_dir, "*.html")) + glob.glob(os.path.join(base_dir, "pages", "*.html"))
    
    count = 0
    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = re.sub(
            r'<a href="#" aria-label="Instagram"',
            r'<a href="https://www.instagram.com/vlsicrew_28/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"',
            content
        )
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            
    print(f"Updated {count} HTML files with Instagram link.")

if __name__ == "__main__":
    main()
