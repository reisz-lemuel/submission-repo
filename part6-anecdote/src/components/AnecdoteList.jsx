import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clickVote } from '../reducers/anecdoteReducer'

const Anecdotes = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const handleVote = (id) => {
    dispatch(clickVote(id))
  }
  const sortedAnecdotes =  [...anecdotes].sort((a,b) => b.votes - a.votes)
  
  return (
    <div>
      <ul>
        {sortedAnecdotes.map(anecdote =>
          <li key={anecdote.id}>
            {anecdote.content}
            <br />
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Anecdotes
