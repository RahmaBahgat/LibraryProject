document.addEventListener('DOMContentLoaded', bookSearch);
function bookSearch(){
  const searchContent = document.getElementById('searchBar');
  const bookCards = document.querySelectorAll('.standalone-card');

  const bookData = [];      // store book Data

  function collectBookData() {
    document.querySelectorAll('.standalone-card').forEach(card => {
      const img = card.querySelector('img');
      const author = card.querySelector('.book-info');
      const title = card.dataset.title;

      if (img && author) {
        bookData.push({
          title: (title || '').toLowerCase(),
          author: author.textContent.trim().toLowerCase(),     // with out unneeded spaces
          category: (card.dataset.category || '').toLowerCase(),       // dataset in div
          element: card
        })
      }
    })

    collectBookData();
    searchContent.addEventListener('input', () => {
    const searchValue = searchContent.value.toLowerCase();

    bookData.forEach(book => {
      const match = book.title.includes(searchValue)
        || book.author.includes(searchValue)
        || (book.category || '').includes(searchValue);
      book.element.style.display = match ? 'block' : 'none';
    });
     });
    
    
  }

  collectBookData();
  console.log(bookData);
    console.log('Book Data:', bookData);

  searchContent.addEventListener('input', () => {
    const searchValue = searchContent.value.toLowerCase();
    console.log('Search:', searchValue);

    bookData.forEach(book => {
      console.log('Matching:', book.title, book.author, book.category);
    });
});


}


console.log('js file open')

