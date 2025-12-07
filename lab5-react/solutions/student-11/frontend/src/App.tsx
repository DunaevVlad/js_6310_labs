import React, { useEffect, useState } from 'react'
import { ProductCard, Cart, CartItem } from '@student-11/ui-library'

const demoProducts = [
  {
    id: 'p1',
    imageSrc: 'https://picsum.photos/id/1062/800/600',
    title: 'Aurora Coffee Beans',
    description: 'Ароматные обжаренные зерна с нотами карамели и темного шоколада. 250 г.',
    price: 799
  },
  {
    id: 'p2',
    imageSrc: 'https://picsum.photos/id/1005/800/600',
    title: 'Lumen Desk Lamp',
    description: 'Минималистичная настольная лампа с тёплым светом и регулировкой яркости.',
    price: 2490
  },
  {
    id: 'p3',
    imageSrc: 'https://picsum.photos/id/1011/800/600',
    title: 'Nordic Wool Scarf',
    description: 'Тёплый шарф из мягкой шерсти, приятный к коже, размер 190×30 см.',
    price: 1299
  },
  {
    id: 'p4',
    imageSrc: 'https://picsum.photos/id/1025/800/600',
    title: 'Citrus Hand Soap',
    description: 'Натуральное мыло с экстрактом цитрусовых, освежающее и мягкое для рук.',
    price: 349
  }
]

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('student11.cart')
      if (!raw) return []
      return JSON.parse(raw) as CartItem[]
    } catch {
      return []
    }
  })

  const handleAdd = (id: string) => {
    const p = demoProducts.find((x) => x.id === id)
    if (!p) return
    setCart((prev) => {
      const exists = prev.find((it) => it.id === id)
      if (exists) {
        return prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it))
      }
      return [...prev, { id: p.id, imageSrc: p.imageSrc, title: p.title, price: p.price, quantity: 1 }]
    })
  }

  const handleCheckout = () => {
    setCart([])
    alert('Оформление (демо)')
  }

  const handleRemove = (id: string) => {
    setCart((prev) => prev.filter((it) => it.id !== id))
  }

  // persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('student11.cart', JSON.stringify(cart))
    } catch {
      // ignore
    }
  }, [cart])

  return (
    <div style={{ padding: 24, display: 'grid', gap: 24, background: '#f4f6f8', minHeight: '100vh' }}>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {demoProducts.map((p) => (
          <div key={p.id} style={{ padding: 8 }}>
            <ProductCard id={p.id} imageSrc={p.imageSrc} title={p.title} description={p.description} price={p.price} onAdd={handleAdd} />
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 720, justifySelf: 'center', width: '100%' }}>
        <Cart items={cart} onCheckout={handleCheckout} onRemove={handleRemove} />
      </div>
    </div>
  )
}

export default App
