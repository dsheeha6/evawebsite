// Main JavaScript for Eva Sheehan Portfolio
// Handles header scroll state, intersection observers, and image lazy loading

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Header scroll state management + Hero parallax
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    const heroLayer = document.querySelector('.hero-parallax');
    const testimonialsSection = document.querySelector('.testimonials-preview');
    const testimonialsLayer = document.querySelector('.testimonials-parallax');
    let lastScrollY = window.scrollY;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax effect for hero using a dedicated layer
        if (heroLayer && !prefersReducedMotion) {
            const parallaxFactor = 0.15;
            const baseOffset = 25; // px baseline downward shift
            const offsetY = Math.round(currentScrollY * parallaxFactor) - baseOffset;
            heroLayer.style.transform = `translate3d(0, ${-offsetY}px, 0)`;
        }

        // Parallax effect for testimonials background layer
        if (testimonialsSection && testimonialsLayer && !prefersReducedMotion) {
            const rect = testimonialsSection.getBoundingClientRect();
            // Start moving when the section approaches the viewport, subtle factor
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const distanceIntoView = viewportHeight - rect.top; // positive once top enters viewport
            const factor = 0.08; // gentler than hero
            const offset = Math.max(-150, Math.min(150, Math.round(distanceIntoView * factor)));
            testimonialsLayer.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    // Throttled scroll handler for performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Initialize header state
    updateHeader();

    // Recompute on reduced-motion changes
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql && typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', (e) => {
        if (e.matches) {
          window.removeEventListener('scroll', requestTick);
          if (heroLayer) heroLayer.style.transform = 'translate3d(0, 25px, 0)';
          if (testimonialsLayer) testimonialsLayer.style.transform = 'translate3d(0, 0, 0)';
        } else {
          window.addEventListener('scroll', requestTick, { passive: true });
        }
      });
    }
    
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
    
    // Image lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile navigation toggle (skip if enhanced MobileNavigation exists)
    const hasCustomMobileNav = typeof window.MobileNavigation === 'function';
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hasCustomMobileNav && mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNavToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Add animation classes to elements on page load
    function addAnimationClasses() {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            const delay = index * 0.1;
            section.style.transitionDelay = `${delay}s`;

            // Add animation classes based on section content (avoid project cards)
            const content = section.querySelector('.hero-content, h2');
            if (content) {
                if (section.classList.contains('hero')) {
                    // Hero section should be visible immediately, no animation
                    content.style.opacity = '1';
                    content.style.transform = 'none';
                } else {
                    // Skip effect on Selected Work, My Services, Testimonials, and CTA titles
                    if (!section.classList.contains('selected-projects') && !section.classList.contains('section-services') && !section.classList.contains('testimonials-preview') && !section.classList.contains('cta-strip')) {
                        content.classList.add('fade-in');
                    }
                }
            }
        });
    }
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Ensure hero section is immediately visible
    function ensureHeroVisible() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'none';
            heroContent.style.transition = 'none';
        }
    }
    
    // Safe element selector with error handling
    function safeQuerySelector(selector, parent = document) {
        try {
            return parent.querySelector(selector);
        } catch (error) {
            console.warn(`Failed to find element: ${selector}`, error);
            return null;
        }
    }
    
    // Run immediately to ensure hero is visible
    ensureHeroVisible();
    
    // Run after a short delay to ensure smooth animations
    setTimeout(addAnimationClasses, 100);
    
    // Performance monitoring (optional)
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData && perfData.loadEventEnd) {
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                console.log(`Page load time: ${loadTime}ms`);
            }
        });
    }
    
    // Error handling for images
    const handleImageError = function() {
        this.style.display = 'none';
        console.warn('Image failed to load:', this.src);
    };
    
    images.forEach(img => {
        img.addEventListener('error', handleImageError);
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile nav
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Tab key navigation improvements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Preload critical images
    function preloadImages() {
        const criticalImages = [
            'logo.jpeg',
            'designphoto.jpeg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Run preloading after page load
    if (document.readyState === 'complete') {
        preloadImages();
    } else {
        window.addEventListener('load', preloadImages);
    }
    
    // Add CSS class for JavaScript-enabled browsers
    document.documentElement.classList.add('js-enabled');
    
    // Console welcome message
    console.log('%c👋 Welcome to Eva Sheehan\'s Portfolio!', 
        'color: #163B60; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with vanilla HTML, CSS, and JavaScript', 
        'color: #a62b0c; font-size: 14px;');
});
