import {http, HttpResponse} from 'msw'
import {server} from '../../../mocks/server'

import {render, screen} from '../../../test-utils/testing-library-utils'
import userEvent from '@testing-library/user-event'
import OrderEntry from '../OrderEntry'

test("handles error for scoops and toppings routes", async () => {
    server.resetHandlers(
        http.get("http://localhost:3030/scoops", () => {
            return new HttpResponse(null, {status: 500})
        }),
        http.get("http://localhost:3030/toppings", () => {
            return new HttpResponse(null, {status: 500})
        })
    )

    render(<OrderEntry/>)

    const alerts = await screen.findAllByText('An unexpected error occurred. Please try again later.')
    expect(alerts).toHaveLength(2)
})

test("disabled Order Sundae button if there's no scoops selected", async () => {
    const user = userEvent.setup()
    render(<OrderEntry />)

    const scoopsSubtotal = screen.getByText('Scoops total: $', {exact: false})
    expect(scoopsSubtotal).toHaveTextContent('0.00')
    
    // First I didn't select any scoop so then orderButton should be disabled
    const orderButtonEl = screen.getByRole('button', {name: /Order/i})
    expect(orderButtonEl).toBeInTheDocument()
    expect(orderButtonEl).toBeDisabled()

    // Then I select 1 vanilla scoop so Button should be enabled
    const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'})
    await user.clear(vanillaInput)
    await user.type(vanillaInput, "1")

    expect(screen.getByText('Scoops total: $', {exact: false})).toHaveTextContent('2.00')
    expect(orderButtonEl).toBeEnabled()

    // Finally I delete my previous selection of Vanilla scoop so button should be disabled again
    await user.clear(vanillaInput)
    await user.type(vanillaInput, "0")
    expect(orderButtonEl).toBeDisabled()

})