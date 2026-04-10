import {Link, Outlet} from "react-router";

export default function Layout() {
    return (
        <div className="container-fluid px-0">
            <header>
                <nav className="navbar navbar-dark bg-black border-bottom border-warning mb-0">
                    <div className="container-fluid px-4">
                        <Link to="/" className="navbar-brand fw-bold">
                            Locker Room <span className="text-warning">Sports</span>
                        </Link>

                        <div className="d-flex">
                            <Link to="/checkout" className="nav-link text-light fs-4">
                                <i className="bi bi-cart4"></i>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container-fluid px-0">
                <Outlet/>
            </main>

            <footer className="site-footer container-fluid text-center py-3 mt-5">
                <small className="text-muted">Locker Room Sports, &copy; 2026</small>
            </footer>
        </div>
    )
}