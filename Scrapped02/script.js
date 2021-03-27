fetch ("https://webacademy.se/fakestore/") // fakestore.json
.then(response => response.json())
.then(productsArray => renderAllProducts(productsArray))

function renderAllProducts(productsArray) {
    productsArray.forEach(product => renderOneProduct (product)) // foreach?
}

const findDiv = document.querySelector("#clothes-box")
function renderOneProduct(product) {
    const newElement = document.createElement("div")
    newElement.className = "content"
    newElement.innerHTML = `
    <div class="item-card" >
        <div class="center" style="text-align:center;">
            <img src="${product.image}" class="image"></img>
            <h2 class="titleOfProduct">${product.title}</h2>
            <p class="descriptionOfProduct">${product.description}</p>
            <br>
            <p class="priceOfProduct">Price: $${product.price}</p>
            <button class="add-item">Add to Cart</button>
            <br>
        </div>
    </div>
    `
    findDiv.append(newElement)
}




