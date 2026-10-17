import glob

files = glob.glob('pages/*.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()

    # Replace Facebook
    text = text.replace(
        'href="login.html" class="footer-social-btn text-muted hover:text-primary" aria-label="Facebook Parent Login" title="Parent Portal Login via Facebook" data-social="facebook"',
        'href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer" class="footer-social-btn text-muted hover:text-primary" aria-label="Facebook Login" title="Redirect to Facebook Login Page" data-social="facebook"'
    )
    text = text.replace(
        'href="login.html" class="footer-social-btn hover:text-primary" aria-label="Facebook Parent Login" title="Parent Portal Login via Facebook" data-social="facebook"',
        'href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer" class="footer-social-btn hover:text-primary" aria-label="Facebook Login" title="Redirect to Facebook Login Page" data-social="facebook"'
    )

    # Replace Instagram
    text = text.replace(
        'href="login.html" class="footer-social-btn text-muted hover:text-primary" aria-label="Instagram Parent Login" title="Parent Portal Login via Instagram" data-social="instagram"',
        'href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" class="footer-social-btn text-muted hover:text-primary" aria-label="Instagram Login" title="Redirect to Instagram Login Page" data-social="instagram"'
    )
    text = text.replace(
        'href="login.html" class="footer-social-btn hover:text-primary" aria-label="Instagram Parent Login" title="Parent Portal Login via Instagram" data-social="instagram"',
        'href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" class="footer-social-btn hover:text-primary" aria-label="Instagram Login" title="Redirect to Instagram Login Page" data-social="instagram"'
    )

    # Replace YouTube
    text = text.replace(
        'href="login.html" class="footer-social-btn text-muted hover:text-primary" aria-label="YouTube Parent Login" title="Parent Portal Login via YouTube" data-social="youtube"',
        'href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank" rel="noopener noreferrer" class="footer-social-btn text-muted hover:text-primary" aria-label="YouTube Login" title="Redirect to YouTube Login Page" data-social="youtube"'
    )
    text = text.replace(
        'href="login.html" class="footer-social-btn hover:text-primary" aria-label="YouTube Parent Login" title="Parent Portal Login via YouTube" data-social="youtube"',
        'href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank" rel="noopener noreferrer" class="footer-social-btn hover:text-primary" aria-label="YouTube Login" title="Redirect to YouTube Login Page" data-social="youtube"'
    )

    # Replace Pinterest
    text = text.replace(
        'href="login.html" class="footer-social-btn text-muted hover:text-primary" aria-label="Pinterest Parent Login" title="Parent Portal Login via Pinterest" data-social="pinterest"',
        'href="https://www.pinterest.com/login/" target="_blank" rel="noopener noreferrer" class="footer-social-btn text-muted hover:text-primary" aria-label="Pinterest Login" title="Redirect to Pinterest Login Page" data-social="pinterest"'
    )
    text = text.replace(
        'href="login.html" class="footer-social-btn hover:text-primary" aria-label="Pinterest Parent Login" title="Parent Portal Login via Pinterest" data-social="pinterest"',
        'href="https://www.pinterest.com/login/" target="_blank" rel="noopener noreferrer" class="footer-social-btn hover:text-primary" aria-label="Pinterest Login" title="Redirect to Pinterest Login Page" data-social="pinterest"'
    )

    with open(f, 'w', encoding='utf-8') as fh:
        fh.write(text)

print("Updated footer social redirect links across all pages.")
