import {useEffect, useState} from "react";
import type {Product} from "../../types/Product.tsx";
import {Link} from "react-router";
import ChatWidget from "../ChatWidget.tsx";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/products/');
            const products = await res.json();
            setProducts(products)
        }

        fetchData()
    }, [])

    return (
        <>
            <h1>Home</h1>

            <ChatWidget />

            {products.length > 0 && (
                products.map(product => (
                    <div key={product.id} className="pb-3">
                        <Link to={`/details/${product.id}`}>
                            {product.name}
                        </Link>
                    </div>
                ))
            )}
        </>
    )
}