import React, { useState, useEffect, useCallback } from 'react';


interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutReceipt {
  id: string;
  total: number;
  timestamp: string;
  items: CartItem[];
}

const MOCK_PRODUCTS: Product[] = [
  { id: 'prod1', name: 'Wireless Earbuds', price: 79.99 },
  { id: 'prod2', name: 'Smartwatch Pro', price: 199.99 },
  { id: 'prod3', name: 'Portable Bluetooth Speaker', price: 49.99 },
  { id: 'prod4', name: 'Noise-Cancelling Headphones', price: 149.99 },
  { id: 'prod5', name: 'USB-C Hub Adapter', price: 29.99 },
  { id: 'prod6', name: 'Ergonomic Mouse', price: 34.99 },
  { id: 'prod7', name: 'Mechanical Keyboard', price: 89.99 },
  { id: 'prod8', name: 'Webcam HD', price: 59.99 },
];

const API_LATENCY = 500; // Simulate network delay

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutReceipt, setCheckoutReceipt] = useState<CheckoutReceipt | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
  });

  // Mock API: GET /api/products
  const fetchProducts = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return new Promise<Product[]>((resolve) => {
      setTimeout(() => {
        resolve(MOCK_PRODUCTS);
        setIsLoading(false);
      }, API_LATENCY);
    });
  }, []);

  // Mock API: GET /api/cart (and calculate total)
  const fetchCart = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return new Promise<{ cartItems: CartItem[]; total: number }>((resolve) => {
      setTimeout(() => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        resolve({ cartItems: cart, total });
        setIsLoading(false);
      }, API_LATENCY);
    });
  }, [cart]);

  // Mock API: POST /api/cart
  const addToCart = useCallback((productId: string) => {
    setIsLoading(true);
    setError(null);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const productToAdd = products.find(p => p.id === productId);
        if (!productToAdd) {
          setError('Product not found');
          setIsLoading(false);
          resolve();
          return;
        }

        setCart(prevCart => {
          const existingItem = prevCart.find(item => item.id === productId);
          if (existingItem) {
            return prevCart.map(item =>
              item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            return [...prevCart, { ...productToAdd, quantity: 1 }];
          }
        });
        setIsLoading(false);
        resolve();
      }, API_LATENCY);
    });
  }, [products]);

  // Mock API: DELETE /api/cart/:id
  const removeFromCart = useCallback((productId: string) => {
    setIsLoading(true);
    setError(null);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
        setIsLoading(false);
        resolve();
      }, API_LATENCY);
    });
  }, []);

  // Helper to update quantity (not a direct API, but part of cart management)
  const updateCartItemQuantity = useCallback((productId: string, newQuantity: number) => {
    setIsLoading(true);
    setError(null);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCart(prevCart => {
          if (newQuantity <= 0) {
            return prevCart.filter(item => item.id !== productId);
          }
          return prevCart.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          );
        });
        setIsLoading(false);
        resolve();
      }, API_LATENCY);
    });
  }, []);

  // Mock API: POST /api/checkout
  const handleCheckout = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return new Promise<CheckoutReceipt>((resolve) => {
      setTimeout(() => {
        const receipt: CheckoutReceipt = {
          id: `receipt-${Date.now()}`,
          total: cartTotal,
          timestamp: new Date().toLocaleString(),
          items: [...cart], // Deep copy cart items for receipt
        };
        setCheckoutReceipt(receipt);
        setCart([]); // Clear cart after checkout
        setCheckoutForm({ name: '', email: '' }); // Clear form
        setIsCheckoutModalOpen(true);
        setIsLoading(false);
        resolve(receipt);
      }, API_LATENCY);
    });
  }, [cart, cartTotal]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, [fetchProducts]);

  useEffect(() => {
    fetchCart().then(data => setCartTotal(data.total));
  }, [cart, fetchCart]); // Recalculate total when cart changes

  const handleCheckoutFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Your cart is empty. Add items before checking out.');
      return;
    }
    await handleCheckout();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Vibe Commerce</h1>

      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="ml-4 text-white text-lg">Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center text-gray-500 text-xs">IMG</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-gray-600 mb-3">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="mt-auto w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                  disabled={isLoading}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart View */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>
          {
            cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-700">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                        disabled={isLoading}
                      >
                        -
                      </button>
                      <span className="font-medium text-gray-800 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                        disabled={isLoading}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <p className="text-xl font-bold text-gray-900 flex justify-between">Total: <span>${cartTotal.toFixed(2)}</span></p>
                </div>
              </div>
            )
          }

          {cart.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Checkout Details</h3>
              <form onSubmit={handleSubmitCheckout} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={checkoutForm.name}
                    onChange={handleCheckoutFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={checkoutForm.email}
                    onChange={handleCheckoutFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
                  disabled={isLoading || cart.length === 0}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Receipt Modal */}
      {isCheckoutModalOpen && checkoutReceipt && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Receipt</h2>
            <p className="text-gray-700 mb-2"><strong>Order ID:</strong> {checkoutReceipt.id}</p>
            <p className="text-gray-700 mb-2"><strong>Date:</strong> {checkoutReceipt.timestamp}</p>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Items:</h3>
              <ul className="space-y-2 mb-4">
                {checkoutReceipt.items.map(item => (
                  <li key={item.id} className="flex justify-between text-gray-600">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-2xl font-bold text-gray-900 flex justify-between border-t border-gray-300 pt-4">Total: <span>${checkoutReceipt.total.toFixed(2)}</span></p>
            </div>
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
