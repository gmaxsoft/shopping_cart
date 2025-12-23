import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import type { CartItem } from './components/Cart.types'

//const PRODUCTS_PER_PAGE = import.meta.env.VITE_PRODUCTS_PER_PAGE || 6

function App() {

  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<Record<string, CartItem>>({})

  const cartItems = useMemo(() => Object.values(cart), [cart])
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )
  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0,
      ),
    [cartItems],
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        cartItems={cartItems}
        cartCount={cartCount}
        cartTotal={cartTotal}
        isCartOpen={cartOpen}
        toggleCart={() => setCartOpen((prev) => !prev)}
        clearCart={() => setCart({})}
        updateQuantity={(productId, delta) => {
          setCart((prev) => {
            const item = prev[productId]
            if (!item) return prev
            const nextQty = item.quantity + delta
            if (nextQty <= 0) {
              const { [productId]: _, ...rest } = prev
              return rest
            }
            return {
              ...prev,
              [productId]: { ...item, quantity: nextQty },
            }
          })
        }}
        removeFromCart={(productId) => {
          setCart((prev) => {
            const { [productId]: _, ...rest } = prev
            return rest
          })
        }}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">

        </div>
      </main>

      <Footer />

    </div>
  )
}

export default App
