import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Cart } from '../components/Cart'

describe('Cart', () => {
  it('renders items, total, handles checkout and removal', () => {
    const onCheckout = jest.fn()
    const onRemove = jest.fn()
    const items = [
      { id: 'a', imageSrc: '/a.png', title: 'A', price: 10, quantity: 2 },
      { id: 'b', imageSrc: '/b.png', title: 'B', price: 5, quantity: 1 }
    ]
    render(<Cart items={items} onCheckout={onCheckout} onRemove={onRemove} />)

    expect(screen.getByText('Корзина')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('Итого: 25.00 ₽')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /К оформлению/i }))
    expect(onCheckout).toHaveBeenCalled()

    // removal button should call onRemove with id
    fireEvent.click(screen.getByLabelText('Удалить A'))
    expect(onRemove).toHaveBeenCalledWith('a')
  })
})
