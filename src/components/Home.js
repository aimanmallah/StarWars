import React from 'react'
import axios from 'axios'

import CharacterCard from './CharacterCard'

class Home extends React.Component {
  constructor() {
    super()

    this.state = {
      data: null,
      search: '',
      pageNumber: 1,
      hasPrevious: false,
      hasNext: true,
      isSingleSearch: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)

  }

componentDidMount() {
  axios.get(`https://swapi.co/api/people/?page=${this.state.pageNumber}`)
    .then(res => {
      this.setState({ data: res.data})
    })
}


handleChange(e) {
  this.setState({search: e.target.value})
}

//getting character by Search
handleSubmit(e){
  axios.get(`https://swapi.co/api/people/?page=1&search=${this.state.search}`)
      .then(res => {
        this.setState({
          data: res.data,
          pageNumber: 1,
          hasPrevious: res.data.previous !== null,
          hasNext: res.data.next !== null,
          isSingleSearch: true
        })
      })
}

handleBack() {
  axios.get(`https://swapi.co/api/people/?page=1`)
    .then(res => {
      this.setState({
        data: res.data,
        pageNumber: 1,
        isSingleSearch: false,
        hasPrevious: res.data.previous !== null,
        hasNext: res.data.next !== null,
        search: ''
      })
    })
}

//getting characters by PageNumber
  fetchCharactersByPageNumber(pageNumber) {
    return axios.get(`https://swapi.co/api/people/?page=${pageNumber}&search=${this.state.search}`)
    .then(res => {
      this.setState({
        data: res.data,
        hasPrevious: res.data.previous !== null,
        hasNext: res.data.next !== null,
      })
    })
  }

//handles when Next button is clicked
  handleNext() {
    const nextPageNumber = this.state.pageNumber + 1
    this.fetchCharactersByPageNumber(nextPageNumber)
    .then(data => {
      this.setState({ pageNumber: nextPageNumber })
    })
  }

//handles when Previous button is clicked
  handlePrevious() {
    const prevPageNumber = this.state.pageNumber - 1
    this.fetchCharactersByPageNumber(prevPageNumber)
    .then(data => {
      this.setState({ pageNumber: prevPageNumber })
    })
  }

  render() {
    if(!this.state.data) return null
    console.log(this.state)
    return (
      <div className="container">
        <img className="logo" src={ require('../images/star_wars_logo.png')} alt='Star Wars Logo' />

        <div className="border">

          <div className="search">
            {!this.state.isSingleSearch &&
            <input
              className="input"
              type="text"
              placeholder="Enter Character Name"
              onChange={this.handleChange}
              value={this.state.search}
            />
            }
            {!this.state.isSingleSearch &&<button onClick={this.handleSubmit}>Search</button>}
            {this.state.isSingleSearch && <button className="back" onClick={this.handleBack}>Back</button>}
          </div>

          <div className="table">
            {this.state.data.results.map(character =>
              <div key={character.name} className="card">
                <CharacterCard {...character}/>
              </div>
            )}
          </div>

          <div className="pagination">
            <h4 className="title is-5"> {this.state.pageNumber} </h4>

            <div className="pages">
              {this.state.hasPrevious && <button type="button" className="previous" onClick={this.handlePrevious}>Previous</button>}
              {this.state.hasNext && <button type="button" className="next" onClick={this.handleNext}>Next</button>}
            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default Home
