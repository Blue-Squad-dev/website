var basePath = '/themes/chocolate/static';
var config = {
    instances: [
        {
            cssDest: basePath + '/css',
            jsDest: basePath + '/js',
            cssFiles: [
				basePath + "/css/layout.css",
				basePath + "/css/header.css",
				basePath + "/css/footer.css",
				basePath + "/css/cta.css",
				basePath + "/css/hero.css",
				basePath + "/css/home.css",
				basePath + "/css/subpage.css",
				basePath + "/css/blog-post-listing.css",
				basePath + "/css/blog-posts.css",
				basePath + "/css/blog-post-single.css"
            ],
            libJsFiles: [
                basePath + '/js/material.min.js'
            ],
            jsFiles: [
                basePath + '/js/menu.js',
                basePath + '/js/tabbed.js',
                basePath + '/js/skip-to-content.js'
            ],
            cssFilesExclude: [
                basePath + '/css/app.*.css'
            ],
            jsFilesExclude: [
                basePath + '/js/app.*.js'
            ],
        }
    ]
}
module.exports = config;
