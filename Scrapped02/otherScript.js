fetch ("https://webacademy.se/fakestore/") // fakestore.json
.then(response => response.json())
.then(cartItemsArray => {
    cartArray = cartItemsArray;
    renderAllCartItems(cartArray)
})

function renderAllCartItems (cartItemsArray){
    cartItemsArray.forEach(cartItem => renderAllCartItems(cartItem))
}

function renderCartItem(cartItem){
    const newLi = document.createElement("li")
    newLi.innerHTML = `
        <p id="pTag"> ${cartItem.product.name}: $${cartItem.product.price}
        <button class="delete-button">
            <span>remove</span>
        </button>
        </p>    
    `
    findListOfItems.append(newLi)
}

const addButton = newElement.querySelector(".add-item")
addButton.addEventListener("click", event =>{
    findListOfItems.innerText = ""

    fetch ("https://webacademy.se/fakestore/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            cart_id: 1,
            product_id: product.id
        })
    })
    .then(response => response.json())
    .then(newCartItem => {
        cartArray.push(newCartItem);
        renderAllCartItems(cartArray)
    })
})

const findListOfItems = document.querySelector(".list-of-items")

const removeButton = newLi.querySelector(".delete-button")
removeButton.addEventListener("click", event => {
    newLi.remove()
    fetch (`https://webacademy.se/fakestore/${cartItem.id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(results => {
        cartArray = results
        findListOfItems.innerHTML = ""
        renderAllCartItems(cartArray)
    })
})

const checkOut = document.querySelector("#checkout")
const newDiv = document.createElement("div")
subTotal = cartItemsArray.map(item => item.product.price)
const subFloat = subTotal.map(num => parseFloat(num))
let sum = subFloat.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue
}, 0)
let tax = sum * .08
checkOut.innerHTML = ""
newDiv.innerHTML = `
<hr>
<p id="subtotal"> Subtotal: $${sum.toFixed(2)} </p>
<p id="taxes"> Tax: $${tax.toFixed(2)} </p>
<p id="total"> Total: $${(sum +tax).toFixed(2)} </p>
<button id="check-out">Check Out</button>
`
checkOut.append(newDiv)

const subtotals = document.querySelector("#subtotal")
const total = document.querySelector("#total")
const taxes = document.querySelector("#taxes")
const checkoutBtn = newDiv.querySelector("#check-out")
checkoutBtn.addEventListener("click", event => {
    findListOfItems.innerHTML = ""
    subtotals.innerHTML = `Subtotal: $0.00`
    taxes.innerHTML = `Tax: $0.00`
    total.innerHTML = `Total: $0.00`
    alert("Thank you!")
    fetch ("https://webacademy.se/fakestore/", {
        method: "DELETE"
    })
    cartArray = []
    
})