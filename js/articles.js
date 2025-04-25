// Global state
let articleCount = 0;
const blogPostsContainer = document.querySelector(".blog-posts");

// Fade-in effect on page load
window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  container.style.visibility = "visible";
  container.style.opacity = "0";
  void container.offsetWidth;

  requestAnimationFrame(() => {
    container.classList.add("fade-in");
    container.style.opacity = null;

    //load first batch
    loadMoreArticles();
  });
});

// Page fade-out on link click
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const container = document.querySelector(".container");
    const targetHref = link.getAttribute("href");

    setTimeout(() => {
      container.classList.remove("fade-in");
      container.classList.add("fade-out");
    }, 400);

    container.addEventListener(
      "transitionend",
      (e) => {
        if (e.propertyName === "opacity") {
          window.location.href = targetHref;
        }
      },
      { once: true }
    );
  });
});

// Create a blog post article element
function createArticle(data) {
  const article = document.createElement("article");
  article.classList.add("fade-in"); // 👈 add the class for animation

  article.innerHTML = `
  <a href="${data.link}" target="_blank" rel="noopener noreferrer" style="
  text-decoration: none;
  color: inherit;
  display: block;           /* 👈 this fixes the shift */
  width: 100%;
  height: 100%;
">
  <div style="
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  ">
    <img src="${data.img}" alt="" style="
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(3px) brightness(.5); /* 👈 Blur and darken */
      z-index: 0;
    ">
    <div style="
      position: relative;
      z-index: 1;
      color: white;
      font-weight: bold;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 1rem;
    ">
      <h2 style="margin: 0;">${data.title}</h2>
    </div>
  </div>
  </a>
`;

  article.addEventListener("animationend", () => {
    article.classList.remove("fade-in");
  });
  return article;
}

// Load more blog articles from articlesData
// Reverse once, globally (so you're not reversing on every call)
const reversedArticles = [...articlesData].reverse();

function loadMoreArticles() {
  const limit = 4;
  const nextBatch = reversedArticles.slice(articleCount, articleCount + limit);

  setTimeout(() => {
    nextBatch.forEach((articleData) => {
      const newArticle = createArticle(articleData);
      blogPostsContainer.appendChild(newArticle);
    });

    articleCount += nextBatch.length;
    isLoading = false;
  }, 300);

  // Re-check height after batch loads
  setTimeout(() => {
    const scrollY = window.scrollY;
    const visible = window.innerHeight;
    const fullHeight = document.body.offsetHeight;

    if (
      scrollY + visible >= fullHeight - 300 &&
      articleCount < reversedArticles.length
    ) {
      loadMoreArticles();
    }
  }, 300);
}

// Lazy load articles on scroll
let isLoading = false;
window.addEventListener("scroll", () => {
  if (isLoading) return;

  const scrollY = window.scrollY;
  const visible = window.innerHeight;
  const fullHeight = document.body.offsetHeight;

  if (scrollY + visible >= fullHeight - 300) {
    isLoading = true;
    loadMoreArticles(); // now has its own internal delay
  }
});
