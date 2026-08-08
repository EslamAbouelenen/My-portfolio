import re

html_file = r'C:\Users\BG\.gemini\antigravity\scratch\eslam-portfolio\index.html'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the ea-code-line elements with style attributes for typing
replacements = [
    (r'<div class="ea-code-line"><span class="ea-keyword">&lt;html&gt;</span></div>',
     r'<div class="ea-code-line" style="--chars: 6; --delay: 0.5s; --dur: 0.4s"><span class="ea-keyword">&lt;html&gt;</span></div>'),
     
    (r'<div class="ea-code-line ea-indent"><span class="ea-keyword">&lt;h1&gt;</span> <span class="ea-string ea-typewriter">Hello,</span></div>',
     r'<div class="ea-code-line ea-indent" style="--chars: 11; --delay: 1.0s; --dur: 0.6s"><span class="ea-keyword">&lt;h1&gt;</span> <span class="ea-string">Hello,</span></div>'),
     
    (r'<div class="ea-code-line ea-indent-2"><span class="ea-string ea-typewriter-2">Welcome to my Portfolio</span> <span class="ea-keyword">&lt;/h1&gt;</span></div>',
     r'<div class="ea-code-line ea-indent-2" style="--chars: 29; --delay: 1.7s; --dur: 1.2s"><span class="ea-string">Welcome to my Portfolio</span> <span class="ea-keyword">&lt;/h1&gt;</span></div>'),
     
    (r'<div class="ea-code-line ea-indent"><span class="ea-keyword">&lt;script&gt;</span></div>',
     r'<div class="ea-code-line ea-indent" style="--chars: 8; --delay: 3.0s; --dur: 0.4s"><span class="ea-keyword">&lt;script&gt;</span></div>'),
     
    (r'<div class="ea-code-line ea-indent-2"><span class="ea-variable" id="ea-preloader-status">Loading assets...</span> <span class="ea-number"><span id="ea-preloader-count-pro">0</span>%</span></div>',
     r'<div class="ea-code-line ea-indent-2" style="--chars: 20; --delay: 3.5s; --dur: 1.0s"><span class="ea-variable" id="ea-preloader-status">Loading assets...</span> <span class="ea-number"><span id="ea-preloader-count-pro">0</span>%</span></div>'),
     
    (r'<div class="ea-code-line ea-indent"><span class="ea-keyword">&lt;/script&gt;</span></div>',
     r'<div class="ea-code-line ea-indent" style="--chars: 9; --delay: 4.6s; --dur: 0.4s"><span class="ea-keyword">&lt;/script&gt;</span></div>'),
     
    (r'<div class="ea-code-line"><span class="ea-keyword">&lt;/html&gt;</span><span class="ea-cursor">_</span></div>',
     r'<div class="ea-code-line" style="--chars: 7; --delay: 5.1s; --dur: 0.4s"><span class="ea-keyword">&lt;/html&gt;</span></div>')
]

for old, new in replacements:
    content = content.replace(old, new)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated HTML lines')
