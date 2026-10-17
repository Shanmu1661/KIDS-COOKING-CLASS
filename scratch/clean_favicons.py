import glob
import re

for filepath in glob.glob('pages/*.html') + ['documentation/index.html']:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove any trailing junk after apple-touch-icon.png">
    cleaned = re.sub(
        r'(apple-touch-icon\.png">).*?</text></svg>">',
        r'\1',
        content
    )
    if cleaned != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        print(f'Fixed {filepath}')
    else:
        print(f'No trailing junk in {filepath}')
