import { logRoles } from '@testing-library/dom' 
import { render, fireEvent } from "@testing-library/react";
import App from "./App";
import { expect } from 'vitest';
import { kebabCaseToTitleCase } from './helpers';

test("button starts with correct color and Text", () => {
  const {getByRole} = render(<App/>)
  const ButtonElement = getByRole("button", {name: /blue/i})
  expect(ButtonElement).toHaveClass('medium-violet-red')
})
test("button starts has  correct color and text after click", () => {
  const {getByRole} = render(<App/>)
  const button = getByRole("button", {name: /blue/i})
  fireEvent.click(button)
  expect(button).toHaveClass('midnight-blue')
  expect(button).toHaveTextContent(/red/i)
})

test("Checkbox is in the page & disables and enables the button when it's clicked", () => {
  //render the App
  const {getByRole} = render(<App/>)

  // Find elements
  const checkbox = getByRole('checkbox')
  const buttonElement = getByRole("button", {name: /blue/i})

  // click on checkbox
  fireEvent.click(checkbox)

  expect(buttonElement).toBeDisabled()
  expect(checkbox).toBeChecked()
  expect(buttonElement).toHaveClass('gray')

  // Click again on checkbox
  fireEvent.click(checkbox)

  expect(buttonElement).toBeEnabled()
  expect(checkbox).not.toBeChecked()
  expect(buttonElement).toHaveClass('medium-violet-red')

})

describe('KebabCaseToTitleCase', () => {
  test("works for no hyphens", () => {
     expect(kebabCaseToTitleCase("red")).toBe("Red")
  })

  test("works for one hyphen", () => {
    expect(kebabCaseToTitleCase("midnight-blue")).toBe("Midnight Blue")
  })

  test("Works for multiple hyphens", () => {
    expect(kebabCaseToTitleCase("medium-violet-red")).toBe("Medium Violet Red")
  })
})
