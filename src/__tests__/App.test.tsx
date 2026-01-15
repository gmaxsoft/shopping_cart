import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock fetch
const mockFetch = vi.fn()

const mockProducts = [
  {
    id: '1',
    title: 'Product 1',
    description: 'Description 1',
    price: 19.99,
    image: '/product-1.jpg',
  },
  {
    id: '2',
    title: 'Product 2',
    description: 'Description 2',
    price: 29.99,
    image: '/product-2.jpg',
  },
]

describe('App', () => {
  beforeEach(() => {
    globalThis.fetch = mockFetch as typeof fetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderuje header z logo', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Mini Sklep')).toBeInTheDocument()
    })
  })

  it('renderuje footer', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Copyrights Maxsoft. All rights reserved.')).toBeInTheDocument()
    })
  })

  it('ładuje produkty z API', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledWith('/products.json')
  })

  it('wyświetla komunikat ładowania podczas pobierania produktów', () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true, json: async () => mockProducts }), 100),
        ),
    )

    render(<App />)
    expect(screen.getByText('Ładowanie produktów...')).toBeInTheDocument()
  })

  it('wyświetla błąd gdy nie uda się pobrać produktów', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    })

    render(<App />)

    await waitFor(() => {
      expect(
        screen.getByText(/Ups! Nie udało się pobrać produktów/),
      ).toBeInTheDocument()
    })
  })

  it('dodaje produkt do koszyka', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('➕ Dodaj')
    await user.click(addButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Dodano "Product 1" do koszyka')).toBeInTheDocument()
    })

    // Sprawdź czy koszyk się otworzył
    const cartButton = screen.getByLabelText('Otwórz koszyk')
    await user.click(cartButton)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })
  })

  it('otwiera koszyk po dodaniu produktu', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('➕ Dodaj')
    await user.click(addButtons[0])

    await waitFor(() => {
      const cartButton = screen.getByLabelText('Otwórz koszyk')
      expect(cartButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('zamyka toast po kliknięciu przycisku zamknij', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('➕ Dodaj')
    await user.click(addButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Dodano "Product 1" do koszyka')).toBeInTheDocument()
    })

    const closeButton = screen.getByLabelText('Zamknij powiadomienie')
    await user.click(closeButton)

    await waitFor(() => {
      expect(
        screen.queryByText('Dodano "Product 1" do koszyka'),
      ).not.toBeInTheDocument()
    })
  })

  it('aktualizuje ilość produktu w koszyku', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    // Dodaj produkt do koszyka
    const addButtons = screen.getAllByText('➕ Dodaj')
    await user.click(addButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Dodano "Product 1" do koszyka')).toBeInTheDocument()
    })

    // Poczekaj aż koszyk się otworzy i znajdź przyciski
    await waitFor(() => {
      const plusButtons = screen.getAllByLabelText('Zwiększ ilość')
      expect(plusButtons.length).toBeGreaterThan(0)
    }, { timeout: 3000 })

    // Zwiększ ilość
    const plusButtons = screen.getAllByLabelText('Zwiększ ilość')
    await user.click(plusButtons[0])

    await waitFor(() => {
      // Sprawdź czy ilość się zwiększyła (powinno być 2 w koszyku)
      const quantitySpans = screen.getAllByText('2')
      expect(quantitySpans.length).toBeGreaterThan(0)
    })
  })

  it('usuwa produkt z koszyka', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
    })

    // Dodaj produkt do koszyka
    const addButtons = screen.getAllByText('➕ Dodaj')
    await user.click(addButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Dodano "Product 1" do koszyka')).toBeInTheDocument()
    })

    // Poczekaj aż koszyk się otworzy i znajdź przyciski "Usuń"
    await waitFor(() => {
      const removeButtons = screen.getAllByText('Usuń')
      expect(removeButtons.length).toBeGreaterThan(0)
    }, { timeout: 3000 })

    // Usuń produkt
    const removeButtons = screen.getAllByText('Usuń')
    await user.click(removeButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Koszyk jest pusty.')).toBeInTheDocument()
    })
  })
})

