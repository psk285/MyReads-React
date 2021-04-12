import React, { Component } from "react";
import BookShelfChanger from "./BookShelfChanger";

export default class Book extends Component {
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
