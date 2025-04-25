window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  container.style.visibility = "visible";
  container.style.opacity = "0";
  void container.offsetWidth;

  requestAnimationFrame(() => {
    container.classList.add("fade-in");
    container.style.opacity = null;
  });
});

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

function createArticleElement(post, index) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("article-wrapper");

    if (index === 3) {
      wrapper.classList.add("fade-bottom-mask");
    }

    const article = document.createElement("article");
    article.innerHTML = `
    <a href="${post.url}">
      <img class="blog-cam" src="${post.img}" alt="">
      <div class="blog-post">
        <h2>${post.title}</h2>
        <p>${post.text}</p>
      </div>
      </a>
    `;

    wrapper.appendChild(article);
    return wrapper;
  }


function displayRecentPosts() {
    const recentPostsContainer = document.getElementById("recent-posts");

    const recentPosts = [...blogData].slice(-4).reverse(); // last 4

    recentPosts.forEach((post, index) => {
        const articleEl = createArticleElement(post, index);
        recentPostsContainer.appendChild(articleEl);
      });

  }


window.addEventListener("DOMContentLoaded", () => {
  displayRecentPosts(); // Load 3 most recent on homepage
});
