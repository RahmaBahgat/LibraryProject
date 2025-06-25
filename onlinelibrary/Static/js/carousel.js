document.addEventListener("DOMContentLoaded", function () {
  const isAdminPage = window.location.pathname.includes("library-admin");
  const container = document.getElementById("book-carousels-container");
  
  // Fetch books from Django backend
  fetch('/library-admin/books/api/list/')
    .then(response => response.json())
    .then(data => {
      const books = data.books;
      generateCarousels(isAdminPage ? "admin" : "user", getCategories(books, isAdminPage));
    })
    .catch(error => {
      console.error('Error fetching books:', error);
      // Fallback to static data if fetch fails
      generateCarousels(isAdminPage ? "admin" : "user", getDefaultCategories(isAdminPage));
    });
});

function getCategories(books, isAdmin) {
  return [
    {
      title: "New Arrivals",
      subtitle: "The Latest Additions to Your Journey",
      items: books.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10).map(book => ({
        type: "book",
        id: book.id,
        customBook: {
          id: book.id,
          title: book.title,
          cover: book.image || "/static/images/default-cover.jpg",
          badge: getBookBadge(book)
        }
      })),
      editable: isAdmin
    },
    {
      title: "Most Borrowed This Month",
      subtitle: "Treasures in High Demand",
      items: books.filter(book => book.stock < 5).map(book => ({
        type: "book",
        id: book.id,
        customBook: {
          id: book.id,
          title: book.title,
          cover: book.image || "/static/images/default-cover.jpg",
          badge: "trending"
        }
      })),
      editable: isAdmin
    },
    {
      title: "Coming Soon",
      subtitle: "Get Ready for These Upcoming Reads",
      items: books
        .filter(book => getBookBadge(book) === "coming-soon")
        .map(book => ({
          type: "book",
          id: book.id,
          customBook: {
            id: book.id,
            title: book.title,
            cover: book.image || "/static/images/default-cover.jpg",
            badge: "coming-soon"
          }
        })),
      editable: isAdmin
    },
    {
      title: "Books Needing Review",
      subtitle: "Waiting for Your Thoughts",
      items: books.slice(0, 4).map(book => ({
        type: "book",
        id: book.id,
        customBook: {
          id: book.id,
          title: book.title,
          cover: book.image || "/static/images/default-cover.jpg"
        }
      })),
      editable: isAdmin
    }
  ];
}


function getBookBadge(book) {
  const daysSinceCreation = (new Date() - new Date(book.created_at)) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation <= 7) return "new-release";
  if (book.stock < 3) return "trending";
  return null;
}

function getIconClass(title) {
  const iconMap = {
    "Suggested For You": "fa-heart",
    "Popular Reads": "fa-fire",
    "Top Picks This Week": "fa-fire",
    "Can't Put Down Reads": "fa-eye",
    "Coming Soon": "fa-hourglass-half"
  };
  return `<i class="fas ${iconMap[title] || 'fa-book-open'}"></i>`;
}

