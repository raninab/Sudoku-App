const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')



const encodeParams = (params) => 
  Object.keys(params)
  .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
  .join('&');

export function fetchBoard(difficulty) {
  return (dispatch) => {
    fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
    .then(res => res.json())  
    .then(data => {
      dispatch({
        type: 'FETCH_BOARD',
        payload: {
          board: data.board
        }
      })
    })
    .catch(err => console.log(err, "<<< err"));
  }
}

export function validateServer(board) {
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encodeParams({board})
  }
  return (dispatch) => {
    fetch(`https://sugoku.herokuapp.com/validate`, data)
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: 'SET_STATUS',
        payload: {
          status: data.status,
          alert: data.status !== 'solved'
        }
      })
    })
    .catch(err => console.log(err));
  }
}

export function solve(template) {
  return (dispatch) => {
    fetch('https://sugoku.herokuapp.com/solve', {
      method: 'POST',
      body: encodeParams({board: template}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: 'GIVE_UP',
          payload: {
            solution: data.solution
          }
        })
      })
      .catch(err => console.log(err));
  }
}

export function setPlayerAction(nickname) {
  return {
    type: 'SET_PLAYER',
    payload: {
      nickname
    }
  }
}

export function setStatus(status) {
  return {
    type: 'SET_STATUS',
    payload: {
      status
    }
  }
}

export function setDifficulty(difficulty) {
  return {
    type: 'SET_DIFFICULTY',
    payload: {
      difficulty
    }
  }
}

export function setAlert(value) {
  return {
    type: 'SET_ALERT',
    payload: {
      value
    }
  }
}