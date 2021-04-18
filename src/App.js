import React from "react";
// import * as BooksAPI from './BooksAPI'
//import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { getAll, update, search } from "./BooksAPI";
import BookShelf from "./Components/BookShelf";
import { Route, Switch, BrowserRouter as Router, Link } from "react-router-dom";
import ls from "local-storage";
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
      inputValue: "",
      searchedBooks: [],
    };
  }

  moveBookToShelf = (book, shelf) => {
    let prevShelf = book.shelf;
    let nextShelf = shelf;
    if (prevShelf === nextShelf) return;
    update(book, nextShelf);
    let actualBook = this.state.books.filter((bo) => bo.id === book);
    console.log(actualBook);
    let newUpdatedBooks = [];
    if (actualBook.length > 0) {
      let actBook = actualBook[0];
      actBook.shelf = nextShelf;
      let allBooksExceptCurrentBook = this.state.books.filter(
        (b) => b.id !== book
      );
      newUpdatedBooks = [...allBooksExceptCurrentBook, actBook];
      this.setState({ books: newUpdatedBooks });
      ls.set("books", newUpdatedBooks);
    } else {
      let actualBookNew = this.state.searchedBooks.filter(
        (bo) => bo.id === book
      )[0];
      console.log(actualBookNew);
      if (actualBookNew !== null) {
        actualBookNew.shelf = nextShelf;
        let allBooksExceptCurrentBook = this.state.books.filter(
          (b) => b.id !== book
        );
        if (allBooksExceptCurrentBook.length !== this.state.books.length) {
          newUpdatedBooks = [...allBooksExceptCurrentBook, actualBookNew];
        } else {
          newUpdatedBooks = [...this.state.books, actualBookNew];
        }
        this.setState({ books: newUpdatedBooks });
        ls.set("books", newUpdatedBooks);
      }
    }
  };

  async componentDidMount() {
    let allBooks = await getAll();
    let allBooksCheck = ls.get("books") || [];
    if (allBooksCheck.length > allBooks.length) {
      this.setState({
        books: allBooksCheck,
      });
    } else {
      this.setState({
        books: allBooks,
      });
    }
  }
  resetSearch = async () => {
    this.setState({ searchedBooks: [], inputValue: "" });
    ls.set("searchedBooks", []);
    ls.set("inputValue", "");
  };
  searchBooks = async () => {
    if (this.state.inputValue.length === 0) {
      this.setState({ searchedBooks: [] });
      ls.set("searchedBooks", []);
      return;
    }
    let searchedBooksOutput = await search(this.state.inputValue);
    if (searchedBooksOutput !== []) {
      [...searchedBooksOutput].forEach((sb) => {
        if (!sb.shelf) {
          sb.shelf = "none";
        }
      });
    }

    //console.log(searchedBooksOutput);
    this.setState({ searchedBooks: searchedBooksOutput });
    ls.set("searchedBooks", searchedBooksOutput);
  };
  eventHandlerInputChange = (e) => {
    let origValue = e.target.value;
    if (origValue === "") {
      this.setState({ searchedBooks: [], inputValue: "" });
      ls.set("searchedBooks", []);
      ls.set("inputValue", "");
    }
    this.setState({ inputValue: origValue }, () => {
      this.searchBooks(origValue);
    });
    ls.set("inputValue", origValue);
  };
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
                  <CloseSearchButton onChange={this.resetSearch} />
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
                      value={this.state.inputValue}
                      onChange={this.eventHandlerInputChange}
                      placeholder="Search by title or author"
                    />
                  </div>
                </div>
                <div className="search-books-results">
                  <BookShelf
                    shelfTitle="None"
                    shelfTitleProps="none"
                    bookDetails={this.state.searchedBooks}
                    moveBookToShelf={this.moveBookToShelf}
                    key={this.state.searchedBooks.id}
                  />
                </div>
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
    );
  }
}

let StartSearch = (props) => {
  return (
    <div className="open-search">
      <Link to="search">
        <button>Add a Book</button>
      </Link>
    </div>
  );
};
let CloseSearchButton = (props) => {
  return (
    <Link to="/">
      <button className="close-search" onClick={props.resetSearch}>
        Close
      </button>
    </Link>
  );
};

export default BooksApp;