function generateCarousels(pageType, categories) {
  const container = document.getElementById("book-carousels-container");
  container.className = `${pageType}-carousel`;
  container.innerHTML = "";

  categories.forEach((category) => {
    const itemsHTML = category.items.map((item) => {
      const book = item.customBook || books?.find((b) => b.id === item.id);
      if (!book) return "";

      if (item.type === "series") {
        const series = bookSeries?.[item.id];
        if (!series) return "";

        return `
          <div class="carousel-item series-item">
            <div class="card">
              ${series.books.map((seriesBook) => `
                <p>
                  <span>
                    <a href="/library-admin/books/book/${seriesBook.id}/" class="book-link">
                      <img class="spine" src="${seriesBook.spine}" alt="${seriesBook.title} Spine">
                      <img class="cover" src="${seriesBook.cover}" alt="${seriesBook.title} Cover">
                      ${seriesBook.badge ? `<span class="book-badge badge-${seriesBook.badge}">${formatBadgeText(seriesBook.badge)}</span>` : ''}
                    </a>
                  </span>
                </p>
              `).join("")}
            </div>
            <a href="${series.authorLink}" class="book-info">${series.author}</a>
          </div>
        `;
      } else {
        return `
          <div class="carousel-item">
            <div class="static-card">
              <a href="/library-admin/books/book/${book.id}/" class="card-link">
                <div class="book-cover-container">
                  <img src="${book.cover}" alt="${book.title}">
                  ${book.badge ? `<span class="book-badge badge-${book.badge}">${formatBadgeText(book.badge)}</span>` : ''}
                </div>
              </a>
            </div>
            <a href="/library-admin/books/book/${book.id}/" class="book-info">${book.title}</a>
          </div>
        `;
      }
    }).join("");

    const adminControls = pageType === "admin" && category.editable ? `
      <div class="admin-controls">
        <button onclick="location.href='/library-admin/books/add/'">
          <i class="fas fa-plus"></i> Add Book
        </button>
      </div>
    ` : "";

    const sectionHTML = `
      <div class="section-wrapper">
        <div class="section-header">
          <h2>
            ${getIconClass(category.title)} ${category.title}
            ${pageType === "admin" ? '<span class="edit-icon"><i class="fas fa-edit"></i></span>' : ''}
          </h2>
          ${category.subtitle ? `<p class="section-subtitle">${category.subtitle}</p>` : ''}
        </div>
        <div class="book-carousel">
          <button class="carousel-nav prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
          <div class="carousel-track">${itemsHTML}</div>
          <button class="carousel-nav next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
        </div>
        ${adminControls}
      </div>
    `;

    container.insertAdjacentHTML("beforeend", sectionHTML);
  });

  initializeCarousels();

  if (pageType === "admin") {
    document.querySelectorAll(".edit-icon").forEach((icon) => {
      icon.addEventListener("click", handleEditCategory);
    });
  }
}

function initializeCarousels() {
  document.querySelectorAll(".book-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");
    const items = Array.from(track.querySelectorAll(".carousel-item"));

    if (items.length === 0) return;

    const itemStyle = window.getComputedStyle(items[0]);
    const itemMarginRight = parseInt(itemStyle.marginRight);
    const itemWidth = items[0].offsetWidth + itemMarginRight;

    let isAnimating = false;
    let targetPosition = 0;
    let currentPosition = 0;
    let maxPosition = track.scrollWidth - carousel.offsetWidth + itemMarginRight;

    function animateScroll() {
      if (Math.abs(currentPosition - targetPosition) < 1) {
        currentPosition = targetPosition;
        isAnimating = false;
        updateButtons();
        return;
      }

      currentPosition += (targetPosition - currentPosition) * 0.2;
      track.style.transform = `translateX(-${currentPosition}px)`;
      requestAnimationFrame(animateScroll);
    }

    function scrollTo(position) {
      targetPosition = Math.max(0, Math.min(position, maxPosition));
      if (!isAnimating) {
        isAnimating = true;
        animateScroll();
      }
      updateButtons();
    }

    nextBtn.addEventListener("click", () => {
      scrollTo(targetPosition + Math.min(carousel.offsetWidth * 0.8, maxPosition - targetPosition));
    });

    prevBtn.addEventListener("click", () => {
      scrollTo(targetPosition - Math.min(carousel.offsetWidth * 0.8, targetPosition));
    });

    function updateButtons() {
      prevBtn.disabled = targetPosition <= 0;
      nextBtn.disabled = targetPosition >= maxPosition;
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        maxPosition = track.scrollWidth - carousel.offsetWidth + itemMarginRight;
        scrollTo(Math.min(targetPosition, maxPosition));
      }, 100);
    });

    // Touch support
    let startX = 0;
    let isTouching = false;

    track.addEventListener("touchstart", (e) => {
      isTouching = true;
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
      if (!isTouching) return;
      const dx = startX - e.touches[0].clientX;
      scrollTo(targetPosition + dx);
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", () => {
      isTouching = false;
    });

    updateButtons();
  });

  // Handle delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const bookId = this.dataset.bookId;
      if (confirm('Are you sure you want to delete this book?')) {
        window.location.href = `/library-admin/books/delete/${bookId}/`;
      }
    });
  });
}

function handleEditCategory() {
  alert("Edit category clicked!");
}

function formatBadgeText(badgeType) {
  const badgeTexts = {
    'bestselling': 'Bestseller',
    'new-release': 'New',
    'coming-soon': 'Coming Soon',
    'classic': 'Classic',
    'favorite': 'Favorite',
    'staff-pick': 'Staff Pick',
    'trending': 'Trending'
  };
  return badgeTexts[badgeType] || badgeType;
}