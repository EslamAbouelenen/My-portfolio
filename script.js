document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('ea-full-portfolio');

    // --- 1. نظام تغيير اللغة (الافتراضي EN) ---
    let currentLang = 'en'; 
    const langToggleBtn = document.getElementById('eaLangToggle');
    let isLangSwitching = false;
    
    window.eaScrollSlider = function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const scrollAmount = container.clientWidth * 0.85; // scroll almost one full card
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        // Some browsers treat RTL scrollLeft as negative, some as positive, 
        // but modern browsers usually treat moving "forward" in RTL as negative scrollLeft direction when using scrollBy.
        // Actually, scrollBy with a negative X usually goes left. In RTL, you want to scroll left to see the next item.
        container.scrollBy({
            left: isRtl ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };
    
    window.eaSetTypingWords = function(words) {
        // سيتم تعريفه لاحقاً في الـ Typing animation
    };

    function setLanguage(lang) {
        isLangSwitching = true;
        setTimeout(() => isLangSwitching = false, 500);
        
        currentLang = lang;
        langToggleBtn.innerText = lang === 'en' ? 'ع' : 'EN';
        root.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
        
        document.querySelectorAll('[data-lang-' + lang + ']').forEach(el => {
            el.innerHTML = el.getAttribute('data-lang-' + lang);
        });
        
        document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(el => {
            el.setAttribute('placeholder', el.getAttribute('data-placeholder-' + lang));
        });

        if(window.eaSetTypingWords) {
            window.eaSetTypingWords(lang === 'en' ? 
                ["Front-End Development", "E-Commerce Development", "UI/UX Design"] : 
                ["تطوير الواجهات الأمامية", "برمجة المتاجر الإلكترونية", "تصميم تجربة المستخدم"]
            );
        }
        
        // Refresh active IDE file translation
        const activeIdeFile = document.querySelector('.ea-ide-file.active');
        if(activeIdeFile) activeIdeFile.click();
        // Force header to remain visible after layout shift
        const header = document.getElementById('eaHeader');
        if (header) {
            header.style.transform = 'translate(-50%, 0)';
        }
    }

    langToggleBtn.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'ar' : 'en');
    });
    
    // --- 2. نظام الوضع الليلي والنهاري (الافتراضي Dark) ---
    let isDark = true;
    const themeToggleBtn = document.getElementById('eaThemeToggle');
    
    themeToggleBtn.addEventListener('click', () => {
        isDark = !isDark;
        const themeIcon = themeToggleBtn.querySelector('i');
        if(isDark) {
            root.classList.remove('ea-light-mode');
            if(themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
        } else {
            root.classList.add('ea-light-mode');
            if(themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
        }
    });

    // تفعيل اللغة الافتراضية
    setLanguage('en');

    // --- باقي السكربتات والتأثيرات ---
    
    // جزيئات النيون العائمة 
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'ea-particles';
    root.prepend(particlesContainer);
    for(let i=0; i<30; i++) {
        const p = document.createElement('div'); p.className = 'ea-particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 15 + 10) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        particlesContainer.appendChild(p);
    }

    // حركة عين الرأس الآلي
    const robotHead = document.getElementById('eaRobotHead');
    const pupils = document.querySelectorAll('.ea-pupil');
    document.addEventListener('mousemove', (e) => {
        if(robotHead && window.innerWidth > 768) {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            robotHead.style.transform = `rotateX(${y * -20}deg) rotateY(${x * 30}deg)`;
            pupils.forEach(pupil => pupil.style.transform = `translate(calc(-50% + ${x * 15}px), calc(-50% + ${y * 15}px))`);
        }
    });
    
    // Robot Eye Tracking on Scroll (Mobile)
    window.addEventListener('scroll', () => {
        if(robotHead && window.innerWidth <= 768) {
            const rect = robotHead.getBoundingClientRect();
            const robotCenterY = rect.top + (rect.height / 2);
            const viewportCenterY = window.innerHeight / 2;
            let y = (robotCenterY - viewportCenterY) / (window.innerHeight / 2);
            
            if (y > 1) y = 1;
            if (y < -1) y = -1;
            
            // If robot is below center (y>0), look up (y_pupil negative).
            // If robot is above center (y<0), look down (y_pupil positive).
            robotHead.style.transform = `rotateX(${y * 15}deg)`;
            pupils.forEach(pupil => pupil.style.transform = `translate(-50%, calc(-50% + ${y * -12}px))`);
        }
    });

    // أنيميشن الأرقام
    const counters = document.querySelectorAll('.ea-counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let current = 0; const increment = target / (2500 / 16); 
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCounter(); observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // الكشاف والتألق التفاعلي (يدعم الموبايل واللمس والسكرول)
    const flashlight = document.getElementById('ea-flashlight');
    const updateFlashlightPos = (x, y) => {
        if(flashlight) {
            flashlight.style.setProperty('--mouse-x', `${x}px`);
            flashlight.style.setProperty('--mouse-y', `${y}px`);
        }
    };
    // تعيين المكان المبدئي في منتصف الشاشة حتى لا تظلم الشاشة على الموبايل عند الفتح المباشر
    updateFlashlightPos(window.innerWidth / 2, window.innerHeight / 2);

    document.addEventListener('mousemove', (e) => {
        updateFlashlightPos(e.clientX, e.clientY);
    });
    document.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            updateFlashlightPos(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
    document.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
            updateFlashlightPos(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 992) {
            updateFlashlightPos(window.innerWidth / 2, window.innerHeight / 2);
        }
    }, { passive: true });

    // شاشة التحميل الاحترافية (Staggered Slices)
    const preloaderPro = document.getElementById('ea-preloader-pro');
    const preloaderCountPro = document.getElementById('ea-preloader-count-pro');
    const progressBarPro = document.getElementById('ea-progress-bar-pro');

    if (preloaderPro) {
        let loadProgress = 0;
        const statusSpan = document.getElementById('ea-preloader-status');

        // We want the progress bar to wait for the code lines to finish animating before it starts filling up.
        // The last line animation finishes at ~3.5s, so we delay the JS counting by 3500ms.
        setTimeout(() => {
            const progressInterval = setInterval(() => {
                loadProgress += Math.floor(Math.random() * 4) + 1;
                if (loadProgress >= 100) {
                    loadProgress = 100;
                    clearInterval(progressInterval);
                    
                    if (statusSpan) statusSpan.innerText = "Loaded Successfully!";
                    
                    setTimeout(() => {
                        preloaderPro.classList.add('ea-loaded');
                        setTimeout(() => preloaderPro.style.display = 'none', 1000);
                    }, 800);
                }

                if (preloaderCountPro) preloaderCountPro.innerText = loadProgress;
                if (progressBarPro) progressBarPro.style.width = loadProgress + '%';
            }, 30);
        }, 4500);
    }

    // إمالة نافذة الأكواد في الهيرو
    const codeWindow = document.getElementById('eaCodeWindow');
    document.addEventListener('mousemove', (e) => {
        if(codeWindow && window.innerWidth > 992) {
            const xAxis = (window.innerWidth / 2 - e.clientX) / 45;
            const yAxis = (window.innerHeight / 2 - e.clientY) / 45;
            codeWindow.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });

    // كتابة الأكواد في الهيرو
    const codeLines = [
        "<span style='color:#FF5F56;'>const</span> developer = {",
        "  name: <span style='color:#27C93F;'>'Eslam Abouelenen'</span>,",
        "  roles: [<span style='color:#FFBD2E;'>'Front-End'</span>, <span style='color:#FFBD2E;'>'WordPress'</span>],",
        "  passion: <span style='color:#27C93F;'>'Building amazing UI'</span>",
        "};",
        "",
        "<span style='color:#8A93A6;'>// Let's create something</span>",
        "developer.buildProject();"
    ];
    const codeTarget = document.querySelector('.ea-code-text');
    if (codeTarget) {
        let lineIdx = 0; let charIdx = 0; let currentHTML = "";
        function typeCode() {
            if (lineIdx < codeLines.length) {
                const line = codeLines[lineIdx];
                codeTarget.innerHTML = currentHTML + line.substring(0, charIdx + 1);
                charIdx++;
                if (charIdx < line.length) {
                    setTimeout(typeCode, (line.charAt(charIdx) === '<' || line.charAt(charIdx-1) === '>') ? 0 : 35);
                } else {
                    currentHTML += line + "<br>"; lineIdx++; charIdx = 0; setTimeout(typeCode, 400); 
                }
            } else { setTimeout(() => { currentHTML = ""; codeTarget.innerHTML = ""; lineIdx = 0; charIdx = 0; typeCode(); }, 6000); }
        }
        setTimeout(typeCode, 2600);
    }

    // الهيدر السكرول (Smart Header)
    const header = document.getElementById('eaHeader');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        if (isLangSwitching) { lastScroll = window.scrollY; return; }
        const currentScroll = window.scrollY;
        // تأثير الخلفية الزجاجية
        if (currentScroll > 50) header.classList.add('scrolled'); 
        else header.classList.remove('scrolled');
        
        // إخفاء وإظهار الهيدر بذكاء
        if (currentScroll > lastScroll && currentScroll > 300) {
            header.style.transform = 'translate(-50%, -150%)'; // إخفاء لأعلى
        } else {
            header.style.transform = 'translate(-50%, 0)'; // إظهار
        }
        lastScroll = currentScroll;
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('#ea-full-portfolio .reveal');
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(el => revealOnScroll.observe(el));
    setTimeout(() => { revealElements.forEach(el => { if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('active'); }); }, 3000); 

    // الـ Typing Text
    const typeRolesTarget = document.querySelector('.ea-typing-skill');
    let typingWords = ["Front-End Development", "E-Commerce Development", "UI/UX Design"]; 
    let wordIdx = 0; let charIdx = 0; let isDeleting = false; let typeRolesCycleTimeout;
    
    function typeRolesCycle() {
        if(!typingWords.length || !typeRolesTarget) return;
        const currentWord = typingWords[wordIdx % typingWords.length];
        if(!currentWord) return;
        
        if (isDeleting) { typeRolesTarget.textContent = currentWord.substring(0, charIdx - 1); charIdx--; } 
        else { typeRolesTarget.textContent = currentWord.substring(0, charIdx + 1); charIdx++; }
        
        let speed = isDeleting ? 30 : 80;
        if (!isDeleting && charIdx === currentWord.length) { speed = 2000; isDeleting = true; } 
        else if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx++; speed = 500; }
        
        typeRolesCycleTimeout = setTimeout(typeRolesCycle, speed);
    }
    if(typeRolesTarget) { setTimeout(typeRolesCycle, 3200); }
    
    window.eaSetTypingWords = function(words) {
        typingWords = words; wordIdx = 0; charIdx = 0; isDeleting = false;
        if(typeRolesTarget) typeRolesTarget.textContent = "";
    };

    // --- IDE Project Viewer Logic ---
    const ideFiles = document.querySelectorAll('.ea-ide-file');
    const idePreview = document.getElementById('ea-ide-preview');
    const ideLink = document.getElementById('ea-ide-link');
    const ideActiveTab = document.getElementById('ea-ide-active-tab');
    const ideCodeBlock = document.getElementById('ea-ide-code');
    
    ideFiles.forEach(file => {
        file.addEventListener('click', () => {
            ideFiles.forEach(f => f.classList.remove('active'));
            file.classList.add('active');
            
            const img = file.getAttribute('data-img');
            const url = file.getAttribute('data-url');
            const tech = file.getAttribute('data-tech');
            const titleEn = file.getAttribute('data-title-en');
            const titleAr = file.getAttribute('data-title-ar');
            const catEn = file.getAttribute('data-cat-en');
            const catAr = file.getAttribute('data-cat-ar');
            const icon = file.getAttribute('data-icon');
            const color = file.getAttribute('data-color');
            const filename = file.getAttribute('data-filename');
            
            if(idePreview) idePreview.style.backgroundImage = `url('${img}')`;
            if(ideLink) ideLink.href = url;
            if(ideActiveTab) ideActiveTab.innerHTML = `<i class="${icon}" style="color: ${color};"></i> <span>${filename}</span>`;
            
            if(ideCodeBlock) {
                const title = currentLang === 'ar' ? titleAr : titleEn;
                const cat = currentLang === 'ar' ? catAr : catEn;
                const techArr = tech.split(', ').map(t => `<span class="ea-json-string">"${t}"</span>`).join(', ');
                
                ideCodeBlock.innerHTML = `
{
  <span class="ea-json-key">"projectName"</span>: <span class="ea-json-string">"${title}"</span>,
  <span class="ea-json-key">"category"</span>: <span class="ea-json-string">"${cat}"</span>,
  <span class="ea-json-key">"techStack"</span>: [${techArr}],
  <span class="ea-json-key">"status"</span>: <span class="ea-json-boolean">true</span>
}`;
            }
        });
    });

    // سموث سكرول للروابط
    document.querySelectorAll('#ea-full-portfolio a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            const targetEl = document.querySelector(this.getAttribute('href'));
            if(targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
