import type { CartItem } from './Cart.types'

type CartProps = {
  items: CartItem[]
  cartCount: number
  cartTotal: number
  clearCart: () => void
  updateQuantity: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
}

function Cart({
  items,
  cartCount,
  cartTotal,
  clearCart,
  updateQuantity,
  removeFromCart,
}: CartProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Twój koszyk ({cartCount})
        </h2>
        <button
          className="text-sm text-slate-600 underline hover:text-slate-900"
          onClick={clearCart}
          disabled={items.length === 0}
        >
          Wyczyść
        </button>
      </div>

      {items.length === 0 && (
        <p className="mt-4 text-slate-600">Koszyk jest pusty.</p>
      )}

      {items.length > 0 && (
        <div className="mt-4 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {product.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    {(product.price * quantity).toFixed(2)} zł
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center rounded-lg border border-slate-200">
                  <button
                    className="px-3 py-1 text-lg font-semibold text-slate-700 hover:bg-slate-100"
                    onClick={() => updateQuantity(product.id, -1)}
                    aria-label="Zmniejsz ilość"
                  >
                    −
                  </button>
                  <span className="min-w-[48px] text-center text-sm font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    className="px-3 py-1 text-lg font-semibold text-slate-700 hover:bg-slate-100"
                    onClick={() => updateQuantity(product.id, 1)}
                    aria-label="Zwiększ ilość"
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                  onClick={() => removeFromCart(product.id)}
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
            <span className="text-sm uppercase tracking-wide">Razem</span>
            <span className="text-lg font-bold">
              {cartTotal.toFixed(2)} zł
            </span>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Cart


