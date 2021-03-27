// declaration of variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const submitOrderBtn = document.querySelector(".btn");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//main cart, empty array
let cart = []
//buttons
let buttonsDOM = [];

//class with constructor, getting the product from JSON
//asyncrinous code with async
// when result is done, using data we get it in JSON-format
class Products {
    async getProducts(){
        try {
            let result = await fetch("https://webacademy.se/fakestore/");
            let data = await result.json();
            let products = data.map(item =>{
                const title = item.title;
                const price = item.price;
                const description = item.description;
                const id = item.id;  // eventuellt använda Number som parse
                const image = item.image;
                return {title, price, description, id, image};
            });
            return products;
    } catch (error) {
        console.log(error);

    }
    }
}


//class responsible for cart and display products with dynamic values
// loops through array, adds to result
// <h5>${product.description}</h5>  ska in här efter .title
class UI {
    displayProducts(products){
    let result = "";
    products.forEach(product => {
        result += `
        <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="product" class="product-img" />
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                </button>
            </div>
            <h3>${product.title}</h3> 
            <br>
            <h6>${product.description}</h6>
            <h4>${product.price} kr</h4>
        </article>
        `; 
    });
    productsDOM.innerHTML = result;
    }
    //spread-operated, turn into array insted of node-list
    //foreach loop with callback function
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")
    ];
    buttonsDOM = buttons;
    buttons.forEach(button =>{
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id == id); //det var tre
        if (inCart){
            button.innerText = "In Cart";
            button.disabled = true;  //disable button and change text if already in cart
        }
            button.addEventListener('click',(event) =>{
             event.target.innerText = "In Cart";
             event.target.disabled = true;
             //get product from products, w/ spread-operator and create item
             let cartItem = {...Storage.getProduct(id), amount: 1};
             

             //add product to the cart w/ spread operator
             cart = [...cart, cartItem];
             //save cart in localstorage, looking for an array
             Storage.saveCart(cart);
             //set cart values and total
             this.setCartValues(cart);
             //display cart item
             this.addCartItem(cartItem)
             //show the cart
             this.showCart();

            })
    });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
        const div =document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product" />
                <div>
                    <h4>${item.title}</h4>
                    <h5>${item.price} kr</h5>
                    <span class="remove-item" data-id=${item.id}
                    >remove</span>
                </div>
                <div>
                    <i class="fas fa-chevron-up" data-id=${item.id}></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id=${item.id}></i>
                </div>
        `;
        cartContent.appendChild(div);

    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');

    }
    //empty cart array will be assigned values
    //and set the values that will be in DOM
    setUpAPP(){
        cart = Storage.getCart(); //item stored or empty array returned
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart () {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    cartLogic(){

        //clear cart button
        clearCartBtn.addEventListener('click', () =>{
            this.clearCart();
        });

        //submit order
        submitOrderBtn.addEventListener('click', () =>{
            if (validate() == true){
               this.clearCart();
           } 
        });
        



        //cart functionality
        cartContent.addEventListener("click", event=> {
            if (event.target.classList.contains("remove-item")
            ){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                //remove fom DOM
                cartContent.removeChild
                (removeItem.parentElement.parentElement);
                //remove from cart
                this.removeItem(id);
            }
            else if (event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id == id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if (event.target.classList.contains
                ("fa-chevron-down")){
                    let lowerAmount = event.target;
                    let id = lowerAmount.dataset.id;
                    let tempItem = cart.find(item => item.id == id);
                    tempItem.amount = tempItem.amount - 1;
                    if (tempItem.amount > 0){
                        Storage.saveCart(cart);
                        this.setCartValues(cart);
                        lowerAmount.previousElementSibling.innerText = tempItem.amount
                    } else {
                        cartContent.removeChild(lowerAmount.parentElement);
                        this.removeItem(id);
                    }

                }

        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id != id);
        this.setCartValues(cart);
        //get the last value/filter of the cart
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `
        <i class="fas fa-shopping-cart"></i>add to cart`;
    }
    //getting the id, return a specific button (Id) that has the dataset-id from button array
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id == id);
    }
}

// class localstorage w/ static method
class Storage {
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products)
        );
    }
    //return the array in localstorage, if the products is matching the id
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id == id)
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart (){
        return localStorage.getItem('cart') ? 
        JSON.parse(localStorage.getItem ('cart')) : []
    }

}

//eventlistener with callback function, w/ 2 instances
document.addEventListener("DOMContentLoaded", ()=>{
const ui = new UI();
const products = new Products();
//set up application
ui.setUpAPP();

  //get all products using AJAX to chain, example calling getBagbuttons 
  // after products are loaded
 products.getProducts().then(products => { 
     ui.displayProducts(products);
    Storage.saveProducts(products);
 }).then(()=> {
ui.getBagButtons();
ui.cartLogic();
 })
});


function validate(){
    var name = document.getElementById("name").value;
    var subject = document.getElementById("subject").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var error_message = document.getElementById("error_message");
    
    error_message.style.padding = "10px";
    
    var text;
    if(name.length < 5){
      text = "Please Enter valid Name";
      error_message.innerHTML = text;
      return false;
    }
    if(subject.length < 5){
      text = "Please Enter Correct Address";
      error_message.innerHTML = text;
      return false;
    }
    if(isNaN(phone) || phone.length < 8){
      text = "Please Enter valid Phone Number";
      error_message.innerHTML = text;
      return false;
    }
    if(email.indexOf("@") == -1 || email.length < 4){
      text = "Please Enter valid Email";
      error_message.innerHTML = text;
      return false;
    }
    alert("Thank you for the order!");
    return true;
  }







