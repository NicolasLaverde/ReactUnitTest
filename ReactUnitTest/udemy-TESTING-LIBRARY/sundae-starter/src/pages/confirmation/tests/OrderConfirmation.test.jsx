import {http, HttpResponse} from 'msw'
import {server} from '../../../mocks/server'

import {render, screen} from '../../../test-utils/testing-library-utils'
import OrderConfirmation from '../OrderConfirmation'

test("handles error for scoops and toppings routes", async () => {
    server.resetHandlers(
        http.post("http://localhost:3030/order", () => {
            return new HttpResponse(null, {status: 500})
        }),
    )

    render(<OrderConfirmation/>)

    const alert = await screen.findByRole("alert")
    expect(alert).toHaveTextContent("An unexpected error occurred. Please try again later.")
})
