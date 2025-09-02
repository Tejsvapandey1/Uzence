import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from './InputField'

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
}
export default meta

type Story = StoryObj<typeof InputField>

export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    helperText: 'This is helper text',
    value: '',
    variant: 'outlined',
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    showPasswordToggle: true,
    placeholder: 'Enter password',
  },
}
