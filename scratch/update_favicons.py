import glob
import re

pages_pattern = r'<link\s+rel=["\']icon["\'][^>]*href=["\']data:image/svg\+xml,[^"\']*["\'][^>]*>'

replacement_pages = '''<link rel="icon" type="image/svg+xml" href="../assets/images/favicon.svg">
  <link rel="alternate icon" type="image/png" sizes="32x32" href="../assets/images/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../assets/images/apple-touch-icon.png">'''

for filepath in glob.glob('pages/*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content, count = re.subn(pages_pattern, replacement_pages, content)
    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')
    else:
        print(f'Pattern not matched in {filepath}')

doc_file = 'documentation/index.html'
try:
    with open(doc_file, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content, count = re.subn(pages_pattern, replacement_pages, content)
    if count > 0:
        with open(doc_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {doc_file}')
except Exception as e:
    print('Doc error:', e)

root_file = 'index.html'
try:
    with open(root_file, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'favicon.svg' not in content:
        root_replacement = '''<meta charset="UTF-8">
  <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">
  <link rel="alternate icon" type="image/png" sizes="32x32" href="assets/images/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/images/apple-touch-icon.png">'''
        new_content = content.replace('<meta charset="UTF-8">', root_replacement, 1)
        with open(root_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('Updated root index.html')
except Exception as e:
    print('Root error:', e)
