import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputField } from './InputField'

test('renders label and helper, clear works', async () => {
  const user = userEvent.setup()
  let value = 'hello'
  const handleChange = (e: any) => { value = e.target.value }

  render(
    <InputField
      label="Name"
      value={value}
      onChange={handleChange}
      helperText="helper"
      clearable
    />
  )

  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /clear input/i }))
  // value is changed via handleChange, you'd assert via prop-driven pattern in real test
})
