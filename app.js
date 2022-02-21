let title = document.getElementById('title')
let author = document.getElementById('author')
let serial = document.getElementById('serial')

let container = document.querySelector('.container')
let bookForm = document.getElementById('book-form')
let bookList = document.getElementById('book-list')

// create class book that create the book object
class Book {
    constructor (title, author, serial) {
        this.title = title;
        this.author = author;
        this.serial = serial
    }
}

// create the Ui class that handles all ui methods and operations
class Ui {

    static displayBook () {

        let books = Store.getBooks()

        books.forEach( (book) => {
            Ui.addBook(book)
        })

    }

    static addBook (book) {
        let row = document.createElement('tr')

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.serial}</td>
            <td> <a class='btn btn-danger btn-sm delete'>X</a> </td>
        `

        bookList.appendChild(row)
    }

    static deleteBook (e) {
        if (e.classList.contains('delete')) {
            e.parentElement.parentElement.remove()
        }
    }

    static showAlert(message , state) {
        let div = document.createElement('div')

        div.className = `alert alert-${state}`

        div.appendChild(document.createTextNode(message))

        container.insertBefore(div , bookForm)

        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 2500)
    }

    static clearInputs () {
        title.value = '';
        author.value = '';
        serial.value = '';
    }

}

// local storage class 
class Store{

    // get the books from local storage
    static getBooks () {

        let books;

        // check if there are books in the local storage or not
        if ( localStorage.getItem('books') === null ) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books;

    }

    static addBooks(book) {
        // add the book to local storage
        let books = Store.getBooks();

        books.push(book)

        // update the local storage with the new array
        localStorage.setItem('books' , JSON.stringify(books))
    }

    static removeBook (serial) {
        let books = Store.getBooks();

        books.forEach((book , index) => {
            if (index === 0) {
                localStorage.clear()
            }
            else {
                if (book.serial === serial) {
                    books.splice(index , 1)
                }
                JSON.stringify( localStorage.setItem('books', books) )
            }
        })

    }
}

// event display Ui book
document.addEventListener('DOMContentLoaded' , Ui.displayBook)

// event add book with the submit button form
bookForm.addEventListener('submit' , (e) => {
    e.preventDefault()

    if (title.value == '' || author.value == '' || serial.value == '') {
        Ui.showAlert('Please fill in all inputs' , 'danger')
    }
    else {
        let book = new Book(title.value, author.value, serial.value)

        Store.addBooks(book)
    
        Ui.addBook(book)
    
        Ui.showAlert('item added successfully' , 'success')
        
        Ui.clearInputs()
    }
})

// event remove book
bookList.addEventListener('click' , (e) => {
    
    Ui.deleteBook(e.target)

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

    Ui.showAlert('item removed successfully' , 'success')
})