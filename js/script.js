document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Scroll animations with Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all sections and cards
    document.querySelectorAll('.section, .glass-card, .skill-card, .project-card').forEach(element => {
        element.classList.add('hidden');
        observer.observe(element);
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill all fields');
                return;
            }
            
            // This is where you would normally send the form data to a server
            // For now, just show a success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.padding = '1rem 0';
        }
    });
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle.querySelector('i');
    let isDarkMode = true; // Start with dark mode since your design is dark by default

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.documentElement.style.setProperty('--primary-color', '#4361ee');
            document.documentElement.style.setProperty('--secondary-color', '#3f37c9');
            document.documentElement.style.setProperty('--text-color', '#f8f9fa');
            document.documentElement.style.setProperty('--text-secondary', '#e0e1dd');
            document.documentElement.style.setProperty('--glass-background', 'rgba(255, 255, 255, 0.1)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.18)');
            document.body.style.backgroundColor = '#0f0c29';
            icon.className = 'fas fa-sun';
            
            // Also update the background overlay for dark mode
            document.querySelector('.background').style.filter = 'brightness(0.3)';
        } else {
            document.documentElement.style.setProperty('--primary-color', '#3f37c9');
            document.documentElement.style.setProperty('--secondary-color', '#4361ee');
            document.documentElement.style.setProperty('--text-color', '#333333');
            document.documentElement.style.setProperty('--text-secondary', '#555555');
            document.documentElement.style.setProperty('--glass-background', 'rgba(255, 255, 255, 0.7)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.5)');
            document.body.style.backgroundColor = '#f8f9fa';
            icon.className = 'fas fa-moon';
            
            // Update the background overlay for light mode
            document.querySelector('.background').style.filter = 'brightness(0.8)';
        }
    });
    
    // GitHub Contribution Graph
    const fetchGitHubContributions = async () => {
        const githubUsername = 'michealamanya';
        const githubGraphContainer = document.getElementById('github-contributions');
        
        if (githubGraphContainer) {
            try {
                // Create an iframe to embed GitHub contribution calendar
                const iframe = document.createElement('iframe');
                iframe.src = `https://ghchart.rshah.org/${githubUsername}`;
                iframe.width = '100%';
                iframe.height = '120px';
                iframe.frameBorder = '0';
                iframe.scrolling = 'no';
                iframe.style.maxWidth = '100%';
                iframe.style.borderRadius = '10px';
                iframe.style.marginTop = '20px';
                
                githubGraphContainer.appendChild(iframe);
            } catch (error) {
                console.error('Error fetching GitHub contributions:', error);
                githubGraphContainer.innerHTML = '<p>GitHub contributions loading failed. Please check again later.</p>';
            }
        }
    };
    
    fetchGitHubContributions();
    
    // Typing effect for the hero text
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        typeWriter();
    }
});

// Add CSS animation classes
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .hidden {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        
        .hero-card {
            animation: float 6s ease-in-out infinite;
        }
    </style>
`);
