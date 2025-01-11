// Функция за Like/Dislike на ревю
function likeReview(link) {
    const likeCount = link.previousElementSibling;
    const likeNumber = likeCount.querySelector('.like-number');

    if (likeCount.style.display === "none") {
        likeCount.style.display = "inline-flex";
        likeNumber.textContent = 1;
        link.textContent = "Dislike";
    } else {
        likeCount.style.display = "none";
        link.textContent = "Like";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const addBookModal = document.getElementById("addBookModal");
    const bookCoverInput = document.getElementById("bookCoverInput");
    const coverPreview = document.getElementById("coverPreview");
    const bookTitleInput = document.getElementById("bookTitle");
    const bookAuthorInput = document.getElementById("bookAuthor");
    const modalAddButton = document.getElementById("modalAddButton");
    const discardButton = document.getElementById("discardButton");
    const currentlyReadingSection = document.getElementById("currently-reading");
    const addBookButton = document.getElementById("addButton"); // Бутонът "Add a New Book"

    // Показване на модалния прозорец
    addBookButton.addEventListener("click", () => {
        addBookModal.style.display = "block";
    });

    // Функция за зареждане на книгите от localStorage
    const loadBooks = () => {
        const books = JSON.parse(localStorage.getItem("currentlyReadingBooks")) || [];
        books.forEach((book) => {
            addBookToDOM(book);
        });
    };

    function addBookToDOM(book) {
        const bookList = document.getElementById("book-list");
        const noBooksMessage = document.getElementById("noBooksMessage");
    
        if (!bookList) {
            console.error("Cannot find 'book-list' section in DOM.");
            return;
        }
    
        // Създаване на нов елемент за книгата
        const bookItem = document.createElement("div");
        bookItem.classList.add("book");
    
        bookItem.innerHTML = `
            <img src="${book.cover}" alt="${book.title} Cover" class="book-cover">
            <div class="book-details">
                <p class="book-title">${book.title}</p>
                <p class="book-author">by ${book.author}</p>
            </div>
            <button class="delete-button">X</button>
        `;
    
        // Добавяне на новата книга в списъка
        bookList.appendChild(bookItem);
    
        // Скриване на съобщението "No added books"
        if (noBooksMessage) {
            noBooksMessage.style.display = "none";
        }
        document.addEventListener("DOMContentLoaded", () => {
            const reviewModal = document.getElementById("review-modal");
            const modalBookCover = document.getElementById("modal-book-cover");
            const bookTitleInput = document.getElementById("book-Title");
            const bookAuthorInput = document.getElementById("book-Author");
            const bookReviewInput = document.getElementById("book-review");
            const closeModalButton = reviewModal.querySelector(".close");
        
            const bookList = document.getElementById("currently-reading-list"); // Update with your book list container ID
            const noBooksMessage = document.getElementById("no-books-message"); // Update with your message element ID
        
            // Open modal on book cover click
            document.querySelectorAll(".book-cover").forEach((cover) => {
                cover.addEventListener("click", (e) => {
                    const bookElement = e.target.closest(".book");
                    const title = bookElement.querySelector(".book-title").textContent;
                    const author = bookElement.querySelector(".book-author").textContent;
                    const coverSrc = e.target.src;
        
                    // Populate modal
                    modalBookCover.src = coverSrc;
                    bookTitleInput.value = title;
                    bookAuthorInput.value = author;
        
                    // Show modal
                    reviewModal.style.display = "block";
                });
            });
        
            // Close modal
            closeModalButton.addEventListener("click", () => {
                reviewModal.style.display = "none";
                bookReviewInput.value = ""; // Clear review input
            });
        
            // Add delete functionality
            bookList.addEventListener("click", (e) => {
                if (e.target.classList.contains("delete-button")) {
                    const bookItem = e.target.closest(".book");
                    const title = bookItem.querySelector(".book-title").textContent;
        
                    // Remove book from DOM
                    bookItem.remove();
        
                    // Update localStorage
                    const books = JSON.parse(localStorage.getItem("currentlyReadingBooks")) || [];
                    const updatedBooks = books.filter((b) => b.title !== title);
                    localStorage.setItem("currentlyReadingBooks", JSON.stringify(updatedBooks));
        
                    // Show "No books" message if list is empty
                    if (bookList.children.length === 0) {
                        noBooksMessage.style.display = "block";
                    }
                }
            });
        });               
    
        // Добавяне на обработчик за изтриване на книгата
        const deleteButton = bookItem.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
            bookItem.remove();
    
            // Актуализиране на localStorage
            const books = JSON.parse(localStorage.getItem("currentlyReadingBooks")) || [];
            const updatedBooks = books.filter((b) => b.title !== book.title);
            saveBooks(updatedBooks);
    
            // Показване на съобщението, ако няма книги
            if (bookList.children.length === 1) {
                noBooksMessage.style.display = "block";
            }
        });
    }
       

    // Функция за запазване на книгите в localStorage
    const saveBooks = (books) => {
        localStorage.setItem("currentlyReadingBooks", JSON.stringify(books));
    };

    // Обработчик за добавяне на нова книга
    modalAddButton.addEventListener("click", () => {
        const title = bookTitleInput.value.trim();
        const author = bookAuthorInput.value.trim();
        const cover = coverPreview.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/, '$2');

        if (title && author && cover) {
            const book = { title, author, cover };
            addBookToDOM(book);

            // Запазване на книгата в localStorage
            const books = JSON.parse(localStorage.getItem("currentlyReadingBooks")) || [];
            books.push(book);
            saveBooks(books);

            // Нулиране на формата
            bookTitleInput.value = "";
            bookAuthorInput.value = "";
            coverPreview.style.backgroundImage = "";
            coverPreview.textContent = "Add a cover image";
            addBookModal.style.display = "none";
        } else {
            alert("Please fill in all fields and add a cover image.");
        }
    });

    // Обработчик за нулиране на формата
    discardButton.addEventListener("click", () => {
        bookTitleInput.value = "";
        bookAuthorInput.value = "";
        coverPreview.style.backgroundImage = "";
        coverPreview.textContent = "Add a cover image";
        addBookModal.style.display = "none";
    });

    // Обработчик за избиране на корица
    coverPreview.addEventListener("click", () => {
        bookCoverInput.click();
    });

    bookCoverInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                coverPreview.style.backgroundImage = `url('${e.target.result}')`;
                coverPreview.style.backgroundSize = "cover"; // Уверяваме се, че използваме 'cover'
                coverPreview.style.backgroundPosition = "center"; // Центрираме изображението
                coverPreview.textContent = ""; // Премахваме текста
            };
            reader.readAsDataURL(file);
        }
    });    

    // Зареждане на книгите при зареждане на страницата
    loadBooks();
});

