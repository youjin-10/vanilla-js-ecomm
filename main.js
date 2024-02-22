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

  const updateProductCount = (productId) => {
    const productElem = document.querySelector(
      `.product[data-product-id='${productId}']`,
    );
    productElem.querySelector(".cart-count").innerHTML = countMap[productId];
  };

  const updateCart = () => {
    const productIds = Object.keys(countMap);
    document.querySelector(".cart-items").innerHTML = productIds
      .map((productId) => {
        const productInCart = productMap[productId];
        const productCount = countMap[productId];
        return productCount > 0
          ? getProductHTML(productInCart, productCount)
          : "";
      })
      .join("");

    const totalCount = sumTotalCount(Object.values(countMap));
    document.querySelector(".total-count").innerHTML = `(${totalCount})`;
  };

  const decreaseCount = (productId) => {
    if (!countMap[productId]) {
      countMap[productId] = 0;
    }
    countMap[productId] -= 1;
    updateProductCount(productId);
    updateCart();
  };
  const increaseCount = (productId) => {
    if (!countMap[productId]) {
      countMap[productId] = 0;
    }
    countMap[productId] += 1;
    updateProductCount(productId);
    updateCart();
  };

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

      if (targetElem.matches(".btn-decrease") && countMap[productId] > 0) {
        decreaseCount(productId);
      } else if (targetElem.matches(".btn-increase")) {
        increaseCount(productId);
      }
    }
  });

  document.querySelector(".cart-items").addEventListener("click", () => {
    const targetElem = event.target;

    if (
      targetElem.matches(".btn-decrease") ||
      targetElem.matches(".btn-increase")
    ) {
      const foundProductElem = findElement(targetElem, ".product");
      const productId = foundProductElem.getAttribute("data-product-id");

      if (targetElem.matches(".btn-decrease") && countMap[productId] > 0) {
        decreaseCount(productId);
      } else if (targetElem.matches(".btn-increase")) {
        increaseCount(productId);
      }
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
