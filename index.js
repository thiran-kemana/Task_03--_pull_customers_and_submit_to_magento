const { createClient } = require("@commercetools/sdk-client");
const {
  createAuthMiddlewareForClientCredentialsFlow,
} = require("@commercetools/sdk-middleware-auth");
const { createHttpMiddleware } = require("@commercetools/sdk-middleware-http");
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

const projectKey = "custom_project";
const clientId = "HBPrIz0YM-nnO6PabxbRpLgR";
const clientSecret = "4ref7KnLWpu1wH4wMpnzcZUCDhYLKBMn";
const apiUrl = "https://api.australia-southeast1.gcp.commercetools.com";
const authUrl = "https://auth.australia-southeast1.gcp.commercetools.com";

const customerUrl = "https://commercetools.kemanamagento.web.id/customer/";
const categoryUrl = "https://commercetools.kemanamagento.web.id/category/";

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
});

const httpMiddleware = createHttpMiddleware({
  host: apiUrl,
});

const client = createClient({
  middlewares: [authMiddleware, httpMiddleware],
});

async function main() {
  const fetchModule = await import("node-fetch");
  const fetch = fetchModule.default;

  // Fetch customers
  const customersResult = await client.execute({
    uri: `/${projectKey}/customers?where=createdAt%3E"${oneHourAgo}"`,
    method: "GET",
  });
  const customers = customersResult.body.results;
  console.log("Customers:", customers);

  // Submit customers to customerUrl using POST method
  let response = await fetch(customerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customers),
  });
  console.log(response);

  // Fetch categories
  const categoriesResult = await client.execute({
    uri: `/${projectKey}/categories`,
    method: "GET",
  });
  const categories = categoriesResult.body.results;
  console.log("Categories:", categories);

  // Submit categories to categoryUrl using POST method
  response = await fetch(categoryUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categories),
  });
  console.log(response);
}

main();
