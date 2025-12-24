import { Dispatch, SetStateAction, useMemo } from 'react'

export type Product = {
  id: string
  title: string
  description: string
  price: number
  image: string
}

const PRODUCTS_PER_PAGE = import.meta.env.VITE_PRODUCTS_PER_PAGE ? Number(import.meta.env.VITE_PRODUCTS_PER_PAGE) : 6

type ViewMode = 'grid' | 'list'

type ProductsProps = {
  products: Product[]
  viewMode: ViewMode
  setViewMode: Dispatch<SetStateAction<ViewMode>>
  loading: boolean
  error: string | null
  page: number
  setPage: Dispatch<SetStateAction<number>>
  addToCart: (product: Product) => void
}

function Products({
  products,
  viewMode,
  setViewMode,
  loading,
  error,
  page,
  setPage,
  addToCart,
}: ProductsProps) {
  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE))

  const currentProducts = useMemo(() => {
    const start = (page - 1) * PRODUCTS_PER_PAGE
    return products.slice(start, start + PRODUCTS_PER_PAGE)
  }, [page, products])

  const handleChangePage = (nextPage: number) => {
    setPage((current) =>
      Math.min(Math.max(typeof nextPage === 'number' ? nextPage : current, 1), totalPages),
    )
  }

  const isGrid = viewMode === 'grid'

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Produkty ({products.length || '-'})
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 shadow-sm">
            <button
              className={`px-4 py-2 text-sm font-medium transition ${
                isGrid
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => setViewMode('grid')}
              aria-pressed={isGrid}
            >
              Siatka
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition ${
                !isGrid
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => setViewMode('list')}
              aria-pressed={!isGrid}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      <section className="mt-8">
        {loading && <p className="text-slate-600">Ładowanie produktów...</p>}

        {error && (
          <p className="text-red-600">
            Ups! {error}. Odśwież stronę aby spróbować ponownie.
          </p>
        )}

        {!loading && !error && currentProducts.length === 0 && (
          <p className="text-slate-600">Brak produktów do wyświetlenia.</p>
        )}

        {!loading && !error && currentProducts.length > 0 && (
          <div
            className={
              isGrid
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                : 'flex flex-col gap-4'
            }
          >
            {currentProducts.map((product) => (
              <article
                key={product.id}
                className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isGrid ? '' : 'flex gap-4 sm:gap-6'
                }`}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className={
                    isGrid
                      ? 'h-40 w-full object-cover'
                      : 'h-32 w-32 flex-none object-cover sm:h-40 sm:w-40'
                  }
                  loading="lazy"
                />

                <div className="flex h-full flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {product.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {product.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white min-w-24 text-center sm:min-w-24">
                      <strong>{product.price.toFixed(2)} zł</strong>
                    </span>
                  </div>

                  <button
                    className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    onClick={() => addToCart(product)}
                  >
                    ➕ Dodaj
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {!loading && !error && products.length > 0 && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 1}
          >
            Poprzednia
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1
            const isActive = pageNumber === page
            return (
              <button
                key={pageNumber}
                className={`h-10 w-10 rounded-lg border text-sm font-semibold transition ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => handleChangePage(pageNumber)}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            )
          })}

          <button
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleChangePage(page + 1)}
            disabled={page === totalPages}
          >
            Następna
          </button>
        </nav>
      )}
    </>
  )
}

export default Products