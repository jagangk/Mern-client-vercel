
export function fetchSitemap() {
    return fetch('https://blogstera.site/sitemap.xml')
      .then(response => response.text())
      .then(data => {
        // Process your sitemap XML here
        return data;
      })
      .catch(error => {
        console.error('Error fetching sitemap:', error);
        return null; // or handle the error as needed
      });
  }
  