import {render, screen} from '../../../test-utils/testing-library-utils'
import userEvent from '@testing-library/user-event'
import Options from '../Options'
import { expect } from 'vitest'
import OrderEntry from '../OrderEntry'

test("update scoop subtotal when scoops change", async () => {
    const userInstance = userEvent.setup()
    render (<Options optionType="scoops" />)

    // make sure total starts out at $0.00
    const scoopsSubtotal = screen.getByText('Scoops total: $', {exact: false})
    expect(scoopsSubtotal).toHaveTextContent('0.00')

    // update vanilla scoops to 1, and check subtotal
    const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})

    await userInstance.clear(vanillaInput)
    await userInstance.type(vanillaInput, '1')

    expect(scoopsSubtotal).toHaveTextContent("2.00")

    //update chocolate scoops to 2 and check subtotal

    const chocolateInput = await screen.findByRole("spinbutton", {name: 'Chocolate'})

    await userInstance.clear(chocolateInput)
    await userInstance.type(chocolateInput, '2')
    
    expect(scoopsSubtotal).toHaveTextContent('6.00')
})

test("update toppings subtotal when toopings change", async () => {
    const userInstance = userEvent.setup()
    render(<Options optionType="toppings" />)

    const toppingsTotal = screen.getByText("Toppings total: $", {exact: false})
    expect(toppingsTotal).toHaveTextContent('0.00')

    const cherriesToppings = await screen.findByRole('checkbox', {name: 'Cherries'})

    await userInstance.click(cherriesToppings)
    expect(toppingsTotal).toHaveTextContent("1.50")

    const hotFudgeCheckbox = await screen.findByRole('checkbox', {name: 'Hot fudge'})
    await userInstance.click(hotFudgeCheckbox)
    expect(toppingsTotal).toHaveTextContent('3.00')

    await userInstance.click(hotFudgeCheckbox)
    expect(toppingsTotal).toHaveTextContent('1.50')
})

describe("Gran total", () => {
    test('Grand total starts at $0.00', () => {
        render(<OrderEntry />)

        const grandTotal = screen.getByRole('heading', {name: /Grand total/i})
        expect(grandTotal).toHaveTextContent("0.00")
        
    })
    test('Grand total updates properly if scoop is added first', async () => {
        const user = userEvent.setup()
        render(<OrderEntry />)
        const grandTotal = screen.getByRole("heading", {name: /Grand total/i})
        
        const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
        const cherriesToppings = await screen.findByRole('checkbox', {name: 'Cherries'})

        // add 2 vanilla ice creams 
        await user.clear(vanillaInput)
        await user.type(vanillaInput, '2')
        expect(grandTotal).toHaveTextContent("4.00")

        // add 1 toppings 
        await user.click(cherriesToppings)

        expect(grandTotal).toHaveTextContent("5.50")

    })
    test('Grand total updates properly if topping is added first', async () => {
        const user = userEvent.setup()
        render(<OrderEntry />)
        const grandTotal = screen.getByRole("heading", {name: /Grand total:/i})
        
        const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
        const cherriesToppings = await screen.findByRole('checkbox', {name: 'Cherries'})

        // add 1 toppings 
        await user.click(cherriesToppings)

        expect(grandTotal).toHaveTextContent("1.50")

        // add 2 vanilla ice creams 
        await user.clear(vanillaInput)
        await user.type(vanillaInput, '2')
        expect(grandTotal).toHaveTextContent("5.50")
    })
    test('Grand total updates properly if item is removed', async() => {
        const user = userEvent.setup()
        render(<OrderEntry />)
        const grandTotal = screen.getByRole("heading", {name: /Grand total:/i})
        
        const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
        const cherriesToppings = await screen.findByRole('checkbox', {name: 'Cherries'})

        // add 1 toppings 
        await user.click(cherriesToppings)

        expect(grandTotal).toHaveTextContent("1.50")

        // add 2 vanilla ice creams 
        await user.clear(vanillaInput)
        await user.type(vanillaInput, '2')
        expect(grandTotal).toHaveTextContent("5.50")

        await user.click(cherriesToppings)
        expect(grandTotal).toHaveTextContent('4.00')
    })

})