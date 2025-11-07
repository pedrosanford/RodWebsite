// Data Manager - Handles read/write operations for JSON data
// This is a client-side implementation for demo purposes
// In production, replace with actual backend API calls

class DataManager {
    constructor() {
        this.articlesKey = 'articles';
        this.siteContentKey = 'siteContent';
    }

    // Articles methods
    async getArticles() {
        try {
            // Try to load from server first
            const response = await fetch('/src/data/articles.json');
            const serverData = await response.json();

            // Check if localStorage has newer data
            const localData = localStorage.getItem(this.articlesKey);
            if (localData) {
                return JSON.parse(localData);
            }

            return serverData;
        } catch (error) {
            // Fallback to localStorage
            const localData = localStorage.getItem(this.articlesKey);
            return localData ? JSON.parse(localData) : [];
        }
    }

    async saveArticles(articles) {
        // Save to localStorage (client-side demo)
        localStorage.setItem(this.articlesKey, JSON.stringify(articles));

        // In production, this would be an API call:
        // await fetch('/api/articles', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(articles)
        // });

        return true;
    }

    async getArticle(id) {
        const articles = await this.getArticles();
        return articles.find(article => article.id === id);
    }

    async addArticle(article) {
        const articles = await this.getArticles();
        article.id = Date.now().toString(); // Simple ID generation
        articles.push(article);
        await this.saveArticles(articles);
        return article;
    }

    async updateArticle(id, updatedArticle) {
        const articles = await this.getArticles();
        const index = articles.findIndex(article => article.id === id);
        if (index !== -1) {
            articles[index] = { ...articles[index], ...updatedArticle };
            await this.saveArticles(articles);
            return articles[index];
        }
        return null;
    }

    async deleteArticle(id) {
        const articles = await this.getArticles();
        const filtered = articles.filter(article => article.id !== id);
        await this.saveArticles(filtered);
        return true;
    }

    // Site content methods
    async getSiteContent() {
        try {
            // Try to load from server first
            const response = await fetch('/src/data/siteContent.json');
            const serverData = await response.json();

            // Check if localStorage has newer data
            const localData = localStorage.getItem(this.siteContentKey);
            if (localData) {
                return JSON.parse(localData);
            }

            return serverData;
        } catch (error) {
            // Fallback to localStorage
            const localData = localStorage.getItem(this.siteContentKey);
            return localData ? JSON.parse(localData) : { aboutBio: '' };
        }
    }

    async saveSiteContent(content) {
        // Save to localStorage (client-side demo)
        localStorage.setItem(this.siteContentKey, JSON.stringify(content));

        // In production, this would be an API call:
        // await fetch('/api/site-content', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(content)
        // });

        return true;
    }

    async updateAboutBio(bio) {
        const content = await this.getSiteContent();
        content.aboutBio = bio;
        await this.saveSiteContent(content);
        return content;
    }

    // Utility methods
    clearLocalData() {
        localStorage.removeItem(this.articlesKey);
        localStorage.removeItem(this.siteContentKey);
    }

    async exportData() {
        const articles = await this.getArticles();
        const siteContent = await this.getSiteContent();

        return {
            articles,
            siteContent,
            exportDate: new Date().toISOString()
        };
    }

    async importData(data) {
        if (data.articles) {
            await this.saveArticles(data.articles);
        }
        if (data.siteContent) {
            await this.saveSiteContent(data.siteContent);
        }
        return true;
    }
}

// Export singleton instance
const dataManager = new DataManager();

// For use in browser
if (typeof window !== 'undefined') {
    window.dataManager = dataManager;
}

// For use in Node.js (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
