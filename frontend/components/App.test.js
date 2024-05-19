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
  
  let email , submit, resetBtn, rightBtn
  let user

  beforeEach(() => {
    render(<AppFunctional />)
    user = userEvent.setup()
    email = screen.getByPlaceholderText('type email')
    resetBtn = screen.getByText('reset')
    rightBtn = screen.getByText('RIGHT')
  })

  test('email input acquire correct values when typed on ', async() => {
    await user.type(email, 'lady@gaga.com')
    expect(email).toHaveValue('lady@gaga.com')
  })

  test('when right button clicked, B moves right on grid' , async () => {
    await user.click(rightBtn)
    expect(screen.getByText('You moved 1 time'))
  })

  test('shows error when email is not provided', async () => {
    await user.click(submit)
    expect(screen.queryByText('Ouch: email is required')).toBeInTheDocument
  })

  test('reset grid', async () => {
    await user.click(screen.getByText('LEFT'))
    await user.click(resetBtn)
    expect(screen.getByText('Coordinates (2, 2)')).toBeVisible()
    expect(screen.getByText('You moved 0 times')).toBeVisible()
  })

  test('does not let you move right outside of grid', async() => {
    await user.click(rightBtn)
    await user.click(rightBtn)
    expect(screen.getByText("You can't go right"))
  })


})