// WORKING DONT TOUCH

document.addEventListener("DOMContentLoaded", () => {
    const reviewModal = document.getElementById("review-modal");
    const modalBookCover = document.getElementById("modal-book-cover");
    const bookTitleInput = document.getElementById("book-Title");
    const bookAuthorInput = document.getElementById("book-Author");
    const bookReviewInput = document.getElementById("book-review");
    const addReviewButton = document.getElementById("addReviewButton");
    const closeModalButton = reviewModal.querySelector(".close");
    const reviewsContainer = document.getElementById("reviews-container");
    const toBeReviewedBooks = document.querySelectorAll(".to-be-reviewed .book");

    // Функция за извличане на ревютата от Local Storage
    const getReviewsFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem("bookReviews")) || [];
    };

    // Функция за запис на ревюта в Local Storage
    const saveReviewsToLocalStorage = (reviews) => {
        localStorage.setItem("bookReviews", JSON.stringify(reviews));
    };

    // Функция за показване на ревюта
    const displayReviews = () => {
        const reviews = getReviewsFromLocalStorage();
        reviewsContainer.innerHTML = ''; // Изчистваме текущите ревюта, преди да добавим новите

        reviews.forEach((review, index) => {
            const reviewDiv = document.createElement("div");
            reviewDiv.classList.add("review-section");
            reviewDiv.id = `review${index}`;

            reviewDiv.innerHTML = `
            <div class="review-header">
                <img src="./images/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg" alt="User Profile" class="user-profile">
                <span class="user-name">Test User</span>
                <span class="delete-review" data-index="${index}">X</span>
            </div>
            <div class="review-body">
                <img src="${review.cover}" alt="Book Cover" class="book-cover">
                <div class="book-details">
                    <h3 class="book-title">${review.title}</h3>
                    <p class="review-text">
                        '${review.text}'
                        <a href="#" class="more-link">More...</a>
                    </p>
                </div>
            </div>
            <div class="review-footer">
                <span class="like-count" style="display: none;">
                    <img src="./images/25297.png" alt="Thumbs Up" class="thumb-icon">
                    <span class="like-number">${review.likeCount}</span>
                </span>
                <a href="#" class="action-link like-link" onclick="toggleLike(this)">Like</a>
                <a href="#" class="action-link">Comment</a>
            </div>
            <div class="comment-section">
                <img src="./images/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg" alt="Your Profile" class="comment-profile">
                <input type="text" placeholder="Leave a comment..." class="comment-input">
            </div>
        `;        

            reviewsContainer.appendChild(reviewDiv);
        });

        // Добавяне на обработчик за бутона за изтриване
        document.querySelectorAll(".delete-review").forEach((deleteButton) => {
            deleteButton.addEventListener("click", (event) => {
                const index = event.target.dataset.index;
                deleteReview(index);
            });
        });
    };

    const deleteReview = (index) => {
        // Вземаме всички ревюта от Local Storage
        const reviews = getReviewsFromLocalStorage();
        
        // Премахваме избраното ревю
        reviews.splice(index, 1);
        
        // Записваме обновените ревюта в Local Storage
        saveReviewsToLocalStorage(reviews);
        
        // Обновяваме списъка с ревюта
        displayReviews();
    };  

    // Отваряне на модалния прозорец при клик върху книга
    toBeReviewedBooks.forEach((book) => {
        book.addEventListener("click", () => {
            const bookCover = book.querySelector("img").src;

            // Задаване на изображението в модалния прозорец
            modalBookCover.src = bookCover;

            // Отваряне на модалния прозорец
            reviewModal.style.display = "block";
        });
    });

    // Затваряне на модалния прозорец
    closeModalButton.addEventListener("click", () => {
        reviewModal.style.display = "none";

        // Изчистване на полетата за вход
        bookTitleInput.value = "";
        bookAuthorInput.value = "";
        bookReviewInput.value = "";
    });

    // Добавяне на ревю в Local Storage
    addReviewButton.addEventListener("click", () => {
        const reviewTitle = bookTitleInput.value;
        const reviewAuthor = bookAuthorInput.value;
        const reviewText = bookReviewInput.value;
        const reviewCover = modalBookCover.src;

        if (!reviewTitle || !reviewAuthor || !reviewText) {
            alert("Моля, попълнете всички полета!");
            return;
        }

        // Вземане на текущите ревюта от Local Storage
        const reviews = getReviewsFromLocalStorage();

        // Добавяне на новото ревю с фиксирана профилна снимка и име
        reviews.push({
            title: reviewTitle,
            author: reviewAuthor,
            text: reviewText,
            cover: reviewCover,
            profilePic: "./images/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg", // Профилна снимка с котката
            userName: "Test User", // Име на потребителя, което е фиксирано
            likeCount: 1,
        });

        // Записване в Local Storage
        saveReviewsToLocalStorage(reviews);

        // Обновяване на ревютата
        displayReviews();

        // Затваряне на модалния прозорец
        reviewModal.style.display = "none";

        // Изчистване на полетата
        bookTitleInput.value = "";
        bookAuthorInput.value = "";
        bookReviewInput.value = "";
    });

    // Показване на ревюта при зареждане на страницата
    displayReviews();
});

//doesnt work
