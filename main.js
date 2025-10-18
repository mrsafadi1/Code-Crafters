// // ========= Smooth scroll with tiny sticky-header offset =========
// function scrollToId(id) {
//     const el = document.getElementById(id);
//     if (!el) return;
//     const header = document.querySelector('.header');
//     const offset = (header?.offsetHeight || 64) + 2; // minimal breathing room
//     const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
//     window.scrollTo({ top: y, behavior: 'smooth' });
// }

// // ========= Global [data-nav] handler (desktop/footer/logo) =========
// document.addEventListener('click', (e) => {
//     const t = e.target.closest('[data-nav]');
//     if (!t) return;
//     const id = t.getAttribute('data-nav');
//     // let the mobile menu's own handler take over if click happened inside it
//     const mobileMenu = document.getElementById('mobileMenu');
//     if (mobileMenu && mobileMenu.contains(t)) return;
//     scrollToId(id);
// });

// // ========= Mobile full-screen menu (overlay) =========
// const mobileToggle = document.getElementById('mobileToggle');
// const mobileMenu = document.getElementById('mobileMenu');

// function openMobileMenu() {
//     if (!mobileMenu) return;
//     mobileMenu.removeAttribute('hidden');      // show overlay
//     document.body.classList.add('no-scroll');  // lock background
//     mobileToggle?.setAttribute('aria-expanded', 'true');
// }
// function closeMobileMenu() {
//     if (!mobileMenu) return;
//     mobileMenu.setAttribute('hidden', '');      // hide overlay
//     document.body.classList.remove('no-scroll');
//     mobileToggle?.setAttribute('aria-expanded', 'false');
// }
// mobileToggle?.addEventListener('click', () => {
//     const isOpen = !mobileMenu.hasAttribute('hidden');
//     isOpen ? closeMobileMenu() : openMobileMenu();
// });
// // Close when clicking an item (then scroll)
// mobileMenu?.addEventListener('click', (e) => {
//     const btn = e.target.closest('[data-nav]');
//     if (!btn) {
//         // tap outside panel closes too
//         if (e.target === mobileMenu) closeMobileMenu();
//         return;
//     }
//     const id = btn.getAttribute('data-nav');
//     closeMobileMenu();
//     scrollToId(id);
// });
// // Close on Esc
// document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });

// // ===== EmailJS credentials =====
// // const EMAILJS_PUBLIC_KEY = "IMi0gDzXehhquwQmn";        // from EmailJS account
// // const EMAILJS_SERVICE_ID = "service_demoDev";        // e.g., service_xxxxxx
// // const TEMPLATE_ADMIN_ID = "template_admin_notify";  // from step A
// // const TEMPLATE_USER_ID = "template_user_receipt";  // from step B
// // Pull values from window.__EMAILJS__ (defined in config.js)
// const {
//     PUBLIC_KEY,
//     SERVICE_ID,
//     TEMPLATE_USER_ID
// } = (window.__EMAILJS__ || {});

// // Quick safety check (optional)
// if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ADMIN_ID || !TEMPLATE_USER_ID) {
//     console.warn("EmailJS config missing. Did you include config.js before main.js?");
// }

// // Initialize EmailJS once
// if (window.emailjs && PUBLIC_KEY) {
//     try { emailjs.init({ publicKey: PUBLIC_KEY }); } catch (e) { console.error(e); }
// }


// // Init once
// if (window.emailjs && PUBLIC_KEY) {
//     try { window.emailjs.init({ publicKey: PUBLIC_KEY }); } catch (_) { }
// }

// const form = document.getElementById('contactForm');
// if (form) {
//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const fd = new FormData(form);
//         const data = Object.fromEntries(fd.entries());
//         const submitBtn = form.querySelector('button[type="submit"]');

//         // basic validation
//         if (!data.name || !data.email || !data.message) {
//             alert("Please fill in Name, Email and Message.");
//             return;
//         }

//         const payload = {
//             user_name: data.name,
//             user_email: data.email,
//             user_phone: data.phone || "",
//             user_message: data.message,
//             submitted_at: new Date().toLocaleString(),
//             reply_to: data.email,           // makes Reply-To go to the sender
//             to_email: data.email            // used by the user receipt template
//         };

//         const oldLabel = submitBtn?.textContent;
//         if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

//         try {
//             // Send both emails (admin + user)
//             await Promise.all([
//                 // Admin notification (To is fixed in the template settings)
//                 emailjs.send(SERVICE_ID, TEMPLATE_ADMIN_ID, payload),

//                 // User receipt (To is {{to_email}} in the template)
//                 emailjs.send(SERVICE_ID, TEMPLATE_USER_ID, payload)
//             ]);

//             alert("Thanks! Your message has been sent. We also emailed you a confirmation.");
//             form.reset();
//         } catch (err) {
//             console.error(err);
//             alert("Sorry, sending failed. Please try again later.");
//         } finally {
//             if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = oldLabel; }
//         }
//     });
// }

// // ==== Services tabs (Data vs Web) ====
// (function initServiceTabs() {
//     const tabs = document.querySelectorAll('.tabs .tab');
//     if (!tabs.length) return;
//     const panels = {
//         'tab-data': document.getElementById('panel-data'),
//         'tab-web': document.getElementById('panel-web')
//     };

//     function activate(tab) {
//         tabs.forEach(t => {
//             const isActive = t === tab;
//             t.classList.toggle('active', isActive);
//             t.setAttribute('aria-selected', isActive ? 'true' : 'false');
//             const panel = panels[t.id];
//             if (panel) panel.hidden = !isActive;
//         });
//     }

