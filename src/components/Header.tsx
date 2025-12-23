import Menu from './Menu'
import type { CartItem } from './Cart.types'

type HeaderProps = {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  isCartOpen: boolean
  toggleCart: () => void
  clearCart: () => void
  updateQuantity: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
}

function Header({
  cartItems,
  cartCount,
  cartTotal,
  isCartOpen,
  toggleCart,
  clearCart,
  updateQuantity,
  removeFromCart,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
              🛒
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">
                Mini sklep
              </p>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Mini Sklep
              </h1>
            </div>
          </div>

          <Menu
            cartItems={cartItems}
            cartCount={cartCount}
            cartTotal={cartTotal}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            clearCart={clearCart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        </div>
      </div>
    </header>
  )
}

export default Header

