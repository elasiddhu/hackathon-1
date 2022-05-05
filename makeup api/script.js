
let ele=document.getElementById("cont");

let nav=document.createElement("nav");
nav.className="navbar navbar-light  bg-secondary";
ele.appendChild(nav);

let fluid=document.createElement("div");
fluid.className="container-fluid";
nav.appendChild(fluid);

let a=document.createElement("a");
a.innerText="Makeup";
a.className="navbar-brand text-light";
fluid.appendChild(a);

let form=document.createElement("form");
form.className="d-flex";
fluid.appendChild(form);

let put=document.createElement("input");
put.className="form-control me-2";
put.setAttribute("type","search");
put.setAttribute("placeholder","Search");
put.setAttribute("aria-label","Search");
form.appendChild(put);

let btn=document.createElement("button");
btn.innerText="Search";
btn.className="btn btn-outline-success btn-info";
btn.setAttribute("type","submit");
form.appendChild(btn);



"use strict;"

fetchProducts();

// To fetch list of products from makeup API and display them
async function fetchProducts(products) {
  try {
    const container = document.querySelector(".container");
    const loader = document.querySelector("#loading");

    if (!products) {
      sessionStorage.clear();
      loader.classList.add("display");

      const data = await fetch(
        "https://makeup-api.herokuapp.com/api/v1/products.json"
      );
      products = await data.json();

      loader.classList.remove("display");
    }

    let currentPage = sessionStorage.getItem("currentPage");
    if (!currentPage) {
      currentPage = 1;
      sessionStorage.setItem("currentPage", currentPage);
    }

    products
      .slice((currentPage - 1) * 9, currentPage * 9)
      .forEach((product) => {
        const card = `
          <div class="card">
            <img class="product-image" src='${product["api_featured_image"]}' alt='${product["name"]}'>
            <div class="card-content">
              <p class="product-brand">${product["brand"]}</p>
              <h3 class="product-name">${product["name"]}</h3>
              <div class="product-description"><p>${product["description"]}</p></div>
              <div class="card-footer">
                <p class="product-price">${product["price"]}</p>
                <a class="button" href='${product["product_link"]}' target="_blank">BUY</a>
              </div>
            </div>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", card);

        const cardEventListener = document
          .querySelector(".card:last-child")
          .addEventListener("click", function () {
            showModal(product);
          });

        const button = document.querySelector(".card:last-child .button");
        button.onclick = (event) => {
          event.stopPropagation();
          return true;
        };
      });

    const navigation = document.createElement("div");
    navigation.className = "navigation";

    const previous = document.createElement("button");
    previous.classList.add("button", "previous");
    previous.innerHTML = "« Previous";
    previous.addEventListener("click", function () {
      previousPage(products);
    });

    const next = document.createElement("button");
    next.classList.add("button", "next");
    next.innerHTML = "Next »";
    next.addEventListener("click", function () {
      nextPage(products);
    });

    navigation.append(previous, next);
    document.body.append(navigation);
  } catch (error) {
    console.log("Reloading Page. Error occurred: " + error);
    location.reload();
  }
}