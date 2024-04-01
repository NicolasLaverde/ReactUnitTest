import {render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SummaryForm from '../SummaryForm'

describe("Form Functionallity works good", () => {

    it("Initial conditions When react is boostrap", () => {
        render(<SummaryForm />)
        const checkBoxElement = screen.getByRole('checkbox', {name: /terms and conditions/i})
        const acceptButtonEl = screen.getByRole('button', {name: /confirm/i})

        //expects the button be disabled at first 
        expect(acceptButtonEl).toBeDisabled()
        expect(checkBoxElement).not.toBeChecked()
    })
    it("CheckBoxElement enables and disables SubmitButton when user checks it", async () => {
        const user = userEvent.setup()

        render(<SummaryForm />)
        const checkBoxElement = screen.getByRole('checkbox', {name: /terms and conditions/i})
        const acceptButtonEl = screen.getByRole('button', {name: /confirm/i})

        //Once the user clicks the checkbox is expected that button be enabled
        await user.click(checkBoxElement)

        expect(acceptButtonEl).toBeEnabled()
        expect(checkBoxElement).toBeChecked()

        await user.click(checkBoxElement)

        expect(acceptButtonEl).toBeDisabled()
        
    })

    it("popover responds to hover", async () => {
        const user = userEvent.setup()
        render(<SummaryForm />)
        // popover starts 

        const nullPopOver = screen.queryByText(/no ice cream will actually be delivered/i)
        expect(nullPopOver).not.toBeInTheDocument()

        // pop over appears once user hover link
        const linkElement = screen.getByText(/terms and conditions/i)
        await user.hover(linkElement)

        const popOver = screen.getByText(/no ice cream will actually be delivered/i)
        expect(popOver).toBeInTheDocument()

        // Popover dissapiars again once user unhover link

        await user.unhover(linkElement)
        const popOverNullAgain  = screen.queryByText(/no ice cream will actually be delivered/i)
        
        expect(popOverNullAgain).not.toBeInTheDocument()

    })
})