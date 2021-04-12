import React, { Component } from "react";
// import * as BooksAPI from './BooksAPI'
//import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { getAll, update } from "./BooksAPI";

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * TODO: Instead of using this state variable to keep track of which page
       * we're on, use the URL in the browser's address bar. This will ensure that
       * users can use the browser's back and forward buttons to navigate between
       * pages, as well as provide a good URL they can bookmark and share.
       */
      showSearchPage: false,
      books: [],
    };
  }

  moveBookToShelf = (book, shelf) => {
    let prevShelf = book.shelf;
    let nextShelf = shelf;
    if (prevShelf === nextShelf) return;
    update(book, nextShelf);
    console.log(book, shelf);
    let actualBook = this.state.books.filter((bo) => bo.id === book)[0];
    console.log(actualBook);
    actualBook.shelf = nextShelf;
    //console.log(actualBook);
    let allBooksExceptCurrentBook = this.state.books.filter(
      (b) => b.id !== book
    );
    let newUpdatedBooks = [...allBooksExceptCurrentBook, actualBook];
    this.setState({ books: newUpdatedBooks });
  };
  async componentDidMount() {
    let allBooks = await getAll();
    this.setState({
      books: allBooks,
    });
  }
  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button
                className="close-search"
                onClick={() => this.setState({ showSearchPage: false })}
              >
                Close
              </button>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author" />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid" />
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf
                  shelfTitle="Currently Reading"
                  shelfTitleProps="currentlyReading"
                  bookDetails={this.state.books}
                  moveBookToShelf={this.moveBookToShelf}
                  key={this.state.books.id}
                />
                <BookShelf
                  shelfTitle="Want to Read"
                  shelfTitleProps="wantToRead"
                  bookDetails={this.state.books}
                  moveBookToShelf={this.moveBookToShelf}
                  key={this.state.books.id}
                />
                <BookShelf
                  shelfTitle="Read"
                  shelfTitleProps="read"
                  bookDetails={this.state.books}
                  moveBookToShelf={this.moveBookToShelf}
                  key={this.state.books.id}
                />
              </div>
            </div>
            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>
                Add a book
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class BookShelf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booksToShow: [],
    };
  }

  async componentDidMount() {
    let filtBooks = this.props.bookDetails.filter(
      (bookDetail) => bookDetail.shelf === this.props.shelfTitleProps
    );
    this.setState({ booksToShow: filtBooks });
  }
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.bookDetails
              .filter(
                (bookDetail) => bookDetail.shelf === this.props.shelfTitleProps
              )
              .map((bookDetail, index) => (
                <Book
                  idBook={bookDetail.id}
                  tit={bookDetail.title}
                  key={bookDetail.id}
                  sty={{
                    width: 148,
                    height: 174,
                    backgroundImage:
                      bookDetail.imageLinks &&
                      `url('${bookDetail.imageLinks.thumbnail}')`,
                  }}
                  shelf={bookDetail.shelf}
                  auth={bookDetail.authors}
                  moveBookToShelf={this.props.moveBookToShelf}
                />
              ))}
          </ol>
        </div>
      </div>
    );
  }
}

class Book extends Component {
  render() {
    return (
      <li>
        <div className="book" id={this.props.tit}>
          <div className="book-top">
            <div className="book-cover" style={this.props.sty} />
            <BookShelfChanger
              changerKey={this.props.idBook}
              shelf={this.props.shelf}
              moveBookToShelf={this.props.moveBookToShelf}
            />
          </div>
          <div className="book-title">{this.props.tit}</div>
          <div className="book-authors">{this.props.auth}</div>
        </div>
      </li>
    );
  }
}

class BookShelfChanger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shelf: this.props.shelf,
    };
    this.eventHandlerForChange = this.eventHandlerForChange.bind(this);
  }
  eventHandlerForChange(e) {
    this.setState({ shelf: e.target.value });
    this.props.moveBookToShelf(this.props.changerKey, e.target.value);
  }
  render() {
    return (
      <div className="book-shelf-changer" key={this.props.changerKey}>
        <select value={this.state.shelf} onChange={this.eventHandlerForChange}>
          <option value="move" disabled>
            Move to...
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="none">None</option>
        </select>
      </div>
    );
  }
}

export default BooksApp;
