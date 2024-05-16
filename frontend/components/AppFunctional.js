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

  useEffect(() => {
    const newIndex = position.y * 3 + position.x - 4
    setIndex(newIndex)
  }, [position])

 
  // function getXY() {
    
  
  //   // It it not necessary to have a state to track the coordinates.
  //   // It's enough to know what index the "B" is at, to be able to calculate them.
  // }


//   function getXYMessage() {
//     // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
//     // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
//     // returns the fully constructed string.

// }

  // function getNextIndex() {
  //   // This helper takes a direction ("left", "up", etc) and calculates what the next index
  //   // of the "B" would be. If the move is impossible because we are at the edge of the grid,
  //   // this helper should return the current index unchanged.
  // }

  function move(direction) {
    let xValue = position.x
    let yValue = position.y 
    if (direction === 'left' && xValue === 1) {
      setServerFailure("You can't move left")
    } else if (direction === 'up' && yValue === 1) {
      setServerFailure("You can't move up")
    } else if (direction === 'right' && xValue === 3) {
      setServerFailure("You can't move right")
    } else if (direction === 'down' && yValue === 3) {
      setServerFailure("You can't move down")
    } else {
      xValue += (direction === 'left' ? -1 : direction === 'right' ? 1 : 0)
      yValue += (direction === 'up' ? -1 : direction === 'down' ? 1 : 0)
      setPosition({ x: xValue, y: yValue })
      setCount(count + 1)
      setServerSuccess('')
      setServerFailure('')
    }
  
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function reset() {
    setPosition({ x : 2 , y : 2})
    setCount(initialSteps)
    setServerSuccess('')
    setServerFailure('')
    setValues(getInitialValues())
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
      setValues(getInitialValues())
      //setValues({email: initialEmail})
    })
    .catch(err => {
      if(serverFailure){
      setServerFailure(`You can't move ${err.request.responseURL}`)
      }else{
      setServerSuccess('')
      }
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
        <h3 id="message"> {!serverSuccess ? serverFailure: serverSuccess} </h3>
        
      </div>
      <div id="keypad">
        <button id="left" onClick={()=>move('left')}>LEFT</button>
        <button id="up" onClick={()=>move('up')}>UP</button>
        <button id="right" onClick={()=>move('right')}>RIGHT</button>
        <button id="down" onClick={()=>move('down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit = {onSubmit}>
        <input onChange={onChange} value = {values.email} id="email" type="email" placeholder="type email" ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}

