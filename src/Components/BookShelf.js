import React, { Component } from "react";
import Book from "./Book";
export default class BookShelf extends Component {
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
        {this.props.shelfTitle !== "None" && (
          <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
        )}
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
