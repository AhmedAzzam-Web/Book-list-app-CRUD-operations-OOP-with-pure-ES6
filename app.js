let title = document.getElementById('title')
let author = document.getElementById('author')
let serial = document.getElementById('serial')

let container = document.querySelector('.container')
let form = document.getElementById('book-form')
let list = document.getElementById('book-list')
let submit = document.querySelector('.submit')

// create book class that create the book object
class Book {
    constructor(title, author, serial) {
        this.title = title;
        this.author = author;
        this.serial = serial;
    }
}

// Create the Ui class that handels methods and operaions in user-side
class Ui {
    static displayBook() {

        let books = Store.getBooks();

        books.forEach((book) => {
            Ui.addBook(book)
        })
    }

    static addBook(book) {
        let row = document.createElement('tr')

        row.innerHTML = `
            <td class='title'>${book.title}</td>
            <td class='author'>${book.author}</td>
            <td class='serial'>${book.serial}</td>
            <td> <a class='delete btn btn-danger btn-sm'>X</a> </td>
            <td> <a class='update btn-sm btn btn-primary'>update</a> </td>
        `

        list.appendChild(row)
    }

    static showAlert(message, state) {
        let box = document.createElement('div')

        box.className = `alert alert-${state}`

        box.appendChild(document.createTextNode(message))

        container.insertBefore(box, form)

        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 2500);
    }

    static clearInputs() {
        title.value = '';
        author.value = '';
        serial.value = '';
    }

    static removeBook(e) {
        if (e.classList.contains('delete') || e.classList.contains('update')) {
            e.parentElement.parentElement.remove();
        }
    }

    static updateBook(e) {
        if (e.classList.contains('update')) {
            let rowTitle = e.parentElement.parentElement.children[0].textContent
            let rowAuthor = e.parentElement.parentElement.children[1].textContent
            let rowSerial = e.parentElement.parentElement.children[2].textContent

            title.value = rowTitle;
            author.value = rowAuthor;
            serial.value = rowSerial;
            submit.value = 'Update Book';
        }
    }
}

// store class that handles local storage operaions
class Store {
    static getBooks() {

        // the variable that we will control local storage with and return local storage values in it
        let books;

        // check if there is books in local storage or not
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books;
    }

    static addBooks(book) {
        // grep local storage books
        let books = Store.getBooks()

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBooks(serial) {
        let books = Store.getBooks()

        books.forEach((book, index) => {
            if (index === 0) {
                localStorage.clear()
            }
            else {
                if (book.serial === serial) {
                    books.splice(index, 1)
                    localStorage.setItem(JSON.stringify(books))
                }
            }
        })
    }
}

// event display books

document.addEventListener('DOMContentLoaded', Ui.displayBook())

// event add books with the submit form button
form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (title.value == '' || author.value == '' || serial.value == '') {
        Ui.showAlert('Please fill in all inputs', 'danger')
    }
    else {
        let book = new Book(title.value, author.value, serial.value)

        Ui.addBook(book)

        Ui.showAlert('book added successfully', 'success')

        Store.addBooks(book)

        Ui.clearInputs()
    }
})

// event remove a book
list.addEventListener('click', (element) => {
    if (element.target.classList.contains('delete')) {
        Ui.removeBook(element.target)
        Store.removeBooks(element.target.parentElement.previousElementSibling.textContent);
        Ui.showAlert('Book Removed', 'success');
    }
    if (element.target.classList.contains('update')) {
        Ui.updateBook(element.target)
        Ui.removeBook(element.target)
        Store.removeBooks(element.target.parentElement.previousElementSibling.textContent);
        Ui.showAlert('You can update book item now', 'success');
    }
})