import { redirect, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Client, Environment, ApiError, ApiResponse, SearchCustomersResponse } from 'square';

const client = new Client({
    accessToken: process.env.SQUARE_SANDBOX_TOKEN,
    environment: Environment.Sandbox,
});
const  { customersApi }  = client;

export const loader: LoaderFunction = async () => {
    console.log('loader');
    return {};
};

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const customer:ApiResponse<SearchCustomersResponse> = await customersApi.searchCustomers({
    query: {
        filter: {
            emailAddress: {
                exact: email
            }
        },
    }
  });
  if(!customer.result.customers) {
    console.log('creating customer');
    let response = await customersApi.createCustomer({
        givenName: name,
        familyName: name,
        companyName: 'company',
        emailAddress: email,
        phoneNumber: '313-333-3333'
    });
    console.log(response);
  }
  else {
    console.log(customer.result);
  }
  return redirect('/');
}