import React, { Component } from "react";
export default class BookShelfChanger extends Component {
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
