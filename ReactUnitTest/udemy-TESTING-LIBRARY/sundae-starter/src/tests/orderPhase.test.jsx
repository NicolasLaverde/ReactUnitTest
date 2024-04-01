import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'
import { expect } from 'vitest'
import { server } from '../mocks/server'
import { HttpResponse, http } from 'msw'

test('order phases for happy path', async () => {
    const user = userEvent.setup()
    // render the app
    render(<App />)

    // add ice cream scoops and toppings
    const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
    await user.clear(vanillaInput)
    await user.type(vanillaInput, "2")

    const cherriesToppings = await screen.findByRole('checkbox', {name: 'Cherries'})
    const hotFudgeTopping = await screen.findByRole('checkbox', {name: 'Hot fudge'})
    await user.click(cherriesToppings)
    await user.click(hotFudgeTopping)

    const scoopsSubtotal = screen.getByText('Scoops total: $', {exact: false})
    const toppingsSubtotal = screen.getByText('Toppings total: $', {exact: false})
    expect(scoopsSubtotal).toHaveTextContent('4.00')
    expect(toppingsSubtotal).toHaveTextContent('3.00')

    // find and click order button

    const orderButtonEl = screen.getByRole('button', {name: /Order/i})
    expect(orderButtonEl).toBeInTheDocument()
    await user.click(orderButtonEl)

    // check summary information based on order
    const orderSummaryText = screen.getByRole('heading', {name: /Order summary/i})
    expect(orderSummaryText).toHaveTextContent("Order Summary")
    
    const scoopsSummaryInfo = screen.getByRole("heading", {name: /Scoops/i})
    expect(scoopsSummaryInfo).toHaveTextContent("4.00")
    expect(screen.getByText('2 Vanilla')).toBeInTheDocument()

    const toppingsSummaryInfo = screen.getByRole("heading", {name: /Toppings/i})
    expect(toppingsSummaryInfo).toHaveTextContent("3.00")
    expect(screen.getByText('Cherries')).toBeInTheDocument()

    // accept terms and conditions and click button to confirm the order

    const termsAndConditionsCB = screen.getByRole('checkbox', {name: /terms and conditions/i})
    const acceptOrderBttn = screen.getByRole('button', {name: /confirm/i})

    await user.click(termsAndConditionsCB)
    await user.click(acceptOrderBttn)

    //Expect "loading" to show
    const loading = screen.getByText(/loading/i)
    expect(loading).toBeInTheDocument()

    // confirm order number on confirmation page

    const thankYouHeader = await screen.findByRole('heading', { name: /thank you/i })
    expect(thankYouHeader).toBeInTheDocument()

    const textOrderNumber = await screen.findByText('Your order number', {exact: false})
    expect(textOrderNumber).toHaveTextContent("10")

    // click new order button on confirmation page
    const newOrderBttn = screen.getByRole('button', {name: /new Order/i})
    await user.click(newOrderBttn)

    // check that scoop and toppings subtotals have been reset
    const scoopsSubtotal2 = screen.getByText('Scoops total: $', {exact: false})
    const toppingsSubtotal2 = screen.getByText('Toppings total: $', {exact: false})

    expect(scoopsSubtotal2).toHaveTextContent('0.00')
    expect(toppingsSubtotal2).toHaveTextContent('0.00')

})

it("Toppings header is not on summary page if no toppings ordered", async () => {
    const user = userEvent.setup()
    render(<App />)

    //user selects scoops but not toppings
    const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
    await user.clear(vanillaInput)
    await user.type(vanillaInput, "3")

    const orderButtonEl = screen.getByRole('button', {name: /Order/i})
    expect(orderButtonEl).toBeInTheDocument()
    await user.click(orderButtonEl)

    // check toppings is not in summary Page
    const toppingsText = screen.queryByRole('heading', {name: /Toppings/i})
    expect(toppingsText).not.toBeInTheDocument()
})  
it("Toppings header is not on summary page if toppings are ordered and then removed", async () => {
    const user = userEvent.setup()
    render(<App />)

    //user selects scoops but not toppings
    const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
    await user.clear(vanillaInput)
    await user.type(vanillaInput, "3")

    const cherriesToppings = await screen.findByRole('checkbox', {name: 'Cherries'})
    await user.click(cherriesToppings)
    expect(cherriesToppings).toBeChecked()

    const toppingsSubtotal = screen.getByText('Toppings total: $', {exact: false})
    expect(toppingsSubtotal).toHaveTextContent('1.50')

    await user.click(cherriesToppings)
    expect(cherriesToppings).not.toBeChecked()
    expect(toppingsSubtotal).toHaveTextContent('0.00')

    const orderButtonEl = screen.getByRole('button', {name: /Order/i})
    expect(orderButtonEl).toBeInTheDocument()
    await user.click(orderButtonEl)

    // check toppings is not in summary Page
    const toppingsText = screen.queryByRole('heading', {name: /Toppings/i})
    expect(toppingsText).not.toBeInTheDocument()
})  