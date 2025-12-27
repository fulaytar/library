const books = [
  {
    title: '1984',
    year: 1949,
    details: { author: 'George Orwell', genre: 'Dystopian', pages: 328 },
  },
  {
    title: 'Animal Farm',
    year: 1945,
    details: { author: 'George Orwell', genre: 'Political satire', pages: 112 },
  },
  {
    title: 'Brave New World',
    year: 1932,
    details: { author: 'Aldous Huxley', genre: 'Science fiction', pages: 311 },
  },
  {
    title: 'Fahrenheit 451',
    year: 1953,
    details: { author: 'Ray Bradbury', genre: 'Dystopian', pages: 256 },
  },
  {
    title: 'The Hobbit',
    year: 1937,
    details: { author: 'J.R.R. Tolkien', genre: 'Fantasy', pages: 310 },
  },
  {
    title: 'The Lord of the Rings',
    year: 1954,
    details: { author: 'J.R.R. Tolkien', genre: 'Fantasy', pages: 1178 },
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    year: 1997,
    details: { author: 'J.K. Rowling', genre: 'Fantasy', pages: 223 },
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    year: 1998,
    details: { author: 'J.K. Rowling', genre: 'Fantasy', pages: 251 },
  },
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    year: 1999,
    details: { author: 'J.K. Rowling', genre: 'Fantasy', pages: 317 },
  },
  {
    title: 'Harry Potter and the Goblet of Fire',
    year: 2000,
    details: { author: 'J.K. Rowling', genre: 'Fantasy', pages: 636 },
  },
  {
    title: 'To Kill a Mockingbird',
    year: 1960,
    details: { author: 'Harper Lee', genre: 'Classic', pages: 281 },
  },
  {
    title: 'The Great Gatsby',
    year: 1925,
    details: { author: 'F. Scott Fitzgerald', genre: 'Classic', pages: 180 },
  },
  {
    title: 'Moby-Dick',
    year: 1851,
    details: { author: 'Herman Melville', genre: 'Adventure', pages: 635 },
  },
  {
    title: 'Pride and Prejudice',
    year: 1813,
    details: { author: 'Jane Austen', genre: 'Romance', pages: 279 },
  },
  {
    title: 'Jane Eyre',
    year: 1847,
    details: { author: 'Charlotte Brontë', genre: 'Romance', pages: 500 },
  },
  {
    title: 'The Catcher in the Rye',
    year: 1951,
    details: { author: 'J.D. Salinger', genre: 'Classic', pages: 214 },
  },
  {
    title: 'The Chronicles of Narnia',
    year: 1950,
    details: { author: 'C.S. Lewis', genre: 'Fantasy', pages: 767 },
  },
  {
    title: 'The Da Vinci Code',
    year: 2003,
    details: { author: 'Dan Brown', genre: 'Thriller', pages: 454 },
  },
  {
    title: 'Angels & Demons',
    year: 2000,
    details: { author: 'Dan Brown', genre: 'Thriller', pages: 616 },
  },
  {
    title: 'The Alchemist',
    year: 1988,
    details: { author: 'Paulo Coelho', genre: 'Philosophical', pages: 208 },
  },
  {
    title: 'Crime and Punishment',
    year: 1866,
    details: {
      author: 'Fyodor Dostoevsky',
      genre: 'Psychological',
      pages: 671,
    },
  },
  {
    title: 'The Brothers Karamazov',
    year: 1880,
    details: {
      author: 'Fyodor Dostoevsky',
      genre: 'Philosophical',
      pages: 824,
    },
  },
  {
    title: 'War and Peace',
    year: 1869,
    details: { author: 'Leo Tolstoy', genre: 'Historical', pages: 1225 },
  },
  {
    title: 'Anna Karenina',
    year: 1877,
    details: { author: 'Leo Tolstoy', genre: 'Classic', pages: 864 },
  },
  {
    title: 'The Little Prince',
    year: 1943,
    details: { author: 'Antoine de Saint-Exupéry', genre: 'Fable', pages: 96 },
  },
  {
    title: 'Dracula',
    year: 1897,
    details: { author: 'Bram Stoker', genre: 'Horror', pages: 418 },
  },
  {
    title: 'Frankenstein',
    year: 1818,
    details: { author: 'Mary Shelley', genre: 'Horror', pages: 280 },
  },
  {
    title: 'The Shining',
    year: 1977,
    details: { author: 'Stephen King', genre: 'Horror', pages: 447 },
  },
  {
    title: 'It',
    year: 1986,
    details: { author: 'Stephen King', genre: 'Horror', pages: 1138 },
  },
  {
    title: 'The Green Mile',
    year: 1996,
    details: { author: 'Stephen King', genre: 'Drama', pages: 400 },
  },
  {
    title: 'Dune',
    year: 1965,
    details: { author: 'Frank Herbert', genre: 'Science fiction', pages: 412 },
  },
  {
    title: 'Foundation',
    year: 1951,
    details: { author: 'Isaac Asimov', genre: 'Science fiction', pages: 255 },
  },
  {
    title: 'Neuromancer',
    year: 1984,
    details: { author: 'William Gibson', genre: 'Cyberpunk', pages: 271 },
  },
  {
    title: 'The Martian',
    year: 2011,
    details: { author: 'Andy Weir', genre: 'Science fiction', pages: 369 },
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    year: 1979,
    details: { author: 'Douglas Adams', genre: 'Comedy sci-fi', pages: 224 },
  },
  {
    title: 'Slaughterhouse-Five',
    year: 1969,
    details: { author: 'Kurt Vonnegut', genre: 'Science fiction', pages: 275 },
  },
  {
    title: 'The Old Man and the Sea',
    year: 1952,
    details: { author: 'Ernest Hemingway', genre: 'Classic', pages: 127 },
  },
  {
    title: 'For Whom the Bell Tolls',
    year: 1940,
    details: { author: 'Ernest Hemingway', genre: 'War novel', pages: 471 },
  },
  {
    title: 'The Picture of Dorian Gray',
    year: 1890,
    details: { author: 'Oscar Wilde', genre: 'Philosophical', pages: 254 },
  },
  {
    title: 'Les Misérables',
    year: 1862,
    details: { author: 'Victor Hugo', genre: 'Historical', pages: 1463 },
  },
  {
    title: 'The Count of Monte Cristo',
    year: 1844,
    details: { author: 'Alexandre Dumas', genre: 'Adventure', pages: 1276 },
  },
  {
    title: 'Don Quixote',
    year: 1605,
    details: { author: 'Miguel de Cervantes', genre: 'Adventure', pages: 863 },
  },
  {
    title: 'The Kite Runner',
    year: 2003,
    details: { author: 'Khaled Hosseini', genre: 'Drama', pages: 371 },
  },
  {
    title: 'Life of Pi',
    year: 2001,
    details: { author: 'Yann Martel', genre: 'Adventure', pages: 319 },
  },
  {
    title: 'The Road',
    year: 2006,
    details: {
      author: 'Cormac McCarthy',
      genre: 'Post-apocalyptic',
      pages: 287,
    },
  },
  {
    title: 'The Girl with the Dragon Tattoo',
    year: 2005,
    details: { author: 'Stieg Larsson', genre: 'Crime', pages: 465 },
  },
  {
    title: 'Shantaram',
    year: 2003,
    details: {
      author: 'Gregory David Roberts',
      genre: 'Adventure',
      pages: 936,
    },
  },
];
