import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterButton from './FilterButton.jsx'

describe('FilterButton', () => {
  it('renders the current value and propagates user typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <FilterButton
        value=""
        onChange={onChange}
      />,
    )

    const input = screen.getByRole('searchbox', {
      name: 'Filter table records',
    })

    await user.type(input, 'abc')

    expect(input).toHaveAttribute(
      'placeholder',
      'Filter records...',
    )
    expect(onChange).toHaveBeenNthCalledWith(1, 'a')
    expect(onChange).toHaveBeenNthCalledWith(2, 'b')
    expect(onChange).toHaveBeenNthCalledWith(3, 'c')
  })
})
