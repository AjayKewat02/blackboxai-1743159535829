// Initialize Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.40.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false }
    });
});

// Run button functionality
document.getElementById('run-btn').addEventListener('click', function() {
    const code = window.editor.getValue();
    const output = document.getElementById('output');
    output.innerHTML = ''; // Clear previous output
    
    // Override console.log to capture output
    const oldLog = console.log;
    console.log = function(...args) {
        output.innerHTML += args.join(' ') + '\n';
        oldLog.apply(console, args);
    };

    try {
        // Execute the code
        eval(code);
    } catch (error) {
        output.innerHTML += `Error: ${error.message}\n`;
    }

    // Restore original console.log
    console.log = oldLog;
});

// Theme toggle functionality
document.getElementById('theme-toggle').addEventListener('click', function() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    document.cookie = `theme=${isDark ? 'dark' : 'light'}; path=/; max-age=31536000`;
    
    // Update Monaco editor theme
    if (window.editor) {
        monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
    }
});

// Check for saved theme preference
if (document.cookie.includes('theme=dark') || 
    (!document.cookie.includes('theme=light') && 
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}