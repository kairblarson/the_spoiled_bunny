// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    console.log("REACHED VERCEL: "+req.body);

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
