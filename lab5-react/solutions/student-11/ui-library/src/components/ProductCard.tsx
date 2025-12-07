import React from 'react'

export type ProductCardProps = {
  id: string
  imageSrc: string
  title: string
  description: string
  price: number
  onAdd: (id: string) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageSrc,
  title,
  description,
  price,
  onAdd
}) => {
  return (
    <div style={{
      borderRadius: 10,
      padding: 12,
      maxWidth: 320,
      width: '100%',
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ overflow: 'hidden', borderRadius: 8 }}>
        <img src={imageSrc} alt={title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: '10px 0', flex: 1 }}>
        <h3 style={{ margin: '6px 0' }}>{title}</h3>
        <p style={{ margin: '6px 0', color: '#555', fontSize: 14 }}>{description}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <strong style={{ fontSize: 16 }}>{price.toFixed(2)} ₽</strong>
        <button type="button" onClick={() => onAdd(id)} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none' }}>
          Добавить в корзину
        </button>
      </div>
    </div>
  )
}
