import React from 'react';
import config from '../config'
import Rating from '../Rating/Rating';
import BookmarksContext from '../BookmarksContext'
import './BookmarkItem.css';
import { Link } from 'react-router-dom'


export default function BookmarkItem(props) {
  function deleteBookmarkRequest(bookmarkId, cb) {
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'DELETE',
      headers: {
        'authorization': `bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if (!res.ok) {
        // failed
        return res.json().then(error => {
          throw error;
        })
      }
      return res.json();
    })
    .then(data => {
      // call this when the request is successful
      cb(bookmarkId)
    })
    .catch(error => {
      console.error(error)
    })
  }

  return (
    <BookmarksContext.Consumer>
      {(context) => (
        <li className='BookmarkItem'>
          <div className='BookmarkItem__row'>
            <h3 className='BookmarkItem__title'>
              <a
                href={props.url}
                target='_blank'
                rel='noopener noreferrer'>
                {props.title}
              </a>
            </h3>
            <Rating value={props.rating} />
          </div>
          <p className='BookmarkItem__description'>
            {props.description}
          </p>
          <div className='BookmarkItem__buttons'>
            <Link to={`/edit/${props.id}`}>Edit Bookmark</Link>
            <button
              className='BookmarkItem__description'
              onClick={() => {
                deleteBookmarkRequest(props.id, context.deleteBookmark)
              }}
            >
              Delete
            </button>
          </div>
        </li>
    )}
    </BookmarksContext.Consumer>
  )
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {},
}
