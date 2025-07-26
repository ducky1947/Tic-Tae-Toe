// js/main.js

import { UIManager } from './uiManager.js';

// Initialize the UI Manager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("main.js: DOMContentLoaded event fired."); // DEBUG
    // Create a global instance of UIManager to make its methods accessible from HTML
    // We are now attaching event listeners programmatically in UIManager,
    // so we don't need to expose it globally for onclick attributes anymore.
    // However, keeping it global for easy console debugging if needed.
    window.uiManager = new UIManager();
    console.log("main.js: UIManager instance created."); // DEBUG
});
