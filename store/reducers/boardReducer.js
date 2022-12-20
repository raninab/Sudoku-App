const initialState = {
  board: [],
  status: 'unsolved',
  player: '',
  difficulty: 'easy',
  solution: [],
  alert: false
}



function boardReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_BOARD':
      return {
        ...state,
        board: action.payload.board,
        status: 'unsolved'
      }
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload.status,
        alert: action.payload.alert
      }
    case 'GIVE_UP':
      return {
        ...state,
        solution: action.payload.solution,
        status: 'give up'
      }
    case 'SET_PLAYER':
      return {
        ...state,
        player: action.payload.nickname
      }
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload.difficulty
      }
    case 'SET_ALERT':
      return {
        ...state,
        alert: action.payload.value
      }  
    default:
      return state;
  }
}

export default boardReducer;