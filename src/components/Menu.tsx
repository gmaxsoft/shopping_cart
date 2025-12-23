import { useEffect, useRef } from 'react'
import Cart from './Cart'
import type { CartItem } from './Cart.types'

type MenuProps = {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  isCartOpen: boolean
  toggleCart: () => void
  clearCart: () => void
  updateQuantity: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
}

function Menu({
  cartItems,
  cartCount,
  cartTotal,
  isCartOpen,
  toggleCart,
  clearCart,
  updateQuantity,
  removeFromCart,
}: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        if (isCartOpen) {
          toggleCart()
        }
      }
    }

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCartOpen, toggleCart])

  return (
    <div ref={menuRef} className="relative">
      <button
        className="relative inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        onClick={toggleCart}
        aria-expanded={isCartOpen}
        aria-label="Otwórz koszyk"
      >
        <span className="text-lg">🛍️</span>
        <span>Koszyk</span>
        {cartCount > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-slate-900">
            {cartCount}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div className="absolute right-0 z-50 mt-2 w-96 max-w-[calc(100vw-2rem)]">
          <Cart
            items={cartItems}
            cartCount={cartCount}
            cartTotal={cartTotal}
            clearCart={clearCart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        </div>
      )}
    </div>
  )
}

export default Menu