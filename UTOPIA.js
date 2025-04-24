// ✅ Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ✅ Active Section Highlight in Navbar while Scrolling
window.addEventListener('scroll', () => {
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('nav a');

    sections.forEach(section => {
        let top = window.scrollY;
        let offset = section.offsetTop - 100;
        let height = section.offsetHeight;
        let id = section.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('text-blue-400'); // Remove active color
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('text-blue-400'); // Add active color
                }
            });
        }
    });
});

// ✅ Mobile Menu Toggle (if applicable)
const menuToggle = document.querySelector("#menu-toggle");
const menu = document.querySelector("#mobile-menu");

if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });
}

// ✅ Tabbed Navigation (Fixes Tab Visibility & Centers Content)
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Hide all tab contents
        document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.add('hidden'));

        // Show only the selected tab
        const targetTab = document.getElementById(this.dataset.tab);
        if (targetTab) {
            targetTab.classList.remove('hidden');
        }

        // Remove active state from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        // Add active state to the clicked button
        this.classList.add('active');

        // Smoothly scroll the tab content into the center with an adjusted position
        targetTab.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    });
});
  