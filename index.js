const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

//Create a cart
app.post('/cartcreation/:productId', (req, res) => {
  const productId = req.params.productId;
  const URL = "gid://shopify/ProductVariant/"+productId;
  const endpoint = 'https://korestore3.myshopify.com/api/2022-04/graphql.json';
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': '25e25dc74c777658b861b823346ea7f6'
  };

  const body = {
    query: `
      mutation {
        cartCreate(
          input: {
            lines: [
              {
                quantity: 1
                merchandiseId: "${URL}"
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
app.get('/lineitems', (req, res) => {
  const endpoint = 'https://korestore3.myshopify.com/api/2022-04/graphql.json';
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': '25e25dc74c777658b861b823346ea7f6'
  };

  const body = {
    query: `
      query {
        cart(id: "gid://shopify/Cart/c1-689592e35a508a23e5baebd06fd0d016") {
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












app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});