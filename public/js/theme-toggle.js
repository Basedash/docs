// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check for theme toggle button
  const themeToggleBtn = document.querySelector('.theme-toggle, [data-theme-toggle]');
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      // Toggle between light and dark mode
      const html = document.documentElement;
      if (html.classList.contains('light')) {
        html.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.add('light');
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
  }
});
