import React, {useState, useEffect} from 'react'
import * as yup from 'yup'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const userSchema = yup.object().shape({
  x: yup.number().min(1).max(3).required(),
  y: yup.number().min(1).max(3).required(),
  steps: yup.number().required(),
  email: yup.string().email().required()
})

const getInitialValues = () => ({
  x: 2,
  y: 2, 
  steps: initialSteps,
  email: initialEmail,
})


export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const[values, setValues] = useState(getInitialValues())
  const [position, setPosition] = useState({x: 2 , y: 2})
  const [count, setCount] = useState(initialSteps)
  const [index , setIndex] = useState(initialIndex)


  
  const [serverSuccess, setServerSuccess] = useState()
  const [serverFailure, setServerFailure] = useState()

  const [buttonClick, setButtonClick] = useState(false)


  useEffect(() => {
    const newIndex = position.y * 3 + position.x - 4
    setIndex(newIndex)
  }, [position])

 
  function getXY() {
    
  
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }


  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  //   if (position.x < 1) {
  //     return "You can't go left"
  // } else if (position.x === 3) {
  //     return "You can't go right"
  // } else if (position.y === 1) {
  //     return "You can't go up";
  // } else if (position.y === 3) {
  //     return "You can't go down"

  
  if(!setButtonClick){
    return `You can't move ${direction}`
  }

}

  function getNextIndex() {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    const direction = evt.target.id
    let xValue = position.x
    let yValue = position.y 


    if(direction === 'left' ){
      xValue = Math.max(xValue - 1, 1)
    }else if(direction === 'up'){
      yValue = Math.max(yValue - 1, 1)
    }else if(direction === 'right'){
      xValue = Math.min(xValue + 1, 3)
    }else if (direction === 'down'){
      yValue = Math.min(yValue + 1, 3)
    }
    setPosition({x: xValue, y: yValue})
    setCount(count + 1)
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function reset() {
    setPosition({ x : 2 , y : 2})
    setCount(initialSteps)
    setServerSuccess('')
    setValues({...values, email: initialEmail})
    // Use this helper to reset all states to their initial values.
   
  }

  function onChange(evt) {
   setValues({...values, email: evt.target.value})
    // You will need this to update the value of the input.
  }



  function onSubmit(evt) {
    evt.preventDefault()
    axios.post('http://localhost:9000/api/result', values )
    .then(res =>{
      setServerSuccess(res.data.message)
      setValues({email: initialEmail})
      setButtonClick(false)
    })
    .catch(err => {
      setServerFailure(err.response.data.message)
      setServerSuccess()
    })
    .finally(() => {
      setValues(getInitialValues())
    })
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({position.x}, {position.y})</h3>
        <h3 id="steps">You moved {count} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        } 
      </div>
      <div className="info">
        <h3 id="message"> {serverSuccess} </h3>
        
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit = {onSubmit}>
        <input onChange={onChange} value = {values.email} id="email" type="email" placeholder="type email" ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}

