import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {useCallback} from "react";

export default function Checkout() {
    // Make sure to call `loadStripe` outside of a component’s render to avoid
    // recreating the `Stripe` object on every render.
    // This is your test publishable API key.
    const stripePromise = loadStripe("pk_test_51T1obzRgcqtWTnqP1MU3hfnxyacavPqqteOODGATqoSt2TTjwCKLFadh6s4Th19eZXkXG3wRwYvskC5PgKaWv86q00VLLmVlKw");

    const fetchClientSecret = useCallback(async () => {
        // Create a Checkout Session
        const res = await fetch("http://localhost:8080/checkout/create-checkout-session", {
            method: "POST",
        });
        const data = await res.json();
        return data.clientSecret;
    }, []);

    const options = {fetchClientSecret};
    return (
        <>
            <h1>Checkout</h1>

            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </>
    )
}