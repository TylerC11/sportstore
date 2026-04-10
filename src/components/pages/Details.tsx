import {useParams} from "react-router";
import {useEffect, useState} from "react";
import type {Product} from "../../types/Product.tsx";
import Cookies from "js-cookie";
import type {Cart, CartItem} from "../../types/Cart.tsx";

export default function Details() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null)
    const [showMessage, setShowMessage] = useState(false)
    const COOKIE_KEY = "shopping_cart"

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/products/' + id);
            const product = await res.json();
            setProduct(product)
        }

        fetchData()
    }, [])

    const handleAddToCart = () => {

        const raw = Cookies.get(COOKIE_KEY)
        const cart: Cart = raw ? JSON.parse(raw) : { items: [] }
        const existing = cart.items.find((item: CartItem) => item.id === product?.id)
        const quantity = 1

        // Add the new item to the existing cart
        const updatedItems = existing
            ? cart.items.map((item: CartItem) =>
                item.id === product?.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            )
            //: [...cart.items, { id: movie.id, price: movie.price, quantity }]
            : [...cart.items, { id: product?.id, quantity }]

        Cookies.set(COOKIE_KEY, JSON.stringify({ items: updatedItems }), { expires: 1 })

        setShowMessage(true)
    }

    return (
        <>
            {
                showMessage && (
                    <p className="text-success">
                        Item added to cart successfully
                    </p>
                )
            }
            <h1>Details</h1>
            {
                product && (
                    <div>
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                        <p>
                            <button className="btn btn-primary" onClick={handleAddToCart}>
                                Add to cart
                            </button>
                        </p>
                    </div>
                )
            }
        </>
    )
}