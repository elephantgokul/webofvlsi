import os
import glob
import re

def update_nav(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Desktop Nav (index.html)
    content = re.sub(
        r'(<a href="pages/students\.html"[^>]*>Students</a>)',
        r'\1\n      <a href="pages/leaderboard.html" class="nav-link px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200">Leaderboard</a>',
        content
    )
    
    # 2. Desktop Nav (pages/*.html)
    content = re.sub(
        r'(<a href="students\.html"[^>]*class="nav-link[^>]*>Students</a>)',
        r'\1\n      <a href="leaderboard.html" class="nav-link px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200">Leaderboard</a>',
        content
    )

    # 3. Mobile Nav (index.html)
    content = re.sub(
        r'(<a href="pages/students\.html"[^>]*class="px-4[^>]*>Students</a>)',
        r'\1\n      <a href="pages/leaderboard.html" class="px-4 py-3 text-sm font-medium text-white/75 hover:text-white rounded-xl hover:bg-white/10 transition-all">Leaderboard</a>',
        content
    )

    # 4. Mobile Nav (pages/*.html)
    content = re.sub(
        r'(<a href="students\.html"[^>]*class="px-4[^>]*>Students</a>)',
        r'\1\n      <a href="leaderboard.html" class="px-4 py-3 text-sm font-medium text-white/75 hover:text-white rounded-xl hover:bg-white/10 transition-all">Leaderboard</a>',
        content
    )

    # Avoid duplicating if already present (a simple fix is to deduplicate, but regex above only matches if Leaderboard isn't already there?
    # Actually, it might match multiple times if run multiple times. Let's make sure 'leaderboard.html' isn't already next to it.
    
    if content != original_content:
        # Check if we duplicated by seeing if "Leaderboard</a>\n      <a href=".*leaderboard.html" is there
        # A simpler check: if the original already had leaderboard in nav, we skip
        if 'Leaderboard' not in original_content[original_content.find('Students</a>'):original_content.find('Students</a>')+300]:
             pass # safe to write
             
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    base_dir = r"C:\Users\gokul\.gemini\antigravity-ide\scratch\webofvlsi"
    
    # Check index and offline
    count = 0
    if update_nav(os.path.join(base_dir, "index.html")): count += 1
    if update_nav(os.path.join(base_dir, "offline.html")): count += 1
    if update_nav(os.path.join(base_dir, "404.html")): count += 1
    
    # Check pages
    html_files = glob.glob(os.path.join(base_dir, "pages", "*.html"))
    for filepath in html_files:
        if update_nav(filepath): count += 1
        
    print(f"Updated {count} HTML files with Leaderboard nav link.")

if __name__ == "__main__":
    main()
