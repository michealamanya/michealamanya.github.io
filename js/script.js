document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");
    const topButton = document.getElementById("floating-top");
    const scrollProgress = document.getElementById("scroll-progress");
    const pageAura = document.querySelector(".page-aura");
    const contactForm = document.getElementById("contact-form");
    const formNote = document.getElementById("form-note");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    entry.target.classList.add("is-inview");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.16 }
    );

    const revealSections = document.querySelectorAll(".reveal");
    revealSections.forEach((section, index) => {
        section.style.setProperty("--reveal-delay", `${index * 70}ms`);
        revealObserver.observe(section);
    });

    const navAnchors = document.querySelectorAll(".nav-links a");
    const sectionIds = Array.from(navAnchors)
        .map((a) => a.getAttribute("href"))
        .filter((href) => href && href.startsWith("#"));

    const sections = sectionIds
        .map((id) => document.querySelector(id))
        .filter((section) => section);

    const markActiveLink = () => {
        const scrollLine = window.scrollY + window.innerHeight * 0.3;

        sections.forEach((section) => {
            const id = section.getAttribute("id");
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (!link) {
                return;
            }

            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const active = scrollLine >= top && scrollLine < bottom;
            link.classList.toggle("active", active);
        });
    };

    const updateScrollEffects = () => {
        markActiveLink();

        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;

        if (scrollProgress) {
            scrollProgress.style.transform = `scaleX(${progress})`;
        }

        if (pageAura) {
            const driftY = Math.min(scrollTop * 0.05, 18);
            pageAura.style.transform = `translate3d(0, ${driftY}px, 0)`;
        }

        if (topButton) {
            if (scrollTop > 420) {
                topButton.classList.add("visible");
            } else {
                topButton.classList.remove("visible");
            }
        }
    };

    updateScrollEffects();

    let scrolling = false;
    window.addEventListener("scroll", () => {
        if (scrolling) {
            return;
        }

        scrolling = true;
        window.requestAnimationFrame(() => {
            updateScrollEffects();
            scrolling = false;
        });
    });

    if (window.matchMedia("(hover: hover)").matches) {
        const interactiveSurfaces = document.querySelectorAll(
            ".hero-panel, .service-card, .skill, .project-card"
        );

        interactiveSurfaces.forEach((surface) => {
            surface.addEventListener("mousemove", (event) => {
                const rect = surface.getBoundingClientRect();
                const relativeX = (event.clientX - rect.left) / rect.width;
                const relativeY = (event.clientY - rect.top) / rect.height;

                const rotateY = (relativeX - 0.5) * 6;
                const rotateX = (0.5 - relativeY) * 6;

                surface.style.setProperty("--rx", `${rotateX}deg`);
                surface.style.setProperty("--ry", `${rotateY}deg`);
                surface.style.setProperty("--mx", `${relativeX * 100}%`);
                surface.style.setProperty("--my", `${relativeY * 100}%`);
                surface.classList.add("is-hovered");
            });

            surface.addEventListener("mouseleave", () => {
                surface.classList.remove("is-hovered");
                surface.style.setProperty("--rx", "0deg");
                surface.style.setProperty("--ry", "0deg");
            });
        });
    }

    if (topButton) {
        topButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (contactForm && formNote) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = (document.getElementById("name")?.value || "").trim();
            const email = (document.getElementById("email")?.value || "").trim();
            const message = (document.getElementById("message")?.value || "").trim();

            if (!name || !email || !message) {
                formNote.textContent = "Please complete all required fields.";
                return;
            }

            const subject = encodeURIComponent(`Project Inquiry from ${name}`);
            const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
            const mailtoUrl = `mailto:amanyamicheal770@gmail.com?subject=${subject}&body=${body}`;

            window.location.href = mailtoUrl;
            formNote.textContent = "Opening your email app to send the message.";
            contactForm.reset();
        });
    }
});
