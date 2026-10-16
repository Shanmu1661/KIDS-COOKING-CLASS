import re

print("=== VERIFYING SERVICES PAGE ARCHITECTURE & INTEGRITY ===")
with open('pages/services.html', encoding='utf-8') as f:
    content = f.read()

# 1. Check sections
sections = re.findall(r'<section class="([^"]+)"', content)
print(f"Total sections found: {len(sections)}")
for i, s in enumerate(sections, 1):
    print(f"  {i}. <section class='{s}'>")

# 2. Check Accordion
accordion_targets = [t for t in re.findall(r'data-bs-target="#([^"]+)"', content) if t != 'navbarMain']
accordion_collapses = re.findall(r'id="([^"]+)" class="[^"]*accordion-collapse', content)
print(f"\nAccordion targets: {accordion_targets}")
print(f"Accordion collapse IDs: {accordion_collapses}")
assert set(accordion_targets) == set(accordion_collapses), "Accordion target mismatch!"
print("[PASS] Accordion IDs match perfectly.")

# 3. Check Advisor Elements
advisor_ids = ['advisorAgeGroup', 'advisorGoalGroup', 'advisorTag', 'advisorTitle', 'advisorDesc', 'advisorPrice', 'advisorLink']
for aid in advisor_ids:
    assert f'id="{aid}"' in content, f"Missing advisor element: {aid}"
print(f"[PASS] All {len(advisor_ids)} interactive advisor elements exist.")

# 4. Check for unescaped literal en-dashes
dash_count = content.count('–')
print(f"Literal en-dashes found: {dash_count}")
if dash_count > 0:
    print("Sanitizing literal dashes to &ndash;...")
    new_content = content.replace('–', '&ndash;')
    with open('pages/services.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("[PASS] Replaced with &ndash;")

# 5. Check CSS classes
with open('assets/css/style.css', encoding='utf-8') as f:
    css = f.read()

classes_to_check = [
    'service-step-card', 'service-step-number', 'service-step-icon',
    'workshop-card', 'workshop-card-img', 'workshop-card-body',
    'safety-feature-card', 'safety-feature-icon',
    'pricing-package-card', 'pricing-badge-popular', 'pricing-amount', 'pricing-features-list',
    'advisor-card-box', 'advisor-choice-btn', 'advisor-result-card'
]

for c in classes_to_check:
    assert f'.{c}' in css, f"Missing CSS class: .{c}"
print(f"[PASS] All {len(classes_to_check)} custom CSS classes present in style.css.")

print("\n=== ALL SERVICES TESTS PASSED SUCCESSFULLY! ===")
