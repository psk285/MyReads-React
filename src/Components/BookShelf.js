/*eslint-disable */
import React, { Component } from "react";
import Book from "./Book";

export default class BookShelf extends Component {
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.bookDetails.map((bookDetail, index) => (
              <Book
                tit={bookDetail.title}
                sty={{
                  width: 148,
                  height: 174,
                  backgroundImage: `url('${bookDetail.imageLinks.thumbnail}')`,
                }}
                auth={bookDetail.authors.toString()}
                key={bookDetail.title}
              />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}