//     tabs.forEach(t => {
//         t.addEventListener('click', () => activate(t));
//         t.addEventListener('keydown', (e) => {
//             if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
//                 const arr = Array.from(tabs);
//                 const i = arr.indexOf(t);
//                 const next = e.key === 'ArrowRight' ? arr[(i + 1) % arr.length] : arr[(i - 1 + arr.length) % arr.length];
//                 next.focus();
//                 activate(next);
//             }
//         });
//     });
// })();
// ---------------- main.js (fixed) ----------------
(() => {
    // Run after DOM is ready
    const ready = (fn) =>
        document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn();

    // Pull EmailJS config injected by config.js (not committed)
    const {
        PUBLIC_KEY,
        SERVICE_ID,
        TEMPLATE_ADMIN_ID,   // <-- you were missing this
        TEMPLATE_USER_ID
    } = (window.__EMAILJS__ || {});

    ready(() => {
        // ========= Smooth scroll with tiny sticky-header offset =========
        function scrollToId(id) {
            const el = document.getElementById(id);
            if (!el) return;
            const header = document.querySelector(".header");
            const offset = (header?.offsetHeight || 64) + 2;
            const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }

        // ========= Global [data-nav] handler (desktop/footer/logo) =========
        document.addEventListener("click", (e) => {
            const t = e.target.closest("[data-nav]");
            if (!t) return;
            const id = t.getAttribute("data-nav");
            const mobileMenu = document.getElementById("mobileMenu");
            if (mobileMenu && mobileMenu.contains(t)) return; // mobile menu handler below
            scrollToId(id);
        });

        // ========= Mobile full-screen menu (overlay) =========
        const mobileToggle = document.getElementById("mobileToggle");
        const mobileMenu = document.getElementById("mobileMenu");

        function openMobileMenu() {
            if (!mobileMenu) return;
            mobileMenu.removeAttribute("hidden");
            document.body.classList.add("no-scroll");
            mobileToggle?.setAttribute("aria-expanded", "true");
        }
        function closeMobileMenu() {
            if (!mobileMenu) return;
            mobileMenu.setAttribute("hidden", "");
            document.body.classList.remove("no-scroll");
            mobileToggle?.setAttribute("aria-expanded", "false");
        }

        mobileToggle?.addEventListener("click", () => {
            const isOpen = !mobileMenu.hasAttribute("hidden");
            isOpen ? closeMobileMenu() : openMobileMenu();
        });

        // Close when clicking an item (then scroll) or clicking backdrop
        mobileMenu?.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-nav]");
            if (!btn) {
                if (e.target === mobileMenu) closeMobileMenu();
                return;
            }
            const id = btn.getAttribute("data-nav");
            closeMobileMenu();
            scrollToId(id);
        });

        // Close on Esc
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeMobileMenu();
        });

        // ========= EmailJS (init once if keys exist) =========
        if (window.emailjs && PUBLIC_KEY) {
            try { emailjs.init({ publicKey: PUBLIC_KEY }); } catch (e) { console.error(e); }
        }

        // ========= Contact form =========
        const form = document.getElementById("contactForm");
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                const fd = new FormData(form);
                const data = Object.fromEntries(fd.entries());
                const submitBtn = form.querySelector('button[type="submit"]');

                if (!data.name || !data.email || !data.message) {
                    alert("Please fill in Name, Email and Message.");
                    return;
                }

                const payload = {
                    user_name: data.name,
                    user_email: data.email,
                    user_phone: data.phone || "",
                    user_message: data.message,
                    submitted_at: new Date().toLocaleString(),
                    reply_to: data.email,
                    to_email: data.email
                };

                const oldLabel = submitBtn?.textContent;
                if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

                try {
                    if (!(SERVICE_ID && TEMPLATE_USER_ID)) throw new Error("EmailJS config missing");

                    // Send both emails if admin template is configured; otherwise just user receipt
                    if (TEMPLATE_ADMIN_ID) {
                        await Promise.all([
                            emailjs.send(SERVICE_ID, TEMPLATE_ADMIN_ID, payload),
                            emailjs.send(SERVICE_ID, TEMPLATE_USER_ID, payload)
                        ]);
                    } else {
                        await emailjs.send(SERVICE_ID, TEMPLATE_USER_ID, payload);
                    }

                    alert("Thanks! Your message has been sent. We also emailed you a confirmation.");
                    form.reset();
                } catch (err) {
                    console.error(err);
                    alert("Sorry, sending failed. Please try again later.");
                } finally {
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = oldLabel; }
                }
            });
        }

        // ==== Services tabs (Data vs Web) ====
        const tablist = document.querySelector('.tabs[role="tablist"]');
        if (tablist) {
            const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
            const getPanel = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

            function show(index) {
                tabs.forEach((t, i) => {
                    const selected = i === index;
                    t.classList.toggle('active', selected);
                    t.setAttribute('aria-selected', selected ? 'true' : 'false');
                    t.setAttribute('tabindex', selected ? '0' : '-1');
                    const panel = getPanel(t);
                    if (panel) panel.hidden = !selected;
                });
            }

            let current = tabs.findIndex(t => t.classList.contains('active'));
            if (current < 0) current = 0;
            show(current);

            tablist.addEventListener('click', (e) => {
                const tab = e.target.closest('[role="tab"]');
                if (!tab) return;
                e.preventDefault();
                const i = tabs.indexOf(tab);
                if (i > -1) show(i);
            });

            tablist.addEventListener('keydown', (e) => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
                e.preventDefault();
                const idx = tabs.indexOf(document.activeElement);
                let next = idx;
                if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = tabs.length - 1;
                else if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
                else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
                tabs[next].focus();
                show(next);
            });
        }
    });
})();
