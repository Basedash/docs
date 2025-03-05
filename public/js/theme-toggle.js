// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  // Wait for Mintlify to initialize
  setTimeout(() => {
    // Apply our custom light/dark mode classes
    const applyThemeClass = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') || 
                         localStorage.getItem('mintlify-mode') === 'dark';
      
      if (isDarkMode) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
    };

    // Initial application
    applyThemeClass();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          applyThemeClass();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Also listen for storage events (in case theme is changed in another tab)
    window.addEventListener('storage', (event) => {
      if (event.key === 'mintlify-mode') {
        applyThemeClass();
      }
    });
  }, 500);
});
