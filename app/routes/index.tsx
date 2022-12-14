import { Form, useTransition } from "@remix-run/react";

export default function Index() {
  const transition = useTransition();
  const stateText =  transition.state === "submitting" ? "Saving....." : transition.state === "loading" ? "Saved!" : "";
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <p>Input customer and create order.</p>
      <Form method="post" action="/createOrder">
        <div style={{padding: '10px'}}>
          Name: <input type="text" name="name" />
        </div>
        <div style={{padding: '10px'}}>
          email: <input type="ext" name="email" />
        </div>
        <div style={{margin: 'auto'}}>
          <button type="submit">Submit</button>
        </div>
      </Form>
      <div>
        {stateText}
      </div>
    </div>
  );
}
