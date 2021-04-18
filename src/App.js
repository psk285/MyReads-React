import React from "react";
import "./App.css";
import { getAll, update, search } from "./BooksAPI";
import BookShelf from "./Components/BookShelf";
import { Route, Switch, BrowserRouter as Router, Link } from "react-router-dom";
import ls from "local-storage";
class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  resetSearch = () => {
    console.log(this);
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
    console.log(searchedBooksOutput);
    if (searchedBooksOutput.error) {
      return;
    }
    //console.log(searchedBooksOutput);
    if (searchedBooksOutput !== undefined || searchedBooksOutput.length !== 0) {
      [...searchedBooksOutput].forEach((sb) => {
        if (!sb.shelf) {
          sb.shelf = "none";
        }
      });
    }
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
              <StartSearch />
            </div>
          </Route>
          <Route path="/search">
            <div className="app">
              <div className="search-books">
                <div className="search-books-bar">
                  <Link to="/">
                    <button className="close-search" onClick={this.resetSearch}>
                      Close
                    </button>
                  </Link>
                  <div className="search-books-input-wrapper">
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
                    shelfTitle="All"
                    shelfTitleProps="all"
                    bookDetails={this.state.searchedBooks}
                    moveBookToShelf={this.moveBookToShelf}
                    key={this.state.searchedBooks.id}
                    iv={ls.get("inputValue")}
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

export default BooksApp;
