
function getBookIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
  }
  
  // Function to find book by ID
  function findBookById(bookId) {
    return books.find(book => book.id === bookId);
  }
  

  function updateBookPage(book) {
    
    document.querySelector('.book-title').textContent = book.title;
    document.querySelector('.book-author').textContent = book.author;
    document.querySelector('.book-category').textContent = book.category.join(', ');
    document.querySelector('.p-description').textContent = book.description;
    
    
    const imgContainer = document.querySelector('.img-container img');
    imgContainer.src = book.cover;
    imgContainer.alt = `${book.title} cover`;
    
    
    const available = book.status !== 'Want to Read'; 
    document.querySelector('.fa-xmark').style.display = available ? 'none' : 'inline-block';
    document.querySelector('.fa-check').style.display = available ? 'inline-block' : 'none';
    document.querySelector('.avl').textContent = available ? 'Available' : 'Not Available';
  }
  
 
  function loadBookData() {
    const bookId = getBookIdFromUrl();
    if (!bookId) {
      console.error('No book ID found in URL');
      return;
    }
    
    const book = findBookById(bookId);
    if (!book) {
      console.error('Book not found with ID:', bookId);
      return;
    }
    
    updateBookPage(book);
  }
  

  document.addEventListener('DOMContentLoaded', loadBookData);