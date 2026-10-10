const htmlmin = require("html-minifier-terser");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rssPlugin = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(rssPlugin.default || rssPlugin);

  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/security.txt");
  eleventyConfig.addPassthroughCopy("src/favicon-16.png");
  eleventyConfig.addPassthroughCopy("src/favicon-32.png");
  eleventyConfig.addPassthroughCopy("src/favicon-192.png");
  eleventyConfig.addPassthroughCopy("src/favicon-512.png");
  eleventyConfig.addPassthroughCopy("src/favicon.png");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  // sw.njk is processed as template (not passthrough) to inject build hash

  // Collections
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/*.md").sort((a, b) => {
      return a.data.order - b.data.order;
    });
  });

  eleventyConfig.addCollection("skills", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/ai-skills/**/*.md").sort((a, b) => {
      return a.data.order - b.data.order;
    });
  });

  // Filters
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) return new Date().toISOString();
    const d = new Date(dateObj);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  eleventyConfig.addFilter("dump_json", (obj) => {
    return JSON.stringify(obj, null, 2);
  });

  // Custom filter for skills JSON-LD
  eleventyConfig.addFilter("skillsJsonLd", (skills) => {
    const itemListElement = skills.map((skill, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TechArticle",
        "name": skill.data.title,
        "description": skill.data.description,
        "url": "https://staryi441.github.io" + skill.url
      }
    }));
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "AI Skills Hub",
      "description": "Систематизированный сборник практик, промпт-инжиниринга и интеграции локальных и облачных нейросетей.",
      "author": {
        "@type": "Person",
        "name": "Artem (staryi441)",
        "url": "https://github.com/staryi441"
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": itemListElement
      }
    }, null, 2);
  });

  // Group skills by category
  eleventyConfig.addFilter("groupByCategory", (skills) => {
    const categories = {};
    for (const skill of skills) {
      const cat = skill.data.category || "Другое";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(skill);
    }
    // Return as array of [name, skills] pairs for Nunjucks iteration
    return Object.entries(categories);
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true
      });
      return minified;
    }
    return content;
  });

  // Base config
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html", "liquid"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};