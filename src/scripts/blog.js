// Blog page functionality

document.addEventListener('DOMContentLoaded', async function() {
    await loadBlogPosts();
});

// Load blog posts from JSON
async function loadBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');

    if (!blogContainer) return;

    try {
        const response = await fetch('/src/data/articles.json');
        const articles = await response.json();

        // Clear loading message
        blogContainer.innerHTML = '';

        if (articles.length === 0) {
            blogContainer.innerHTML = '<p class="loading">No articles available yet.</p>';
            return;
        }

        // Sort articles by date (newest first)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Render each article
        articles.forEach(article => {
            const articleCard = createArticleCard(article);
            blogContainer.appendChild(articleCard);
        });

    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogContainer.innerHTML = '<p class="loading">Error loading articles. Please try again later.</p>';
    }
}

// Create article card element
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'blog-post';

    const content = document.createElement('div');
    content.className = 'blog-post-content';

    // Title
    const title = document.createElement('h3');
    title.textContent = article.title;
    content.appendChild(title);

    // Date
    const date = document.createElement('div');
    date.className = 'blog-date';
    date.textContent = formatDate(article.date);
    content.appendChild(date);

    // Excerpt
    const excerpt = document.createElement('p');
    excerpt.className = 'blog-excerpt';
    excerpt.textContent = article.excerpt || article.content.substring(0, 150) + '...';
    content.appendChild(excerpt);

    // Links container
    const linksContainer = document.createElement('div');
    linksContainer.className = 'blog-links';

    // Read more link (if full article exists)
    if (article.fullContent || article.linkedinUrl) {
        // LinkedIn link
        if (article.linkedinUrl) {
            const linkedinLink = document.createElement('a');
            linkedinLink.href = article.linkedinUrl;
            linkedinLink.target = '_blank';
            linkedinLink.rel = 'noopener noreferrer';

            const linkedinIcon = document.createElement('img');
            linkedinIcon.src = '/public/images/linkedin-icon.png';
            linkedinIcon.alt = 'LinkedIn';
            linkedinIcon.className = 'blog-linkedin';

            linkedinLink.appendChild(linkedinIcon);
            linksContainer.appendChild(linkedinLink);
        }

        // Read more on LinkedIn
        if (article.linkedinUrl) {
            const readMore = document.createElement('a');
            readMore.href = article.linkedinUrl;
            readMore.target = '_blank';
            readMore.rel = 'noopener noreferrer';
            readMore.className = 'blog-link';
            readMore.textContent = 'Read on LinkedIn →';
            linksContainer.appendChild(readMore);
        }
    }

    content.appendChild(linksContainer);
    card.appendChild(content);

    return card;
}

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}
