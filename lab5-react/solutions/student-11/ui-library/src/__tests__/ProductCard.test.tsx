import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '../components/ProductCard'

describe('ProductCard', () => {
  it('renders props and calls onAdd', () => {
    const onAdd = jest.fn()
    render(
      <ProductCard
        id="p1"
        imageSrc="/img.png"
        title="Test product"
        description="Nice"
        price={123}
        onAdd={onAdd}
      />
    )

    expect(screen.getByText('Test product')).toBeInTheDocument()
    expect(screen.getByText('Nice')).toBeInTheDocument()
    expect(screen.getByText('123.00 ₽')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Добавить в корзину/i }))
    expect(onAdd).toHaveBeenCalledWith('p1')
  })
})
