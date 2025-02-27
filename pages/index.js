import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import stripeClient from '../client';

/*
STEPS TO IMPLEMENT CART
1. create a cart component that appears when a mycart button is clicked
  1b: cart component will have a state that begins as an empty array
2. create functionality for each product that adds it to the cart
  2b: button onclick with update cart state by adding prod to the cart array
3. create useReducer hook that takes all products within the cart and totals their prices
for checkout

*/

export async function getStaticProps() {
  const { data: products } = await stripeClient.products.list({
    active: true,
  });
  const { data: prices } = await stripeClient.prices.list({
    active: true,
  });

  const productsWithPrices = products.map((prod) => ({
    id: prod.id,
    images: prod.images,
    description: prod.description,
    name: prod.name,
    price: '',
  }));

  function integratePrice() {
    for (let i = 0; i < productsWithPrices.length; i++) {
      const matchingPrice = prices.filter(
        (price) => price.product === productsWithPrices[i].id
      );
      console.log(productsWithPrices.length);
      if (matchingPrice[0] === undefined) {
        matchingPrice[0] = { unit_amount: null };
      }
      productsWithPrices[i].price = matchingPrice[0].unit_amount;
    }
  }
  integratePrice();

  return {
    props: {
      productsWithPrices,
      products,
      prices,
    },
  };
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const propTypes = {
  productsWithPrices: PropTypes.arrayOf(PropTypes.object).isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};
function Cart(cartUi) {
  // eslint-disable-next-line no-param-reassign
  const [showCart, setShowCart] = React.useState((cartUi.display = 'none'));
}

function Home({ productsWithPrices }) {
  // const [showCart, setShowCart] = React.useState("none");

  const numberOfProducts = productsWithPrices.length;
  return (
    <div className="container mx-auto w-full">
      <Head>
        <title>NextJS and Tailwind Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-gray-200">
        <h1 className="title text-2xl w-full text-center">
          NextJS and Tailwind Starter
        </h1>
        <Cart //supposed to render either a "my cart" button or the cartUi.
          cartUi={(
            <button
              type="button"
              className="float-right"
              onClick={() => {
                console.log('getting somewhere')
                //setShowCart((cartUi.display = 'block'));
              }}
            >
              <Image src="/cart.png" height="25px" width="25px" />
              My Cart
            </button>
          )}
        />
      </header>
      <main className="my-5 flex flex-col justify-center items-center">
        {/* "my-5 flex flex-col justify-center items-center" */}
        <span>
          Number of total Products from stripe
          {numberOfProducts}
        </span>
        <ul className="items-bottom min-h-full p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5 ">
          {productsWithPrices.map((obj) => (
            <li
              key={obj.id}
              className=" p-4 max-w-sm rounded overflow-hidden shadow-lg border-t"
            >
              <Link href={`/${obj.name}/${obj.id}`}>
                <a>
                  <img className="w-full " src={obj.images} alt="" />
                  <h1 className="text-center font-bold text-xl mb-2">
                    {obj.name}
                  </h1>
                  <h2>
                    <b>Description: </b>
                    {obj.description}
                  </h2>

                  <h2 className="pb-2">
                    <b>Price: </b>
                    {formatter.format(`${obj.price}`)}
                  </h2>
                </a>
              </Link>
              <button type="button" className="pr-2 pl-2 border-2 border-black">
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      </main>
      <footer className=" bg-gray-200 mt-5 w-full flex flex-col justify-center items-center">
        <p>this is the footer</p>
      </footer>
    </div>
  );
}

Home.propTypes = propTypes;
export default Home;
