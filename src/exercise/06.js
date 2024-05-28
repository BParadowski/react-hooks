// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

// class ErrorBoundary extends React.Component {
//   state = {error: null}

//   static getDerivedStateFromError(error) {
//     return {error}
//   }

//   render() {
//     if (this.state.error) {
//       return this.props.fallback
//     } else return this.props.children
//   }
// }

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState({
    pokemon: null,
    status: 'idle',
    error: null,
  })

  const isPending = pokemon.status === 'pending'
  const isIdle = pokemon.status === 'idle'
  const isResolved = pokemon.status === 'resolved'
  const isRejected = pokemon.status === 'rejected'

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setPokemon(state => ({...state, status: 'pending'}))

    fetchPokemon(pokemonName)
      .then(apiData => {
        setPokemon(state => ({...state, pokemon: apiData, status: 'resolved'}))
      })
      .catch(err => {
        setPokemon(state => ({...state, status: 'rejected', error: err}))
      })
  }, [pokemonName])
  if (isPending) {
    return <p>Loading pokedata...</p>
  } else if (isRejected) {
    throw pokemon.error
  } else if (isIdle) {
    return <p>Submit a pokemon</p>
  } else if (isResolved && !pokemon.pokemon) {
    return <PokemonInfoFallback />
  } else return <PokemonDataView pokemon={pokemon.pokemon} />
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          fallbackRender={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
