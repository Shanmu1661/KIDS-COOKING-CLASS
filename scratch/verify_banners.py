import glob
import re

print("=== VERIFYING BANNER LABELS ACROSS ALL HTML PAGES ===")
files = sorted(glob.glob('pages/*.html'))
total_sections = 0
total_pills = 0

for fpath in files:
    with open(fpath, encoding='utf-8') as f:
        content = f.read()
    
    sections = re.findall(r'<div class="[^"]*banner-labels-section[^"]*">(.*?)</div>', content, re.DOTALL)
    if sections:
        print(f"\n[OK] {fpath}: {len(sections)} banner label section(s)")
        for idx, sec in enumerate(sections, 1):
            pills = re.findall(r'<span class="[^"]*banner-label-pill[^"]*">(.*?)</span>', sec, re.DOTALL)
            print(f"   Section {idx} ({len(pills)} pills):")
            for p in pills:
                clean = re.sub(r'<[^>]+>', '', p).strip()
                icon = re.search(r'class="([^"]*fa-[^"]*)"', p)
                icon_cls = icon.group(1) if icon else 'no-icon'
                print(f"     - <i class='{icon_cls}'></i> {clean}")
            total_pills += len(pills)
        total_sections += len(sections)

print(f"\nTOTAL: {total_sections} banner label sections verified, {total_pills} pills confirmed.")
