// Blog post detail page functionality

document.addEventListener('DOMContentLoaded', function() {
    loadBlogPost();
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

// Get slug from URL parameter
function getSlugFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('slug');
}

async function loadBlogPost() {
    const contentContainer = document.getElementById('blog-post-content');
    const slug = getSlugFromURL();

    if (!slug) {
        contentContainer.innerHTML = `
            <div class="error-message">
                <h2>Post Not Found</h2>
                <p>No blog post specified.</p>
                <a href="blog.html" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
        return;
    }

    try {
        // Fetch the markdown file
        const response = await fetch(`../posts/${slug}.md`);

        if (!response.ok) {
            throw new Error('Post not found');
        }

        const content = await response.text();
        const { frontmatter, body } = parseFrontmatter(content);

        // Update page title
        document.title = `${frontmatter.title || 'Blog Post'} | Rod Samra`;

        // Format date
        const date = new Date(frontmatter.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Convert markdown to HTML using marked.js
        const htmlContent = marked.parse(body);

        // Build the post HTML
        let postHTML = `
            <div class="blog-post-header">
                <h1 class="blog-post-title">${frontmatter.title || 'Untitled'}</h1>
                <div class="blog-post-meta">
                    <span>📅 ${formattedDate}</span>
                </div>
            </div>
        `;

        // Add thumbnail if available
        if (frontmatter.thumbnail) {
            postHTML += `
                <img src="${frontmatter.thumbnail}" alt="${frontmatter.title}" class="blog-post-thumbnail">
            `;
        }

        // Add the main content
        postHTML += `
            <div class="blog-post-body">
                ${htmlContent}
            </div>
        `;

        // Add LinkedIn CTA if URL is provided
        if (frontmatter.linkedin_url) {
            postHTML += `
                <div class="linkedin-cta">
                    <p style="margin-bottom: 15px;">Continue the conversation on LinkedIn</p>
                    <a href="${frontmatter.linkedin_url}" target="_blank">
                        <img src="../images/linkedin-icon.png" alt="LinkedIn" style="width: 24px; height: 24px;">
                        View on LinkedIn
                    </a>
                </div>
            `;
        }

        contentContainer.innerHTML = postHTML;

    } catch (error) {
        console.error('Error loading blog post:', error);
        contentContainer.innerHTML = `
            <div class="error-message">
                <h2>Post Not Found</h2>
                <p>Sorry, we couldn't find the blog post you're looking for.</p>
                <a href="blog.html" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
    }
}
