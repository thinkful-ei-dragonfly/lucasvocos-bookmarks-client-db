import React from 'react'
import BookmarksContext from '../BookmarksContext';
import config from '../config'

const Required = () => (
  <span className="EditBookmark__required">*</span>
)

export default class EditBookmark extends React.Component {
  static contextType = BookmarksContext

  state = {
    error: null,
  };

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId
    fetch(config.API_ENDPOINT + `${bookmarkId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.API_TOKEN}`
      }
    })
      .then(res => {
        return res.json()
      })
      .then(response => {
        this.setState({
          id: response.id,
          title: response.title,
          url: response.url,
          description: response.description,
          rating: response.rating
        })
      })
      .catch(error => {
        console.log(error);
        this.setState({error})
      })
  }
  handleSubmit = e => {
    e.preventDefault()

    const { title, url, description, rating } = e.target

    const updatedBookmark = {
      id: this.state.id,
      title: title.value,
      url: url.value,
      description: description.value,
      rating: rating.value,
    }

    this.setState({ error: null })
    fetch(`${config.API_ENDPOINT}${this.state.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedBookmark),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${config.API_TOKEN}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error
          })
        }
      })
      .then(() => {
        this.context.updateBookmark(updatedBookmark)
      })
      .then(() => {
        this.props.history.push('/')
      })
      .catch(error => {
        console.log(error)
        this.setState({error})
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  }

  render() {
    const { error } = this.state
    const { title, description, url, rating } = this.state
    return (
      <section className='EditBookmark'>
        <h2>Edit bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required/>
            </label>
            <input
              type='text'
              name='title'
              id='title'
              defaultValue={title}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required/>
            </label>
            <input
              type='url'
              name='url'
              id='url'
              defaultValue={url}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
              {' '}
            </label>
            <textarea
              name='description'
              id='description'
              placeholder={description}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required/>
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              defaultValue={rating}
              min='1'
              max='5'
              required
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>

              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    )
  }
}
