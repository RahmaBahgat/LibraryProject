document.addEventListener("DOMContentLoaded", function () {
  const isAdminPage = window.location.pathname.includes("HomePage-admin.html");
  const container = document.getElementById("book-carousels-container");
  
  // Load saved books from localStorage
  const savedBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];

  const userCategories = [
    {
      title: "Suggested For You",
      subtitle: "Inspired by the stories you've loved.",
      items: [
        { type: "book", id: "8" },
        { type: "book", id: "11" },
        { type: "book", id: "14" },
        { type: "book", id: "18" },
        { type: "book", id: "3" },
        { type: "book", id: "19" },
        { type: "book", id: "13" },
        { type: "book", id: "17" },
        { type: "book", id: "20" }
      ]
    },
    {
      title: "Top Picks This Week",
      subtitle: "What everyone's reading — and loving.",
      items: [
        { type: "book", id: "5" },
        { type: "book", id: "8" },
        { type: "book", id: "18" },
        { type: "book", id: "22" }
      ]
    },
    {
      title: "New Arrivals",
      subtitle: "The Latest Additions to Your Journey",
      items: [
        // Add saved books first (newest first)
        ...savedBooks.map(book => ({ 
          type: "book", 
          id: book.id,
          customBook: book 
        })),
        // Then static books
        { type: "book", id: "6" },
        { type: "book", id: "14" },
        { type: "book", id: "8" },
        { type: "book", id: "7" },
        { type: "book", id: "2" },
        { type: "book", id: "10" }
      ]
    },
    {
      title: "Can't Put Down Reads",
      subtitle: "Once you start, there's no escape.",
      items: [
        { type: "book", id: "2" },
        { type: "book", id: "4" },
        { type: "book", id: "10" },
        { type: "book", id: "20" },
        { type: "book", id: "13" },
        { type: "book", id: "15" },
        { type: "book", id: "17" }
      ]
    },
    {
      title: "Coming Soon",
      subtitle: "Almost here — worth the wait",
      items: [
        { type: "book", id: "23" },
        { type: "book", id: "24" },
        { type: "book", id: "25" }
      ]
    }
  ];

  const adminCategories = [
    {
      title: "New Arrivals",
      subtitle: "The Latest Additions to Your Journey",
      items: [
        // Add saved books first (newest first)
        ...savedBooks.map(book => ({ 
          type: "book", 
          id: book.id,
          customBook: book 
        })),
        // Then static books
        { type: "book", id: "6" },
        { type: "book", id: "14" },
        { type: "book", id: "8" },
        { type: "book", id: "7" },
        { type: "book", id: "2" },
        { type: "book", id: "10" }
      ],
      editable: true
    },
    {
      title: "Most Borrowed This Month",
      subtitle: "Treasures in High Demand",
      items: [
        { type: "book", id: "20" },
        { type: "book", id: "5" },
        { type: "book", id: "12" },
        { type: "book", id: "22" }
      ],
      editable: true
    },
    {
      title: "Books Needing Review",
      subtitle: "Waiting for Your Thoughts",
      items: [
        { type: "book", id: "18" },
        { type: "book", id: "17" },
        { type: "book", id: "4" },
        { type: "book", id: "13" }
      ],
      editable: true
    }
  ];

  generateCarousels(
    isAdminPage ? "admin" : "user",
    isAdminPage ? adminCategories : userCategories
  );
});

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
                    <a href="bookPage.html?id=${seriesBook.id}" class="book-link">
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
              <a href="bookPage.html?id=${book.id}" class="card-link">
                <div class="book-cover-container">
                  <img src="${book.cover}" alt="${book.title}">
                  ${book.badge ? `<span class="book-badge badge-${book.badge}">${formatBadgeText(book.badge)}</span>` : ''}
                </div>
              </a>
            </div>
            <a href="Author page.html?name=${encodeURIComponent(book.author)}" class="book-info">${book.author}</a>
          </div>
        `;
      }
    }).join("");

    const adminControls = pageType === "admin" && category.editable ? `
      <div class="admin-controls">
        <button class="add-btn" onclick="window.location.href='book page admin.html'">
          <i class="fas fa-plus"></i> Add Book
        </button>
        <button class="edit-btn" onclick="window.location.href='book page admin.html'">
          <i class="fas fa-cog"></i> Edit
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