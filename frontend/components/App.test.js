// Write your tests here
import React from 'react'
import {render, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import server from '../../backend/mock-server'
import AppFunctional from './AppFunctional'

test('sanity', () => {
  expect(true).toBe(true)
})

describe('AppFunctional component', () => {
  beforeAll(() => {server.listen()})
  afterAll(() => {server.close()})
  
  let email , message , keypad , submit 
  let user 

  beforeEach(() => {
    render(<AppFunctional />)
    user = userEvent.setup()
    email = screen.getByPlaceHolderText('type email')
    submit = screen.getByTestId('submit')
    message = screen.getByTestId('message')
  })


})
