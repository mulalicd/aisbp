import React from 'react';

/**
 * A lightweight Markdown renderer for the AISBS project.
 * Handles:
 * - Headings (###)
 * - Bold (**text**)
 * - Bullet points (- or *)
 * - Line breaks
 */
const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    // If content is already an object/array, stringify it or handle it
    if (typeof content !== 'string') {
        return <pre>{JSON.stringify(content, null, 2)}</pre>;
    }

    const parseMarkdown = (text) => {
        // Escape HTML tags to prevent XSS (minimal)
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Headings (### Heading)
        html = html.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');

        // Bold (**text**)
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

        // Bullet points (- text)
        // First, handle simple bullet points at start of lines
        html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="md-li">$1</li>');

        // Wrap groups of <li> in <ul>
        // This is a bit tricky with simple regex, but we can do a newline-based wrap
        // For now, let's just make them look like list items

        // Newlines to <br> or <p>
        // We split by double newlines for paragraphs
        const paragraphs = html.split(/\n\n+/);
        html = paragraphs
            .map(p => {
                if (p.startsWith('<h') || p.startsWith('<li')) return p;
                return `<p class="md-p">${p.replace(/\n/g, '<br />')}</p>`;
            })
            .join('\n');

        return html;
    };

    return (
        <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
        />
    );
};

export default MarkdownRenderer;
