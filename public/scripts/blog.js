// Blog functionality for public display

document.addEventListener('DOMContentLoaded', function() {
    loadBlogArticles();
});

async function loadBlogArticles() {
    const blogPostsContainer = document.getElementById('blog-posts');

    try {
        const response = await fetch('../data/articles.json');
        const articles = await response.json();

        // Clear loading message
        blogPostsContainer.innerHTML = '';

        if (!articles || articles.length === 0) {
            // Show empty state
            blogPostsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No articles available at this time.</p>
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">Check back soon for new content!</p>
                </div>
            `;
            return;
        }

        // Sort articles by date (newest first)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Display articles
        articles.forEach(article => {
            const articleCard = createArticleCard(article);
            blogPostsContainer.appendChild(articleCard);
        });

    } catch (error) {
        console.error('Error loading articles:', error);
        blogPostsContainer.innerHTML = `
            <div class="empty-state">
                <p>Unable to load articles at this time.</p>
            </div>
        `;
    }
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'blog-card';

    // Format date
    const date = new Date(article.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Create excerpt if not provided
    const excerpt = article.excerpt || article.content.substring(0, 150) + '...';

    // Add cover image if available
    const coverImageHtml = article.coverImage ?
        `<div class="blog-card-image">
            <img src="${article.coverImage}" alt="${article.title}" />
        </div>` : '';

    card.innerHTML = `
        ${coverImageHtml}
        <div class="blog-card-content">
            <div class="blog-date">${formattedDate}</div>
            <h3 class="blog-title">${article.title}</h3>
            <p class="blog-excerpt">${excerpt}</p>
            <div class="blog-card-footer">
                ${article.linkedinUrl ?
                    `<a href="${article.linkedinUrl}" target="_blank" class="btn btn-secondary blog-link">
                        <img src="../images/linkedin-icon.png" alt="LinkedIn" class="btn-icon">
                        Read on LinkedIn
                    </a>`
                    :
                    `<button class="btn btn-secondary" onclick="showFullArticle('${article.id}')">Read More</button>`
                }
            </div>
        </div>
    `;

    return card;
}

function showFullArticle(articleId) {
    // For now, we'll show an alert. In a full implementation,
    // this would open a modal or navigate to a dedicated article page
    fetch('../data/articles.json')
        .then(response => response.json())
        .then(articles => {
            const article = articles.find(a => a.id === articleId);
            if (article) {
                alert(`${article.title}\n\n${article.content}`);
            }
        });
}
