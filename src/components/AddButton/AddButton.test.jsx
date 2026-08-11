import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddButton from './AddButton.jsx'

describe('AddButton', () => {
  it('renders the action label and calls onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<AddButton onClick={onClick} />)

    const button = screen.getByRole('button', {
      name: 'New Entry',
    })

    await user.click(button)

    expect(button).toBeInTheDocument()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
