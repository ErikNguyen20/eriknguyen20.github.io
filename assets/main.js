async function loadPublications() {
    const response = await fetch('publications.html');
    const publicationsHTML = await response.text();
    document.getElementById('publications-row').innerHTML = publicationsHTML;
}

async function loadProjects() {
    const response = await fetch('projects.html');
    const projectsHTML = await response.text();
    document.getElementById('projects-row').innerHTML = projectsHTML;
}

async function loadWorkExperiences() {
    const response = await fetch('work_experiences.html');
    const experiencesHTML = await response.text();
    document.getElementById('timeline-container').innerHTML = experiencesHTML;
}

async function loadAwards() {
    const response = await fetch('awards.html');
    const awardsHTML = await response.text();
    document.getElementById('awards-row').innerHTML = awardsHTML;
}

async function loadNavbar() {
    const response = await fetch('assets/navbar.html');
    const navbarHTML = await response.text();
    document.getElementById('navbar-placeholder').innerHTML = navbarHTML;

    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        navbarCollapse.addEventListener('shown.bs.collapse', () => {
            document.getElementById('progress-bar-container')?.classList.add('hide-progress-bar');
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', () => {
            document.getElementById('progress-bar-container')?.classList.remove('hide-progress-bar');
        });
    }
}

// Reveal sections while scrolling animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 100; // Adjust trigger point if needed

        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('visible');
        }
    });
}

// Sets the Totoro seasonal gif
function setSeasonGif() {
    // Get the current month (0 = January, 11 = December)
    const currentMonth = new Date().getMonth();

    // Get the GIF element
    const gifImage = document.getElementById('seasonal-gif');

    // Check if it's December (Month 11)
    if (currentMonth === 11 || currentMonth === 10 || currentMonth === 0) {
        gifImage.src = "assets/christmas-walking-gif.gif";  // Set December GIF
    } else {
        gifImage.src = "assets/walking-gif.gif";  // Set default GIF
    }
}

function applyThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.src = theme === 'dark' ? 'assets/icons/sun-fill.svg' : 'assets/icons/moon.svg';
        icon.alt = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
}

function updateTotoroImage(theme) {
    const img = document.getElementById('totoro-img');
    if (img) {
        img.src = theme === 'dark'
            ? 'assets/studiototoro_dark.png' : 'assets/studiototoro_light.png';
    }
}


function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-bs-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', next);
    localStorage.setItem('theme', next);
    applyThemeIcon(next);
    updateTotoroImage(next);
}



function main_index() {
    // Load Page Content
    const loadPromises = [
        loadNavbar(),
        loadWorkExperiences(),
        loadPublications(),
        loadProjects(),
        loadAwards(),
    ];

    // Wait for all dynamic content to finish loading
    Promise.all(loadPromises).then(() => {
        // Updates the theme toggle button
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
            const savedTheme = localStorage.getItem('theme') || 'dark';
            applyThemeIcon(savedTheme);
        }
    });

    // Adds reveal scrolling listeners
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);

    // Adds scrolling listener for the progress bar
    window.addEventListener('scroll', () => {
        const progressBar = document.getElementById('progress-bar');
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const scrollPercentage = (scrolled / totalHeight) * 100;

        // Update the width of the progress bar
        progressBar.style.width = `${scrollPercentage}%`;
    });

    setSeasonGif()
}

function main_cv() {
    // Load Page Content
    const loadPromises = [
        loadNavbar()
    ];

    // Wait for all dynamic content to finish loading
    Promise.all(loadPromises).then(() => {
        // Updates the theme toggle button
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
            const savedTheme = localStorage.getItem('theme') || 'dark';
            applyThemeIcon(savedTheme);
            updateTotoroImage(savedTheme);
        }
    });
}


// Expose them to global scope so HTML can call them
window.main_index = main_index;
window.main_cv = main_cv;
