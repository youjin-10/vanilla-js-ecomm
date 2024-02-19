import mockdata from "./mockdata.json?raw";

async function getProducts() {
  if (process.env.NODE_ENV === "development") {
    return JSON.parse(mockdata);
  } else {
    const response = await fetch(
      "https://learnwitheunjae.dev/api/sinabro-js/ecommerce",
    );
    return await response.json();
  }
}

async function main() {
  const products = await getProducts();

  document.querySelector("#products").innerHTML = products
    .map((product) => {
      return `<div class="product">
        <img src="${product.images[0]}" alt="${product.name}" />
          <p>${product.name}</p>
          <div class="flex items-center justify-between">
            <span>price: $${product.regularPrice}</span>

            <div>
                <button type="button" class="bg-green-200 hover:bg-green-300 text-green-800 py-0.5 px-3 rounded-lg">-</button>
                <span class="text-green-800">13</span>
                <button type="button" class="bg-green-200 hover:bg-green-300 text-green-800 py-0.5 px-3 rounded-lg mr-1">+</button>
            </div>
            
          </div>
      </div>`;
    })
    .join("");
}

main();
