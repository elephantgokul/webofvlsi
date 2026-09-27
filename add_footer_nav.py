import os
import glob
import re

def update_footer(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Footer Quick Links in index.html
    content = re.sub(
        r'(<li><a href="pages/students\.html"[^>]*>Students</a></li>)',
        r'\1\n          <li><a href="pages/leaderboard.html" style="font-size:.84rem;transition:color .2s" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'\'">Leaderboard</a></li>',
        content
    )
    
    # Footer Quick Links in pages/*.html (inline style variant)
    content = re.sub(
        r'(<li><a href="students\.html" class="hover:text-white transition-colors">Students</a></li>)',
        r'\1<li><a href="leaderboard.html" class="hover:text-white transition-colors">Leaderboard</a></li>',
        content
    )
    
    # Footer Quick Links in pages/*.html (leaderboard style variant)
    content = re.sub(
        r'(<li><a href="students\.html" class="hover:text-accent transition-colors">Students</a></li>)',
        r'\1\n          <li><a href="leaderboard.html" class="hover:text-accent transition-colors">Leaderboard</a></li>',
        content
    )

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    base_dir = r"C:\Users\gokul\.gemini\antigravity-ide\scratch\webofvlsi"
    
    count = 0
    if update_footer(os.path.join(base_dir, "index.html")): count += 1
    if update_footer(os.path.join(base_dir, "offline.html")): count += 1
    if update_footer(os.path.join(base_dir, "404.html")): count += 1
    
    html_files = glob.glob(os.path.join(base_dir, "pages", "*.html"))
    for filepath in html_files:
        if update_footer(filepath): count += 1
        
    print(f"Updated {count} HTML files with Leaderboard footer link.")

if __name__ == "__main__":
    main()
