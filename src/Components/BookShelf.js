import React, { Component } from "react";
import Book from "./Book";
export default class BookShelf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booksToShow: [],
      isAll: [],
    };
  }

  async componentDidMount() {
    if (this.props.shelfTitleProps !== "all") {
      let filtBooks = this.props.bookDetails.filter(
        (bookDetail) => bookDetail.shelf === this.props.shelfTitleProps
      );
      this.setState({ booksToShow: filtBooks });
    } else {
      this.setState({ booksToShow: this.props.bookDetails });
    }
  }
  render() {
    return (
      <div className="bookshelf">
        {this.props.shelfTitle !== "All" && (
          <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
        )}
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.shelfTitle !== "All" &&
              this.props.bookDetails
                .filter(
                  (bookDetail) =>
                    bookDetail.shelf === this.props.shelfTitleProps
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
                    auth={bookDetail.authors && bookDetail.authors.join(", ")}
                    moveBookToShelf={this.props.moveBookToShelf}
                  />
                ))}
            {this.props.shelfTitle === "All" &&
              this.props.bookDetails.map((bookDetail, index) => (
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
                  auth={bookDetail.authors && bookDetail.authors.join(", ")}
                  moveBookToShelf={this.props.moveBookToShelf}
                />
              ))}
          </ol>
        </div>
      </div>
    );
  }
}
