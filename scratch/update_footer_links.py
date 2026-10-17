import glob

target = """          <h5 class="footer-widget-title font-heading">Age Programs</h5>
          <ul class="footer-links">
            <li><a href="classes.html#tiny-tasters"><i class="fa-solid fa-cookie"></i> Tiny Tasters (3-5)</a></li>
            <li><a href="classes.html#little-chefs"><i class="fa-solid fa-pizza-slice"></i> Little Chefs (6-9)</a></li>
            <li><a href="classes.html#junior-gourmet"><i class="fa-solid fa-bowl-food"></i> Junior Gourmet (10-13)</a></li>
            <li><a href="classes.html#teen-master"><i class="fa-solid fa-cake-candles"></i> Teen Masterclass (14-17)</a></li>
            <li><a href="dashboard.html"><i class="fa-solid fa-user-lock"></i> Parent Dashboard</a></li>
          </ul>"""

replacement = """          <h5 class="footer-widget-title font-heading">Age Programs</h5>
          <ul class="footer-links">
            <li><span class="footer-item"><i class="fa-solid fa-cookie"></i> Tiny Tasters (3-5)</span></li>
            <li><span class="footer-item"><i class="fa-solid fa-pizza-slice"></i> Little Chefs (6-9)</span></li>
            <li><span class="footer-item"><i class="fa-solid fa-bowl-food"></i> Junior Gourmet (10-13)</span></li>
            <li><span class="footer-item"><i class="fa-solid fa-cake-candles"></i> Teen Masterclass (14-17)</span></li>
            <li><span class="footer-item"><i class="fa-solid fa-user-lock"></i> Parent Dashboard</span></li>
          </ul>"""

for filepath in glob.glob("pages/*.html"):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    if target in content:
        content = content.replace(target, replacement)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated:", filepath)
    else:
        print("Target not found or already updated in:", filepath)
