import glob
import re

files = sorted(glob.glob('pages/*.html'))
print(f"Cleaning {len(files)} files...")

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match from Quick Floating Settings Widget comment or quick-settings-widget div all the way to before <!-- Scripts -->
    pattern = r'(\s*<!--\s*Quick Floating Settings Widget[^\n]*-->)?\s*(<div class="quick-settings-widget">[\s\S]*?)(?=\s*<!-- Scripts -->|\s*<script src=)'
    
    new_content, count = re.subn(pattern, '\n', content)
    
    # Also clean up any orphan settings-toggle-btn
    pattern_orphan = r'\s*<button type="button" class="settings-toggle-btn"[\s\S]*?</div>(?=\s*<!-- Scripts -->|\s*<script src=)'
    new_content, count2 = re.subn(pattern_orphan, '\n', new_content)

    if count > 0 or count2 > 0:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"[REMOVED] {fpath}")
    else:
        print(f"[CLEAN] {fpath}")

print("Done.")
