import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    // Allow CORS from any origin (or restrict to specific origin)
    res.setHeader("Access-Control-Allow-Origin", "*"); // Or use your domain instead of "*"
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        // Handle preflight request
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    return res.status(200).json({ message: "hi" });

    // try {
    //   const session = await stripe.checkout.sessions.create({
    //     line_items: req.body.items, // from frontend
    //     mode: "payment",
    //     success_url: "https://yourdomain.com/success",
    //     cancel_url: "https://yourdomain.com/cancel",
    //   });

    //   res.status(200).json({ url: session.url });
    // } catch (err) {
    //   res.status(500).json({ error: err.message });
    // }
}
