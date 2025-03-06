// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  // Function to apply our custom light/dark mode classes
  const applyThemeClass = () => {
    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       localStorage.getItem('mintlify-mode') === 'dark';
    
    // Apply appropriate class
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    }
  };

  // Initial application
  setTimeout(applyThemeClass, 100);

  // Watch for theme changes via DOM mutations
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        applyThemeClass();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });

  // Also watch for localStorage changes
  window.addEventListener('storage', (event) => {
    if (event.key === 'mintlify-mode') {
      applyThemeClass();
    }
  });

  // Add click event listener to the theme toggle button
  document.addEventListener('click', (event) => {
    const themeToggleButton = event.target.closest('[aria-label="Toggle dark mode"]');
    if (themeToggleButton) {
      setTimeout(applyThemeClass, 100);
    }
  });
});
