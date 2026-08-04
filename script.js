document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('ea-full-portfolio');

    // --- 1. نظام تغيير اللغة (الافتراضي EN) ---
    let currentLang = 'en'; 
    const langToggleBtn = document.getElementById('eaLangToggle');
    
    window.eaSetTypingWords = function(words) {
        // سيتم تعريفه لاحقاً في الـ Typing animation
    };

    function setLanguage(lang) {
        currentLang = lang;
        langToggleBtn.innerText = lang === 'en' ? 'عربي' : 'EN';
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
    }

    langToggleBtn.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'ar' : 'en');
    });
    
    // --- 2. نظام الوضع الليلي والنهاري (الافتراضي Dark) ---
    let isDark = true;
    const themeToggleBtn = document.getElementById('eaThemeToggle');
    
    themeToggleBtn.addEventListener('click', () => {
        isDark = !isDark;
        if(isDark) {
            root.classList.remove('ea-light-mode');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            root.classList.add('ea-light-mode');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });
    // الأيقونة المبدئية عند الوضع المظلم هي الشمس للتبديل للنهاري
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';

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

        const progressInterval = setInterval(() => {
            loadProgress += Math.floor(Math.random() * 8) + 2;
            if (loadProgress > 100) loadProgress = 100;

            if (preloaderCountPro) preloaderCountPro.innerText = loadProgress;
            if (progressBarPro) progressBarPro.style.width = loadProgress + '%';

            if (loadProgress >= 100) {
                clearInterval(progressInterval);
                
                setTimeout(() => {
                    preloaderPro.classList.add('loaded');
                    setTimeout(() => preloaderPro.style.display = 'none', 1500);
                }, 400);
            }
        }, 35);
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

    // الهيدر السكرول
    const header = document.getElementById('eaHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
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

    // فلتر المشاريع
    const filterBtns = document.querySelectorAll('.ea-filter-btn');
    const projectCards = document.querySelectorAll('.ea-grid-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                card.style.animation = 'none'; card.offsetHeight; 
                if(filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.setProperty('display', 'flex', 'important'); card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else { card.style.setProperty('display', 'none', 'important'); }
            });
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
