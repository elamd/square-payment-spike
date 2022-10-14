import { Link } from "@remix-run/react";

export default function complete() { 
    return (
        <div>
            <p>Order complete!</p>
            <Link to="/">Return</Link>
        </div>
    )
}