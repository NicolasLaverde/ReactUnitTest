import {render, screen} from '../../../test-utils/testing-library-utils'
import userEvent from '@testing-library/user-event'

import Options from '../Options'
import ScoopOption from '../ScoopOptions'

test('displays image for each scoop option from the server', async () => {
    render(<Options optionType="scoops" />)

    const scoopImages = await screen.findAllByRole('img')
    expect(scoopImages).toHaveLength(2)

    // confirm alt text images
    const altText = scoopImages.map(element => element.alt)
    expect(altText).toEqual(['Chocolate scoop', 'Vanilla scoop'])
})

test('Display toopings for each iceCreem option user selects', async () => {
    render(<Options optionType="toppings" />)

    const toopingsImages = await screen.findAllByRole('img')
    expect(toopingsImages).toHaveLength(3)

    const altTextTooopings = toopingsImages.map(element => element.alt)
    expect(altTextTooopings).toEqual(['Cherries topping', 'M&Ms topping', 'Hot fudge topping'])
})


test('border Input in red Color when user entered a negative number', async () => {
    const user = userEvent.setup()
    render(<ScoopOption />)

    const vanillaInput = screen.getByRole('spinbutton')
    await user.clear(vanillaInput)
    await user.type(vanillaInput, "-1")

    expect(vanillaInput).toHaveClass('is-invalid')

    await user.clear(vanillaInput)
    await user.type(vanillaInput, "1")

    expect(vanillaInput).not.toHaveClass('is-invalid')

    await user.clear(vanillaInput)
    await user.type(vanillaInput, "-10")

    expect(vanillaInput).toHaveClass('is-invalid')
})

test('When user fill-in an invalid input do not update the total scoops', async () => {
    const user = userEvent.setup()
    render(<Options optionType="scoops" />)

    const scoopsSubtotal = screen.getByText('Scoops total: $', {exact: false})
    expect(scoopsSubtotal).toHaveTextContent('0.00')

    const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
    await user.clear(vanillaInput)
    await user.type(vanillaInput, "1")

    expect(scoopsSubtotal).toHaveTextContent('2.00')

    await user.clear(vanillaInput)
    await user.type(vanillaInput, "-3")

    expect(scoopsSubtotal).toHaveTextContent('0.00')

    await user.clear(vanillaInput)
    await user.type(vanillaInput, "2")

    expect(scoopsSubtotal).toHaveTextContent('4.00')
})