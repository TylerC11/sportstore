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
        <div className="container-fluid px-4 py-4">
            {/* Success alert */}
            {
                showMessage && (
                    <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                        <i className="bi bi-check-circle-fill"></i>
                        Item added to cart successfully
                    </div>
                )
            }

            {
                product && (
                    <div className="row g-4">
                        {/* Product image */}
                        <div className="col-md-5">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="details-img"
                            />
                        </div>

                        {/* Product info */}
                        <div className="col-md-7">
                            {product.category && (
                                <span className="badge bg-secondary text-uppercase mb-2" style={{fontSize: "0.65rem"}}>
                                    {product.category}
                                </span>
                            )}
                            <h1 className="text-white fw-bold mb-1">{product.name}</h1>
                            <p className="text-gold fw-bold fs-4 mb-3">${product.price.toFixed(2)}</p>

                            <p className="text-muted mb-3">{product.description}</p>

                            {/* Meta info */}
                            <ul className="list-unstyled text-muted small mb-4">
                                {product.brand && <li><i className="bi bi-tag me-2"></i>{product.brand}</li>}
                                {product.size && <li><i className="bi bi-rulers me-2"></i>Size: {product.size}</li>}
                                {product.stock !== undefined && (
                                    <li>
                                        <i className="bi bi-box-seam me-2"></i>
                                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                    </li>
                                )}
                            </ul>

                            <hr className="border-secondary opacity-25" />

                            <p>
                                <button
                                    className="btn btn-warning"
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                >
                                    <i className="bi bi-cart-plus me-2"></i>
                                    Add to Cart
                                </button>
                            </p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}