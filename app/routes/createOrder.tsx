import { redirect, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Client, Environment, ApiError, ApiResponse, SearchCustomersResponse, PublishInvoiceRequest } from 'square';
import type { Invoice, Order, OrderLineItem } from 'square';

const client = new Client({
    accessToken: process.env.SQUARE_SANDBOX_TOKEN,
    environment: Environment.Sandbox,
});
const  { customersApi, ordersApi }  = client;

export const loader: LoaderFunction = async () => {
    console.log('loader');
    return {};
};

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const customerRequest:ApiResponse<SearchCustomersResponse> = await customersApi.searchCustomers({
    query: {
        filter: {
            emailAddress: {
                exact: email
            }
        },
    }
  });
  let customer;
  if(!customerRequest.result.customers) {
    console.log('creating customer');
    let response = await customersApi.createCustomer({
        givenName: name,
        familyName: name,
        companyName: 'company',
        emailAddress: email,
        phoneNumber: '313-333-3333'
    });
    customer = response.result.customer;
    console.log(response);
  }
  else {
    customer = customerRequest.result.customers[0];
    console.log('Customer exists');
    console.log(customer);

  }
  // hardcode location, which would be passed in via a query string.
  const location = "LQQBM7VJV3ZZF";

  // Create Order
  const order: Order = {
    locationId: location,
    customerId: customer?.id,
    lineItems: [
      {
        quantity: "1",
        catalogObjectId: "FPPAYEN4EHSP7UMPIAN6H25Z",
      }
    ]
  }
  const orderRequest = await client.ordersApi.createOrder(
    {
      order
    }
  );

  console.log((orderRequest).result.order);
  const invoice: Invoice = {
    locationId: location,
    orderId: orderRequest.result.order?.id,
    deliveryMethod: 'EMAIL',
    paymentRequests: [
      {
        requestType: 'BALANCE',
        dueDate: '2022-12-24',
      }
    ],
    primaryRecipient: {
      customerId: customer?.id
    },
    acceptedPaymentMethods: {
      card: true
    },
    storePaymentMethodEnabled: true,
  }
    const invoiceRequest = await client.invoicesApi.createInvoice({invoice});
    console.log('invoice created');
    console.log(invoice);

    const b: PublishInvoiceRequest = {
      idempotencyKey: 'blah4',
      version: 0
    }; 
    if(invoiceRequest.result.invoice?.id) {
      console.log('publishing invoice');
      const publishInvoiceRquest = await client.invoicesApi.publishInvoice(invoiceRequest.result.invoice.id, b);
      console.log(publishInvoiceRquest);
    }
  return redirect('/');
}