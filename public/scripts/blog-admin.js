// Blog Admin Dashboard JavaScript

let articles = [];
let editingIndex = null;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadArticles();
});

function checkAuth() {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
    }
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    window.location.href = 'admin-login.html';
}

async function loadArticles() {
    try {
        const response = await fetch('../data/articles.json');
        articles = await response.json();
        displayArticles();
    } catch (error) {
        console.error('Error loading articles:', error);
        articles = [];
        displayArticles();
    }
}

function displayArticles() {
    const articleList = document.getElementById('article-list');

    if (articles.length === 0) {
        articleList.innerHTML = '<div class="empty-state"><p>No articles yet. Click "Add New Article" to create your first article.</p></div>';
        return;
    }

    // Sort by date (newest first)
    const sortedArticles = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));

    articleList.innerHTML = sortedArticles.map((article, index) => {
        const realIndex = articles.findIndex(a => a.id === article.id);
        const date = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="article-item">
                <h3>${article.title}</h3>
                <div class="article-meta">Published: ${date}${article.linkedinUrl ? ' | Has LinkedIn URL' : ''}</div>
                <div class="article-actions">
                    <button class="btn-edit" onclick="editArticle(${realIndex})">Edit</button>
                    <button class="btn-delete" onclick="deleteArticle(${realIndex})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function showNewArticleForm() {
    editingIndex = null;
    document.getElementById('editor-title').textContent = 'New Article';
    document.getElementById('article-id').value = '';
    document.getElementById('article-title').value = '';
    document.getElementById('article-content').value = '';
    document.getElementById('article-linkedin').value = '';

    document.getElementById('article-editor').classList.add('active');
    document.getElementById('article-editor').scrollIntoView({ behavior: 'smooth' });
}

function editArticle(index) {
    editingIndex = index;
    const article = articles[index];

    document.getElementById('editor-title').textContent = 'Edit Article';
    document.getElementById('article-id').value = article.id;
    document.getElementById('article-title').value = article.title;
    document.getElementById('article-content').value = article.content;
    document.getElementById('article-linkedin').value = article.linkedinUrl || '';

    document.getElementById('article-editor').classList.add('active');
    document.getElementById('article-editor').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById('article-editor').classList.remove('active');
    document.getElementById('article-form').reset();
    editingIndex = null;
}

async function saveArticle(event) {
    event.preventDefault();

    const title = document.getElementById('article-title').value;
    const content = document.getElementById('article-content').value;
    const linkedinUrl = document.getElementById('article-linkedin').value;

    const article = {
        id: document.getElementById('article-id').value || Date.now().toString(),
        title: title,
        date: editingIndex !== null ? articles[editingIndex].date : new Date().toISOString().split('T')[0],
        excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
        content: content,
        linkedinUrl: linkedinUrl || undefined
    };

    if (editingIndex !== null) {
        // Update existing article
        articles[editingIndex] = article;
    } else {
        // Add new article
        articles.unshift(article); // Add to beginning
    }

    // Save to localStorage (simulating server save)
    localStorage.setItem('articles', JSON.stringify(articles));

    // In a real implementation, you would save to server here
    // For now, we'll download the updated JSON file
    await downloadArticlesJSON();

    showSuccessMessage();
    cancelEdit();
    displayArticles();
}

function deleteArticle(index) {
    if (confirm('Are you sure you want to delete this article?')) {
        articles.splice(index, 1);

        // Save to localStorage
        localStorage.setItem('articles', JSON.stringify(articles));

        // Download updated JSON
        downloadArticlesJSON();

        showSuccessMessage('Article deleted successfully!');
        displayArticles();
    }
}

async function downloadArticlesJSON() {
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(articles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'articles.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    // Also show a message to user
    alert('Article saved! Please replace the articles.json file in public/data/ with the downloaded file to update the website.');
}

function showSuccessMessage(message = 'Changes saved successfully!') {
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successMessage.style.display = 'block';

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Load articles from localStorage if available
const storedArticles = localStorage.getItem('articles');
if (storedArticles) {
    try {
        articles = JSON.parse(storedArticles);
    } catch (e) {
        console.error('Error parsing stored articles:', e);
    }
}
