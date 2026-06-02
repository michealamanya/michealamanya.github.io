document.addEventListener("DOMContentLoaded", () => {
    const siteNav = document.getElementById("site-nav");
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");
    const contactForm = document.getElementById("contact-form");
    const formNote = document.getElementById("form-note");
    const revealItems = document.querySelectorAll(".reveal");
    const skillFills = document.querySelectorAll(".skill-fill");
    const tiltCards = document.querySelectorAll(".tilt-card");
    const navAnchors = document.querySelectorAll(".nav-links a");

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

    const sections = Array.from(navAnchors)
        .map((link) => link.getAttribute("href"))
        .filter((href) => href && href.startsWith("#"))
        .map((href) => document.querySelector(href))
        .filter(Boolean);

    const setActiveLink = () => {
        const threshold = window.scrollY + window.innerHeight * 0.35;

        navAnchors.forEach((link) => {
            const href = link.getAttribute("href");
            const section = href ? document.querySelector(href) : null;
            if (!section) {
                link.classList.remove("active");
                return;
            }

            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            link.classList.toggle("active", threshold >= top && threshold < bottom);
        });
    };

    const updateNavState = () => {
        if (siteNav) {
            siteNav.classList.toggle("scrolled", window.scrollY > 16);
        }
        setActiveLink();
    };

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const delay = entry.target.getAttribute("data-delay");
                if (delay) {
                    entry.target.style.setProperty("--reveal-delay", `${delay}ms`);
                }

                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });

    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const fill = entry.target.querySelector(".skill-fill");
                if (fill) {
                    fill.style.width = fill.dataset.width || "0%";
                }
                skillObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.35 }
    );

    skillFills.forEach((fill) => {
        const row = fill.closest(".skill-row");
        if (row) {
            skillObserver.observe(row);
        }
    });

    if (window.matchMedia("(hover: hover)").matches) {
        tiltCards.forEach((card) => {
            card.addEventListener("mousemove", (event) => {
                const rect = card.getBoundingClientRect();
                const relativeX = (event.clientX - rect.left) / rect.width;
                const relativeY = (event.clientY - rect.top) / rect.height;
                const rotateY = (relativeX - 0.5) * 6;
                const rotateX = (0.5 - relativeY) * 6;

                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    if (contactForm && formNote) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("name")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const message = document.getElementById("message")?.value.trim() || "";

            if (!name || !email || !message) {
                formNote.textContent = "Please complete all required fields.";
                return;
            }

            const subject = encodeURIComponent(`Project Inquiry from ${name}`);
            const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
            window.location.href = `mailto:amanyamicheal770@gmail.com?subject=${subject}&body=${body}`;
            formNote.textContent = "Opening your email app to send the message.";
            contactForm.reset();
        });
    }

    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);
});
