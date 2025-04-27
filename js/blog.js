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



document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active-link');
    }
  });
});

// Create a blog post article element
function createArticle(data) {
  const article = document.createElement("article");
  article.classList.add("fade-in"); // 👈 add the class for animation

  article.innerHTML = `
  <a href="${data.url}">
    <img class="blog-cam" src="${data.img}" alt="">
    <div>
      <h2>${data.title}</h2>
      <p>${data.text}</p>
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
const reversedArticles = [...blogData].reverse();

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

  if (scrollY + visible >= fullHeight - 300 && articleCount < reversedArticles.length) {
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




// Dark Mode Toggle and LocalStorage Save

// Dark Mode Toggle and LocalStorage Save



document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-label');

  // On load, apply saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
    label.textContent = 'Dark';
  }

  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      label.textContent = 'Dark';
    } else {
      localStorage.setItem('theme', 'light');
      label.textContent = 'Light';
    }
  });
});
