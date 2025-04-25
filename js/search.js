
document.addEventListener('DOMContentLoaded', bookSearch);
console.log('js file open')
function bookSearch() {
  console.log('now i am in search file')
  const searchContent = document.getElementById('searchBar');
  const bookCards = document.getElementById('data-book');
  const result = document.getElementById('result');
  const bookCarouselsContainer = document.getElementById('book-carousels-container');


  function book_search() {
      let books = [];      // store book Data

    searchContent.addEventListener('input', () => {
    const searchValue = searchContent.value.toLowerCase();

    bookData.forEach(book => {
      const match = book.title.includes(searchValue)
        || book.author.includes(searchValue)
        || (book.category || '').includes(searchValue);
      // book.element.style.display = match ? 'block' : 'none';
      if (match) {
        books.push(book);
      }
    });
    });


    
    
  }



}




// this is work

// document.addEventListener('DOMContentLoaded', bookSearch);

// function bookSearch() {
//   console.log('Initializing enhanced search functionality');
  
//   const searchInput = document.getElementById('searchBar');
//   const bookCards = document.getElementById('data-book');
//   const resultsContainer = document.getElementById('results');
//   const bookCarouselsContainer = document.getElementById('book-carousels-container');
  
//   // Parse book data
//   const allBooks = JSON.parse(bookCards.getAttribute('data-books'));
//   console.log('All books loaded:', allBooks);
  
//   // Store original carousels HTML to restore when search is cleared
//   let originalCarouselsHTML = bookCarouselsContainer.innerHTML;
  
//   searchInput.addEventListener('input', function() {
//     const searchValue = this.value.toLowerCase().trim();
//     console.log('Searching for:', searchValue);
    
//     if (searchValue === '') {
//       // Restore original carousels when search is empty
//       bookCarouselsContainer.innerHTML = originalCarouselsHTML;
//       resultsContainer.innerHTML = '';
//       initializeCarousels(); // Reinitialize carousel functionality
//       return;
//     }
    
//     // Filter books that match the search term
//     const matchingBooks = allBooks.filter(book =>
//       book.title.toLowerCase().includes(searchValue) ||
//       book.author.toLowerCase().includes(searchValue) ||
//       (book.category && book.category.toString().toLowerCase().includes(searchValue))
//     );
    
//     displaySearchResults(matchingBooks);
//   });
  
//   function displaySearchResults(matchingBooks) {
//     if (matchingBooks.length === 0) {
//       resultsContainer.innerHTML = '<p class="no-results">No books found matching your search.</p>';
//       bookCarouselsContainer.innerHTML = '';
//       return;
//     }
    
//     // Create a single search results carousel
//     resultsContainer.innerHTML = `
//       <div class="search-results-header">
//         <h3>Found ${matchingBooks.length} ${matchingBooks.length === 1 ? 'book' : 'books'}</h3>
//       </div>
//     `;
    
//     // Generate HTML for matching books
//     const booksHTML = matchingBooks.map(book => `
//       <div class="carousel-item" data-book-id="${book.id}">
//         <div class="static-card">
//           <a href="./Booksdetails/book.html?id=${book.id}" class="card-link">
//             <img src="${book.cover}" alt="${book.title}">
//           </a>
//         </div>
//         <a href="Author page.html?name=${encodeURIComponent(book.author)}" class="book-info">
//           ${book.author}
//         </a>
//       </div>
//     `).join('');
    
//     // Replace carousels with search results
//     bookCarouselsContainer.innerHTML = `
//       <div class="section-wrapper">
//         <div class="book-carousel search-results-carousel">
//           <button class="carousel-nav prev" aria-label="Previous">
//             <i class="fas fa-chevron-left"></i>
//           </button>
//           <div class="carousel-track">${booksHTML}</div>
//           <button class="carousel-nav next" aria-label="Next">
//             <i class="fas fa-chevron-right"></i>
//           </button>
//         </div>
//       </div>
//     `;
    
//     // Initialize carousel functionality for search results
//     initializeCarousels();
//   }
// }



document.addEventListener('DOMContentLoaded', bookSearch);

function bookSearch() {
  console.log('Initializing enhanced search functionality');
  
  const searchInput = document.getElementById('searchBar');
  const bookCards = document.getElementById('data-book');
  const resultsContainer = document.getElementById('results');
  const bookCarouselsContainer = document.getElementById('book-carousels-container');
  
  // Parse book data
  const allBooks = JSON.parse(bookCards.getAttribute('data-books'));
  console.log('All books loaded:', allBooks);
  
  // Store original carousels HTML to restore when search is cleared
  let originalCarouselsHTML = bookCarouselsContainer.innerHTML;
  
  searchInput.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase().trim();
    console.log('Searching for:', searchValue);
    
    if (searchValue === '') {
      // Restore original carousels when search is empty
      bookCarouselsContainer.innerHTML = originalCarouselsHTML;
      resultsContainer.innerHTML = '';
      initializeCarousels(); // Reinitialize carousel functionality
      console.log('Search cleared - showing all books');
      return;
    }
    
    // Filter books that match the search term
    const matchingBooks = allBooks.filter(book => {
      const matches = book.title.toLowerCase().includes(searchValue) ||
                     book.author.toLowerCase().includes(searchValue) ||
                     (book.category && book.category.toString().toLowerCase().includes(searchValue));
      return matches;
    });
    
    // Log matched books to console
    console.log('Matched books:', matchingBooks);
    
    displaySearchResults(matchingBooks);
  });
  
  function displaySearchResults(matchingBooks) {
    if (matchingBooks.length === 0) {
      resultsContainer.innerHTML = '<p class="no-results">No books found matching your search.</p>';
      bookCarouselsContainer.innerHTML = '';
      return;
    }
    
    // Create a single search results carousel
    resultsContainer.innerHTML = `
      <div class="search-results-header">
        <h3>Found ${matchingBooks.length} ${matchingBooks.length === 1 ? 'book' : 'books'}</h3>
      </div>
    `;
    
    // Generate HTML for matching books
    const booksHTML = matchingBooks.map(book => `
      <div class="carousel-item" data-book-id="${book.id}">
        <div class="static-card">
          <a href="./Booksdetails/book.html?id=${book.id}" class="card-link">
            <img src="${book.cover}" alt="${book.title}">
          </a>
        </div>
        <a href="Author page.html?name=${encodeURIComponent(book.author)}" class="book-info">
          ${book.author}
        </a>
      </div>
    `).join('');
    
    // Replace carousels with search results
    bookCarouselsContainer.innerHTML = `
      <div class="section-wrapper">
        <div class="book-carousel search-results-carousel">
          <button class="carousel-nav prev" aria-label="Previous">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="carousel-track">${booksHTML}</div>
          <button class="carousel-nav next" aria-label="Next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;
    
    // Initialize carousel functionality for search results
    initializeCarousels();
  }
}


