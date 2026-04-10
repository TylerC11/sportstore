import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {useCallback, useEffect, useState} from "react";
import Cookies from "js-cookie";
import type {Cart, CartItem} from "../../types/Cart.tsx";
import type {Product} from "../../types/Product.tsx";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51T1obzRgcqtWTnqP1MU3hfnxyacavPqqteOODGATqoSt2TTjwCKLFadh6s4Th19eZXkXG3wRwYvskC5PgKaWv86q00VLLmVlKw");

const COOKIE_KEY = "shopping_cart"

export default function Checkout() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [products, setProducts] = useState<Record<number, Product>>({})

    // Load cart from cookie on mount
    useEffect(() => {
        const raw = Cookies.get(COOKIE_KEY)
        const cart: Cart = raw ? JSON.parse(raw) : { items: [] }
        setCartItems(cart.items)
    }, [])

    // Fetch product details for each item in cart
    useEffect(() => {
        cartItems.forEach(item => {
            if (!products[item.id]) {
                fetch(`http://localhost:8080/products/${item.id}`)
                    .then(res => res.json())
                    .then(product => {
                        setProducts(prev => ({ ...prev, [item.id]: product }))
                    })
            }
        })
    }, [cartItems])

    const removeItem = (id: number) => {
        const updated = cartItems.filter(item => item.id !== id)
        setCartItems(updated)
        Cookies.set(COOKIE_KEY, JSON.stringify({ items: updated }), { expires: 1 })
    }

    const cartJSON = JSON.stringify({ items: cartItems })

    const fetchClientSecret = useCallback(async () => {
        // Create a Checkout Session
        const res = await fetch("http://localhost:8080/checkout/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: cartJSON
        });
        const data = await res.json();
        return data.clientSecret;
    }, [cartJSON]);

    const options = {fetchClientSecret};

    const total = cartItems.reduce((sum, item) => {
        const product = products[item.id]
        return sum + (product ? product.price * item.quantity : 0)
    }, 0)

    return (
        <div className="container-fluid px-4 py-4">
            {/* Section heading */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <span className="text-uppercase fw-bold small text-muted">Checkout</span>
                <hr className="flex-grow-1 m-0 border-secondary opacity-25" />
            </div>

            <div className="row g-4">
                {/* Cart summary */}
                <div className="col-md-4">
                    <div className="card p-3">
                        <h6 className="text-uppercase text-muted small fw-bold mb-3">Your Cart</h6>

                        {cartItems.length === 0 && (
                            <p className="text-muted small">Your cart is empty.</p>
                        )}

                        {cartItems.map(item => {
                            const product = products[item.id]
                            return (
                                <div key={item.id} className="d-flex align-items-center gap-3 mb-3">
                                    {/* Product image */}
                                    {product && (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            style={{width: 48, height: 48, objectFit: "cover", borderRadius: 4, border: "1px solid #3a3020"}}
                                        />
                                    )}

                                    {/* Product info */}
                                    <div className="flex-grow-1">
                                        <div className="text-white small fw-bold">
                                            {product ? product.name : "Loading..."}
                                        </div>
                                        <div className="text-muted" style={{fontSize: "0.75rem"}}>
                                            Qty: {item.quantity}
                                            {product && ` · $${(product.price * item.quantity).toFixed(2)}`}
                                        </div>
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeItem(item.id)}
                                        title="Remove item"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            )
                        })}

                        {/* Total */}
                        {cartItems.length > 0 && (
                            <>
                                <hr className="border-secondary opacity-25" />
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted small text-uppercase fw-bold">Total</span>
                                    <span className="text-warning fw-bold">${total.toFixed(2)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Stripe embedded checkout */}
                <div className="col-md-8">
                    <div className="card p-3">
                        {cartItems.length > 0 ? (
                            <EmbeddedCheckoutProvider
                                stripe={stripePromise}
                                options={options}
                            >
                                <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                        ) : (
                            <p className="text-muted small text-center py-4">Add items to your cart to continue.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}