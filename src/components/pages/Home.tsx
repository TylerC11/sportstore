import {useEffect, useState} from "react";
import type {Product} from "../../types/Product.tsx";
import {Link} from "react-router";
import ChatWidget from "../ChatWidget.tsx";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("All")

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/products/');
            const products = await res.json();
            setProducts(products)
        }

        fetchData()
    }, [])

    // Derive unique categories from products
    const categories = ["All", ...Array.from(new Set(products.map(p => p.category))).sort()]

    // Filter products by selected category
    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(p => p.category === selectedCategory)

    return (
        <>
            {/* Hero banner */}
            <div className="hero-banner bg-black text-center py-5 px-3 mb-4">
                <h1 className="display-4 fw-bold text-white mb-2">Locker Room Sports</h1>
                <p className="text-gold fst-italic mb-0">Built for the Game. Made for You.</p>
            </div>

            <div className="container-fluid px-4">
                {/* Section heading + category dropdown */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="text-uppercase fw-bold small text-muted">All Products</span>
                    <hr className="flex-grow-1 m-0 border-secondary opacity-25" />
                    <select
                        className="form-select form-select-sm w-auto"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Product grid */}
                {filteredProducts.length > 0 && (
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 pb-5">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="col">
                                <Link to={`/details/${product.id}`} className="text-decoration-none">
                                    <div className="card h-100">
                                        {/* Product image */}
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="card-img-top"
                                        />
                                        <div className="card-body">
                                            {/* Category badge */}
                                            {product.category && (
                                                <span className="badge bg-secondary text-uppercase mb-2" style={{fontSize: "0.65rem"}}>
                                                    {product.category}
                                                </span>
                                            )}
                                            <h6 className="card-title mb-1">{product.name}</h6>
                                            <p className="text-gold fw-bold mb-0">${product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {filteredProducts.length === 0 && products.length > 0 && (
                    <p className="text-muted text-center py-5">No products found in this category.</p>
                )}
            </div>

            <ChatWidget />
        </>
    )
}