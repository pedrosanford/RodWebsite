// Admin panel functionality

// Hardcoded admin credentials (for demo purposes)
const ADMIN_CREDENTIALS = {
    email: 'admin@rodsamra.com',
    password: 'admin123'
};

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showAdminPanel();
        loadContent();
    }
}

// Login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('login-form').style.display = 'none';
        showAdminPanel();
        loadContent();
        errorMsg.style.display = 'none';
    } else {
        errorMsg.style.display = 'block';
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('admin-panel').style.display = 'block';
}

// Load existing content
async function loadContent() {
    await loadAboutContent();
    await loadArticles();
}

// Load about content
async function loadAboutContent() {
    try {
        const response = await fetch('/src/data/siteContent.json');
        const data = await response.json();

        if (data.aboutBio) {
            document.getElementById('about-bio').value = data.aboutBio;
        }
    } catch (error) {
        console.error('Error loading about content:', error);
        // Set default content if file doesn't exist
        const defaultBio = `Rod Samra is a nationally recognized strategic HR and compliance consultant with more than two decades of experience shaping fair, ethical, and high performing workplaces. A former U.S. Department of Labor-OFCCP investigator, Rod has led complex EEO investigations, wage audits, and multi-state compliance initiatives, bringing both technical precision and a deep commitment to equity.

Blending advanced HR analytics with neuroscience-informed leadership, Rod helps organizations design cultures where compliance and compassion work hand in hand. His expertise spans impact ratio analysis, adverse impact testing, and data-driven decision making — always anchored in the belief that people are an organization's greatest asset.

Rod is known for translating complex regulations into actionable strategies that elevate both performance and trust.`;

        document.getElementById('about-bio').value = defaultBio;
    }
}

// Load articles
async function loadArticles() {
    try {
        const response = await fetch('/src/data/articles.json');
        const articles = await response.json();

        renderArticleEditors(articles);
    } catch (error) {
        console.error('Error loading articles:', error);
        // Initialize with empty array if file doesn't exist
        renderArticleEditors([]);
    }
}

// Render article editors
function renderArticleEditors(articles) {
    const container = document.getElementById('articles-container');
    container.innerHTML = '';

    articles.forEach((article, index) => {
        const editor = createArticleEditor(article, index);
        container.appendChild(editor);
    });
}

// Create article editor element
function createArticleEditor(article, index) {
    const editor = document.createElement('div');
    editor.className = 'article-editor';
    editor.setAttribute('data-index', index);

    editor.innerHTML = `
        <h3>Article ${index + 1}</h3>
        <div class="form-group">
            <label>Title</label>
            <input type="text" class="article-title" value="${article.title || ''}" />
        </div>
        <div class="form-group">
            <label>Date (YYYY-MM-DD)</label>
            <input type="date" class="article-date" value="${article.date || ''}" />
        </div>
        <div class="form-group">
            <label>Cover Image</label>
            <input type="file" class="article-cover-image" accept="image/*" onchange="previewImage(this, ${index})" />
            <img class="image-preview" id="preview-${index}" src="${article.coverImage || ''}" ${article.coverImage ? 'style="display:block;"' : ''} />
            <input type="hidden" class="article-cover-image-data" value="${article.coverImage || ''}" />
        </div>
        <div class="form-group">
            <label>Excerpt</label>
            <textarea class="article-excerpt" rows="3">${article.excerpt || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Content</label>
            <textarea class="article-content" rows="6">${article.content || ''}</textarea>
        </div>
        <div class="form-group">
            <label>LinkedIn URL (optional)</label>
            <input type="url" class="article-linkedin" value="${article.linkedinUrl || ''}" />
        </div>
        <button class="btn-save" onclick="deleteArticle(${index})" style="background: #dc3545;">Delete Article</button>
    `;

    return editor;
}

// Preview image when selected
function previewImage(input, index) {
    const preview = document.getElementById(`preview-${index}`);
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            // Store base64 data in hidden input
            const hiddenInput = input.parentElement.querySelector('.article-cover-image-data');
            hiddenInput.value = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}

// Add new article
function addNewArticle() {
    const container = document.getElementById('articles-container');
    const currentCount = container.querySelectorAll('.article-editor').length;

    const newArticle = {
        title: '',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        content: '',
        linkedinUrl: '',
        coverImage: ''
    };

    const editor = createArticleEditor(newArticle, currentCount);
    container.appendChild(editor);
}

// Delete article
function deleteArticle(index) {
    if (confirm('Are you sure you want to delete this article?')) {
        const container = document.getElementById('articles-container');
        const editors = container.querySelectorAll('.article-editor');
        editors[index].remove();

        // Re-index remaining articles
        const remaining = container.querySelectorAll('.article-editor');
        remaining.forEach((editor, newIndex) => {
            editor.setAttribute('data-index', newIndex);
            editor.querySelector('h3').textContent = `Article ${newIndex + 1}`;
        });
    }
}

// Save about content
function saveAboutContent() {
    const bio = document.getElementById('about-bio').value;

    const content = {
        aboutBio: bio
    };

    // In a real implementation, this would send to a server
    // For now, we'll save to localStorage as a demo
    localStorage.setItem('siteContent', JSON.stringify(content));

    showSuccessMessage();

    console.log('About content saved:', content);
    alert('About content saved! (Note: This is stored in browser localStorage for demo purposes)');
}

// Save all articles
function saveArticles() {
    const editors = document.querySelectorAll('.article-editor');
    const articles = [];

    editors.forEach(editor => {
        const article = {
            title: editor.querySelector('.article-title').value,
            date: editor.querySelector('.article-date').value,
            excerpt: editor.querySelector('.article-excerpt').value,
            content: editor.querySelector('.article-content').value,
            linkedinUrl: editor.querySelector('.article-linkedin').value,
            coverImage: editor.querySelector('.article-cover-image-data').value
        };

        if (article.title && article.content) {
            articles.push(article);
        }
    });

    // In a real implementation, this would send to a server
    // For now, we'll save to localStorage as a demo
    localStorage.setItem('articles', JSON.stringify(articles));

    showSuccessMessage();

    console.log('Articles saved:', articles);
    alert('Articles saved! (Note: This is stored in browser localStorage for demo purposes)');
}

// Show success message
function showSuccessMessage() {
    const message = document.getElementById('success-message');
    message.style.display = 'block';

    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});
