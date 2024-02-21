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

function findElement(startingElement, selector) {
  let target = startingElement;
  while (target) {
    if (target.matches(selector)) {
      console.log("found!");
      return target;
    }
    target = target.parentElement;
  }
  return null;
}

function sumTotalCount(countArr) {
  return countArr.reduce((prevVal, currVal) => prevVal + currVal, 0);
}

function getProductHTML(product, count) {
  return `<div class="product" data-product-id=${product.id} >
  <img src="${product.images[0]}" alt="${product.name}" />
    <p>${product.name}</p>
    <div class="flex items-center justify-between">
      <span>price: $${product.regularPrice}</span>

      <div>
          <button type="button" class="btn-decrease disabled:cursor-not-allowed disabled:opacity-50 bg-green-200 hover:bg-green-300 text-green-800 py-0.5 px-3 rounded-lg">-</button>
          <span class="cart-count text-green-800">${count ?? ""}</span>
          <button type="button" class="btn-increase bg-green-200 hover:bg-green-300 text-green-800 py-0.5 px-3 rounded-lg mr-1">+</button>
      </div>
      
    </div>
</div>`;
}

async function main() {
  const products = await getProducts();
  const productMap = {};
  products.forEach((product) => {
    return (productMap[product.id] = product);
  });
  const countMap = {};

  document.querySelector("#products").innerHTML = products
    .map((product) => {
      return getProductHTML(product);
    })
    .join("");

  document.querySelector("#products").addEventListener("click", (event) => {
    const targetElem = event.target;

    if (
      targetElem.matches(".btn-decrease") ||
      targetElem.matches(".btn-increase")
    ) {
      const foundProductElem = findElement(targetElem, ".product");
      const productId = foundProductElem.getAttribute("data-product-id");

      if (!countMap[productId]) {
        countMap[productId] = 0;
      }

      if (targetElem.matches(".btn-decrease") && countMap[productId] > 0) {
        countMap[productId] -= 1;
      } else if (targetElem.matches(".btn-increase")) {
        countMap[productId] += 1;
      }

      foundProductElem.querySelector(".cart-count").innerHTML =
        countMap[productId];

      const productIds = Object.keys(countMap);
      const htmls = productIds
        .map((productId) => {
          const productInCart = productMap[productId];
          const productCount = countMap[productId];
          return productCount > 0
            ? getProductHTML(productInCart, productCount)
            : "";
        })
        .join("");
      document.querySelector(".cart-items").innerHTML = `<p>${htmls}</p>`;

      const totalCount = sumTotalCount(Object.values(countMap));
      document.querySelector(".total-count").innerHTML = `(${totalCount})`;
    }
  });

  document.querySelector(".btn-cart").addEventListener("click", () => {
    document.body.classList.add("displaying-cart");
  });

  document.querySelector(".btn-close-cart").addEventListener("click", () => {
    document.body.classList.remove("displaying-cart");
  });

  document.querySelector(".cart-dimmed-bg").addEventListener("click", (_) => {
    document.body.classList.remove("displaying-cart");
  });
}

main();
