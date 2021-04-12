import React from "react";
// import * as BooksAPI from './BooksAPI'
//import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { getAll, update } from "./BooksAPI";
import BookShelf from "./Components/BookShelf";
import { Route, Switch, BrowserRouter as Router, Link } from "react-router-dom";
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
      <Router>
        <Switch>
          <Route path="/" exact>
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
              {/* <div className="open-search">
                <button onClick={() => this.startSearch()}>Add a book</button>
              </div> */}
              <StartSearch />
            </div>
          </Route>
          <Route path="/search">
            <div className="app">
              <div className="search-books">
                <div className="search-books-bar">
                  <CloseSearchButton />
                  <div className="search-books-input-wrapper">
                    {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                    <input
                      type="text"
                      placeholder="Search by title or author"
                    />
                  </div>
                </div>
                <div className="search-books-results">
                  <ol className="books-grid" />
                </div>
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
    );
  }
}

let StartSearch = () => {
  return (
    <div className="open-search">
      <Link to="search">
        <button>Add a Book</button>
      </Link>
    </div>
  );
};
let CloseSearchButton = () => {
  return (
    <Link to="/">
      <button className="close-search">Close</button>
    </Link>
  );
};

export default BooksApp;
