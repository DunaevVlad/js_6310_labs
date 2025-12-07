import React from 'react'

export type CartItem = {
  id: string
  imageSrc: string
  title: string
  price: number
  quantity: number
}

export type CartProps = {
  items: CartItem[]
  onCheckout?: () => void
  onRemove?: (id: string) => void
}

export const Cart: React.FC<CartProps> = ({ items, onCheckout, onRemove }) => {
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0)

  return (
    <div style={{ borderRadius: 10, padding: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff' }}>
      <h3 style={{ margin: '0 0 8px 0' }}>Корзина</h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.length === 0 && <div style={{ color: '#666' }}>Корзина пуста</div>}
        {items.map((it) => (
          <div key={it.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 8, borderRadius: 8, background: '#fafafa' }}>
            <img src={it.imageSrc} alt={it.title} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{it.title}</div>
              <div style={{ color: '#777', fontSize: 13 }}>{it.quantity} × {it.price.toFixed(2)} ₽</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontWeight: 700 }}>{(it.price * it.quantity).toFixed(2)} ₽</div>
              <button
                aria-label={`Удалить ${it.title}`}
                type="button"
                onClick={() => onRemove && onRemove(it.id)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#b00020', fontSize: 16 }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: 16 }}>Итого: {total.toFixed(2)} ₽</strong>
        <button type="button" onClick={onCheckout} style={{ padding: '10px 14px', cursor: 'pointer', borderRadius: 8, background: '#2e7d32', color: '#fff', border: 'none' }}>
          К оформлению
        </button>
      </div>
    </div>
  )
}
