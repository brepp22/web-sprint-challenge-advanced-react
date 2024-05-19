import React, {useState, useEffect} from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const getInitialValues = () => ({
  x: 2,
  y: 2, 
  steps: initialSteps,
  email: initialEmail,
  message: initialMessage
})


export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const[values, setValues] = useState(getInitialValues())
  const [position, setPosition] = useState({x: 2 , y: 2})
  const [count, setCount] = useState(initialSteps)
  const [index , setIndex] = useState(initialIndex)


  
 const[serverResponse, setServerResponse] = useState('')

  useEffect(() => {
    const newIndex = position.y * 3 + position.x - 4
    setIndex(newIndex)
  }, [position])

  function move(direction) {
    setServerResponse('')

    let xValue = position.x
    let yValue = position.y 

    if (direction === 'left' && xValue === 1) {
      setServerResponse("You can't go left")
    } else if (direction === 'up' && yValue === 1) {
      setServerResponse("You can't go up")
    } else if (direction === 'right' && xValue === 3) {
      setServerResponse("You can't go right")
    } else if (direction === 'down' && yValue === 3) {
      setServerResponse("You can't go down")
    } else {
      xValue += (direction === 'left' ? -1 : direction === 'right' ? 1 : 0)
      yValue += (direction === 'up' ? -1 : direction === 'down' ? 1 : 0)
      setPosition({ x: xValue, y: yValue })
      setCount(count + 1)
    }
  
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function reset() {
    setPosition({ x : 2 , y : 2})
    setCount(initialSteps)
    setServerResponse('')
    setValues(getInitialValues())
    // Use this helper to reset all states to their initial values.
   
  }

  function onChange(evt) {
   setValues({...values, email: evt.target.value})
    // You will need this to update the value of the input.
  }



  function onSubmit(evt) {
    evt.preventDefault()
    if(!values.email){
      setServerResponse("Ouch: email is required")
      return
    }

    const updatedValues = {
      ...values,
      x: position.x,
      y: position.y,
      steps: count
    }


    axios.post('http://localhost:9000/api/result', updatedValues )
    .then(res =>{
      setServerResponse(res.data.message)
      console.log(res.data)
      setValues(getInitialValues())
    })
    .catch(err => {
      if(err.response && err.response.status === 403){
        setServerResponse(err.response.data.message)
        //console.log(err.response)
      }else{
        setServerResponse(err.response.data.message)
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
        <h3 id="steps">You moved {count} {count === 1 ? 'time' : 'times'}</h3>
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
        <h3 id="message">{serverResponse}</h3>
        
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

