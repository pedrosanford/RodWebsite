// Blog functionality for public display

document.addEventListener('DOMContentLoaded', function() {
    loadBlogArticles();
});

// Parse frontmatter from markdown content
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { frontmatter: {}, body: content };
    }

    const frontmatterText = match[1];
    const body = match[2];

    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            frontmatter[key] = value;
        }
    });

    return { frontmatter, body };
}

// Fetch list of markdown files from the posts directory
async function fetchPostList() {
    try {
        // Try to fetch the posts directory listing
        // Note: This works with Netlify's file serving
        const response = await fetch('../posts/');
        const text = await response.text();

        // Parse HTML to extract .md file links
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        const mdFiles = links
            .map(a => a.getAttribute('href'))
            .filter(href => href && href.endsWith('.md'));

        return mdFiles;
    } catch (error) {
        // If directory listing doesn't work, fall back to known files
        console.log('Directory listing not available, checking for known posts');

        // Try to fetch known posts
        const knownPosts = ['example-post.md'];
        const existingPosts = [];

        for (const post of knownPosts) {
            try {
                const response = await fetch(`../posts/${post}`);
                if (response.ok) {
                    existingPosts.push(post);
                }
            } catch (e) {
                // Post doesn't exist, skip it
            }
        }

        return existingPosts;
    }
}

async function loadBlogArticles() {
    const blogPostsContainer = document.getElementById('blog-posts');

    try {
        // Get list of markdown files
        const postFiles = await fetchPostList();

        if (!postFiles || postFiles.length === 0) {
            // Show empty state
            blogPostsContainer.innerHTML = `
                <div class="empty-state">
                    <p>👉 No articles at this moment.</p>
                </div>
            `;
            return;
        }

        // Fetch and parse all posts
        const posts = [];
        for (const filename of postFiles) {
            try {
                const response = await fetch(`../posts/${filename}`);
                const content = await response.text();
                const { frontmatter, body } = parseFrontmatter(content);

                // Create slug from filename
                const slug = filename.replace('.md', '');

                posts.push({
                    slug,
                    title: frontmatter.title || 'Untitled',
                    date: frontmatter.date || new Date().toISOString(),
                    description: frontmatter.description || '',
                    linkedin_url: frontmatter.linkedin_url || '',
                    thumbnail: frontmatter.thumbnail || '',
                    body
                });
            } catch (error) {
                console.error(`Error loading post ${filename}:`, error);
            }
        }

        // Clear loading message
        blogPostsContainer.innerHTML = '';

        if (posts.length === 0) {
            blogPostsContainer.innerHTML = `
                <div class="empty-state">
                    <p>👉 No articles at this moment.</p>
                </div>
            `;
            return;
        }

        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Display posts
        posts.forEach(post => {
            const articleCard = createArticleCard(post);
            blogPostsContainer.appendChild(articleCard);
        });

    } catch (error) {
        console.error('Error loading articles:', error);
        blogPostsContainer.innerHTML = `
            <div class="empty-state">
                <p>👉 No articles at this moment.</p>
            </div>
        `;
    }
}

function createArticleCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';

    // Format date
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Add thumbnail image if available
    const thumbnailHtml = post.thumbnail ?
        `<div class="blog-card-image">
            <img src="${post.thumbnail}" alt="${post.title}" />
        </div>` : '';

    // Determine button behavior
    let buttonHtml;
    if (post.linkedin_url) {
        buttonHtml = `
            <a href="${post.linkedin_url}" target="_blank" class="btn btn-secondary blog-link">
                <img src="../images/linkedin-icon.png" alt="LinkedIn" class="btn-icon" style="width: 20px; height: 20px;">
                Read on LinkedIn
            </a>
        `;
    } else {
        buttonHtml = `
            <button class="btn btn-secondary" disabled style="opacity: 0.5; cursor: not-allowed;">
                LinkedIn Post Coming Soon
            </button>
        `;
    }

    // Make the card clickable to go to detail page
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking on the button
        if (!e.target.closest('.btn')) {
            window.location.href = `blog-post.html?slug=${post.slug}`;
        }
    });

    card.innerHTML = `
        ${thumbnailHtml}
        <div class="blog-card-content">
            <div class="blog-date">${formattedDate}</div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.description}</p>
            <div class="blog-card-footer">
                ${buttonHtml}
            </div>
        </div>
    `;

    return card;
}
