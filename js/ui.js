// UI JavaScript for Eva Sheehan Portfolio
// Handles carousel, mobile navigation, filter pills, and interactive elements


// Project Filter System
class ProjectFilter {
    constructor(containerId, projects) {
        this.container = document.getElementById(containerId);
        this.projects = projects;
        this.currentFilter = 'all';
        
        if (!this.container) return;
        
        this.init();
    }
    
    init() {
        this.renderProjects();
        this.bindEvents();
    }
    
    renderProjects(filter = 'all') {
        const filteredProjects = filter === 'all' 
            ? this.projects 
            : this.projects.filter(project => project.tags.includes(filter));
            
        
        this.container.innerHTML = filteredProjects.map(project => `
            <div class="project-card" data-category="${project.tags.join(' ')}">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    filter(category) {
        this.currentFilter = category;
        this.renderProjects(category);
        
        // Update active filter button
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            }
        });
        
        // Add animation to filtered projects
        const projectCards = this.container.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }
    
    bindEvents() {
        // Filter button clicks
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filter(filter);
            });
        });
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.navToggle = document.querySelector('.mobile-nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.header = document.querySelector('.header');
        
        if (!this.navToggle || !this.navLinks) return;
        
        this.init();
    }
    
    init() {
        // Create overlay first so event listeners can attach safely
        this.setupOverlay();
        this.bindEvents();
    }
    
    setupOverlay() {
        // Create overlay for mobile nav
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-nav-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(this.overlay);
    }
    
    toggle() {
        const isOpen = this.navLinks.classList.contains('active');
        
        if (isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.navLinks.classList.add('active');
        this.navToggle.setAttribute('aria-expanded', 'true');
        this.overlay.style.opacity = '1';
        this.overlay.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        
        // Animate nav items
        const navItems = this.navLinks.querySelectorAll('li');
        navItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('slide-in-left');
        });
    }
    
    close() {
        this.navLinks.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.overlay.style.opacity = '0';
        this.overlay.style.visibility = 'hidden';
        document.body.style.overflow = '';
        
        // Remove animation classes
        const navItems = this.navLinks.querySelectorAll('li');
        navItems.forEach(item => {
            item.classList.remove('slide-in-left');
        });
    }
    
    bindEvents() {
        this.navToggle.addEventListener('click', () => {
            this.toggle();
        });
        
        this.overlay.addEventListener('click', () => {
            this.close();
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
        
        // Close when clicking on nav links
        const links = this.navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });
    }
}

// Smooth Scroll Utility
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize all UI components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Testimonial carousel handled by inline minimal script in index.html
    
    // Initialize mobile navigation
    new MobileNavigation();
    
    // Initialize smooth scroll
    new SmoothScroll();
    
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                this.style.pointerEvents = 'none';
                
                // Remove loading state after animation
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.style.pointerEvents = '';
                }, 1000);
            }
        });
    });
    

    
    // Reveal animation for elements with `.reveal` (robust + reduced-motion respect)
    (function initReveal(){
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const elements = document.querySelectorAll('.reveal');
        if (!elements.length) return;

        // Fallback or reduced motion: reveal immediately
        if (prefersReduced || !('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('reveal--in'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        elements.forEach((el) => io.observe(el));
    })();
});

// Export classes for potential external use (guard undefined symbols)
if (typeof TestimonialCarousel !== 'undefined') {
    window.TestimonialCarousel = TestimonialCarousel;
}
window.ProjectFilter = ProjectFilter;
window.MobileNavigation = MobileNavigation;
window.SmoothScroll = SmoothScroll;
