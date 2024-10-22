document.querySelectorAll('.smoothscroll').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const darkModeToggle = document.getElementById('toggle-button');
const body = document.body;

const savedDarkMode = localStorage.getItem('darkMode');

if (savedDarkMode === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.classList.add('dark-mode-active'); }

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('dark-mode-active'); 
        if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');      } else {
        localStorage.removeItem('darkMode');      }
});
