# Star Wars API Fun

![Screenshot 2019-07-14 at 18 43 55](https://user-images.githubusercontent.com/47919053/61187278-8ed9ee00-a667-11e9-9769-b74036126492.png)

# Technologies used
* React
* JavaScript (ES6)
* HTML5
* Bulma (CSS framework)
* CSS

## Star Wars API - React project
This was a pair-coding, hackathon project with [Richard Yarwood](https://github.com/richyarwood) at General Assembly.

The brief was to:
* Consume a publicly available API
* Deliver the data back in a React app

The project consumes data from [CocktailDB API](https://www.thecocktaildb.com/api.php).

The site can be run locally by cloning the repository and typing ```npm i``` and then ```npm run serve``` in the terminal.

### App overview

![image](https://user-images.githubusercontent.com/47919053/60401794-5bcf2f00-9b7e-11e9-8504-880e9d97015b.png)

The application allows a user to search for a cocktail by single ingredient or name of the cocktail, returning the results under the search input.

Clicking on a cocktail provides information on the ingredients and instructions on how to make the cocktail.

![image](https://user-images.githubusercontent.com/47919053/60401819-ba94a880-9b7e-11e9-8105-c92181ff54ba.png)

Similar cocktails are displayed under each cocktail. This filter is based on the ingredients of the cocktail on display.

### Development process

Three endpoints were chosen:

* Filter by ingredient: https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Gin
* Search by name: https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita
* Random cocktail: https://www.thecocktaildb.com/api/json/v1/1/random.php

The main page is rendered from four components ```Home.js```, ```NavBar.js```, ```RandomCocktail.js``` and ```CocktailIndex.js```.

Choosing from the radio buttons (ingredient or name) sets a search variable which was appended to the api call. A ternary operator allowed us to refactor the code to a simple statement and ```scrollIntoView``` was used on submit to maximise the number of results on the page:

```
handleSubmit(e) {
  e.preventDefault()
  const endpoint = this.state.filter === 'ingredient' ? 'filter.php?i' : 'search.php?s'

  axios.get(`https://www.thecocktaildb.com/api/json/v1/1/${endpoint}=${this.state.search.searchInput}`)
    .then(res => this.setState({ data: res.data }))
    .then(() => this.searchResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
```

#### Cocktail detail page

The delivery of the ingredients was a challenge because the data from the API was unstructured with many empty or null values, and the drinks and measures separated in to different key: value pairs.

This was resolved by filtering the response data:

```
getData(){
  axios.get('https://www.thecocktaildb.com/api/json/v1/1/lookup.php', {
    params: {
      i: this.props.match.params.id
    }
  })
    .then(res => {
      const data = res.data.drinks[0]

      const drinks = Object.keys(data)
        .filter(key => key.match(/ingredient/i))
        .filter(key => !!data[key] || data[key] === ' ')
        .map(key => data[key].trim())

      const measures = Object.keys(data)
        .filter(key => key.match(/measure/i))
        .filter(key => !!data[key] || data[key] === ' ')
        .map(key => data[key].trim())

      const ingredients = drinks.map((drink, index) => {
        return { drink: drinks[index], measure: measures[index] }
      })

      const cocktail = {
        image: data.strDrinkThumb,
        name: data.strDrink,
        instructions: data.strInstructions,
        glass: data.strGlass,
        alcoholic: data.strAlcoholic,
        category: data.strCategory,
        id: data.idDrink,
        ingredients
      }

      this.setState({ cocktail })
    })
}
```


### Future enhancements
* Upgrading the API to allow searches by multiple ingredients.
* Adding failed search notifications.
