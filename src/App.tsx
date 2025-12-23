import { useEffect, useMemo, useState } from 'react'
import Products, { type Product } from './components/Products'
import Header from './components/Header'
import Footer from './components/Footer'
import type { CartItem } from './components/Cart.types'
import Toast from './components/Toast'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<Record<string, CartItem>>({})
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/products.json')
        if (!response.ok) throw new Error('Nie udało się pobrać produktów')

        const data: Product[] = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

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
          <Products
            products={products}
            viewMode={viewMode}
            setViewMode={setViewMode}
            loading={loading}
            error={error}
            page={page}
            setPage={setPage}
            addToCart={(product) => {
              setCart((prev) => {
                const existing = prev[product.id]
                const quantity = existing ? existing.quantity + 1 : 1
                return {
                  ...prev,
                  [product.id]: { product, quantity },
                }
              })
              setToast(`Dodano "${product.title}" do koszyka`)
              setCartOpen(true)
            }}
          />
        </div>
      </main>

      <Footer />

      <Toast message={toast} onClose={() => setToast(null)} />

    </div>
  )
}

export default App
