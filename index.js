const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;
const adminApiAccessToken = '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';
const storeFrontAccessToken = '25e25dc74c777658b861b823346ea7f6';
const domain = 'korestore3.myshopify.com';



app.use(express.json());

//Get list of products
app.get('/getproducts', (req, res) => {
  const url = `https://${domain}/admin/api/2022-04/products.json`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': adminApiAccessToken
  };
  
  axios.get(url, { headers })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.error('Error:', error.message);
      res.status(500).send('An error occurred');
    });
});

//Create a cart
app.post('/cartcreation/:productId', (req, res) => {
  const productId = req.params.productId;
  const createCartURL = "gid://shopify/ProductVariant/"+productId;
  const endpoint = `https://${domain}/api/2022-04/graphql.json`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': storeFrontAccessToken
  };

  const body = {
    query: `
      mutation {
        cartCreate(
          input: {
            lines: [
              {
                quantity: 1
                merchandiseId: "${createCartURL}"
              }
            ],
            buyerIdentity: {
              email: "mike@eznet.com",
              countryCode: US
            },
            attributes: {
              key: "cart_attribute",
              value: "This is a cart attribute"
            }
          }
        ) {
          cart {
            id
            createdAt
            updatedAt
            lines(first: 10) {
              edges {
                node {
                  id
                  merchandise {
                    ... on ProductVariant {
                      id
                    }
                  }
                }
              }
            }
            buyerIdentity {
              __typename
            }
            attributes {
              key
              value
            }
          }
        }
      }
    `
  };

  axios.post(endpoint, body, { headers })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

//View the cart
app.get('/lineitems/:cartUrl', (req, res) => {
  const cartUrl = req.params.cartUrl;
  const endpoint = `https://${domain}/api/2022-04/graphql.json`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': storeFrontAccessToken
  };

  const body = {
    query: `
      query {
        cart(id: "gid://shopify/Cart/${cartUrl}") {
          lines(first: 10) {
            edges {
              node {
                id
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
                quantity
              }
            }
          }
        }
      }
    `
  };

  axios.post(endpoint, body, { headers })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

//checkout
app.post('/checkout/:productId', (req, res) => {
  const productId = req.params.productId;
  const checkoutURL = "gid://shopify/ProductVariant/"+productId;
  const endpoint = `https://${domain}/api/2022-04/graphql.json`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': storeFrontAccessToken
  };

  const body = {
    query: `
    mutation {
      checkoutCreate(input: {
        lineItems: [
          {
            variantId: "${checkoutURL}",
            quantity: 1
          }
        ],
        email: "mike@eznet.com",
        shippingAddress: {
          firstName: "Johnny",
          lastName: "Applesead",
          address1: "13506 E Farwell Rd",
          address2: "",
          city: "Spokane",
          province: "Washington",
          country: "United States",
          zip: "99217"
        }
      }) {
        checkout {
          id
          webUrl
        }
      }
    }
    `
  };

  axios.post(endpoint, body, { headers })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});




//view orders
//Get list of products
app.get('/getorders/:checkoutToken', (req, res) => {
  const checkoutToken = req.params.checkoutToken;
  const url = `https://${domain}/admin/api/2022-04/orders.json?checkout_token=${checkoutToken}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': adminApiAccessToken
  };
  
  axios.get(url, { headers })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.error('Error:', error.message);
      res.status(500).send('An error occurred');
    });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
