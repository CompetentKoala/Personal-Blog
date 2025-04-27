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
    displayRecentPosts();
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
  article.classList.add("fade-in");

  article.innerHTML = `
    <a href="${data.link}" target="_blank" rel="noopener noreferrer" class="blog-link">
      <div class="blog-wrapper">
        <img src="${data.img}" alt="" class="blog-img">
        <div class="blog-content">
          <h2>${data.title}</h2>
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
  const maxArticles = 4;
  const limit = 4;

  // Don't load more if we've reached the limit
  if (articleCount >= maxArticles) return;

  const remaining = maxArticles - articleCount;
  const nextBatch = reversedArticles.slice(
    articleCount,
    articleCount + Math.min(limit, remaining)
  );

  setTimeout(() => {
    nextBatch.forEach((articleData) => {
      const newArticle = createArticle(articleData);
      blogPostsContainer.appendChild(newArticle);
    });

    articleCount += nextBatch.length;
    isLoading = false;
  }, 300);

  // Optional: stop future loading if max is reached
  setTimeout(() => {
    const scrollY = window.scrollY;
    const visible = window.innerHeight;
    const fullHeight = document.body.offsetHeight;

    if (scrollY + visible >= fullHeight - 300 && articleCount < maxArticles) {
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

//display recent posts
function displayRecentPosts() {
  const recentPostsContainer = document.getElementById("recent-posts");

  const recentPosts = [...blogData].slice(-4).reverse(); // last 4

  recentPosts.forEach((post, index) => {
    const articleEl = createArticleElement(post, index);
    recentPostsContainer.appendChild(articleEl);
  });
}

//share links
// Encode the current page URL
const currentURL = encodeURIComponent(window.location.href);

document.getElementById(
  "facebook-share"
).href = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;

document.getElementById(
  "twitter-share"
).href = `https://twitter.com/intent/tweet?url=${currentURL}&text=Check%20this%20out!`;

//for recent blogs
function createArticleElement(post, index) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("article-wrapper");

  if (index === 3) {
    wrapper.classList.add("fade-bottom-mask");
  }

  const article = document.createElement("article-blog");
  article.innerHTML = `
    <img class="blog-cam" src="${post.img}" alt="">
    <div class="blog-post">
      <h2>${post.title}</h2>
      <p>${post.text}</p>
    </div>
  `;

  wrapper.appendChild(article);
  return wrapper;
}

//serach bar
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase().trim();
  searchResults.innerHTML = "";

  if (term.length === 0) return;

  const matches = blogData.filter(
    (post) =>
      post.title.toLowerCase().includes(term) ||
      (post.text && post.text.toLowerCase().includes(term))
  );

  if (matches.length > 0) {
    const heading = document.createElement("h3");
    heading.textContent = "Blog Posts";
    searchResults.appendChild(heading);

    matches.slice(0, 5).forEach((post) => {
      const wrapper = document.createElement("div");
      wrapper.className = "search-item";

      wrapper.innerHTML = `
        <a href="${post.link}">
          <div class="search-title">${post.title}</div>
          <div class="search-desc">${post.text?.substring(0, 90) || ""}...</div>
        </a>
      `;

      searchResults.appendChild(wrapper);
    });
  } else {
    searchResults.innerHTML = "<p>No results found.</p>";
  }
});

// Dark Mode Toggle and LocalStorage Save
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const label = document.getElementById("theme-label");

  // On load, apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
    label.textContent = "Dark";
  }

  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      label.textContent = "Dark";
    } else {
      localStorage.setItem("theme", "light");
      label.textContent = "Light";
    }
  });
});
