/*======================================================
            ARROZ INDIANO
            SCRIPT.JS - PART 1
======================================================*/


"use strict";



/*======================================================
                    ELEMENTS
======================================================*/

const cartBtn = document.querySelector(".cart-btn");

const cartSidebar = document.getElementById("cartSidebar");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const subtotal = document.getElementById("subtotal");

const gst = document.getElementById("gst");

const total = document.getElementById("total");

const addButtons = document.querySelectorAll(".add-cart");

const couponInput = document.getElementById("coupon");

const couponButton = document.getElementById("applyCoupon");

const checkoutButton = document.getElementById("checkoutButton");



/*======================================================
                    CART
======================================================*/

let cart = JSON.parse(localStorage.getItem("arrozCart")) || [];

let discount = 0;

let couponApplied = false;



/*======================================================
                SAVE CART
======================================================*/

function saveCart(){

    localStorage.setItem(
        "arrozCart",
        JSON.stringify(cart)
    );

}



/*======================================================
                OPEN CART
======================================================*/

if(cartBtn){

    cartBtn.addEventListener("click",()=>{

        cartSidebar.classList.add("active");

    });

}



/*======================================================
                CLOSE CART
======================================================*/

if(closeCart){

    closeCart.addEventListener("click",()=>{

        cartSidebar.classList.remove("active");

    });

}



/*======================================================
            ADD PRODUCTS
======================================================*/

addButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const name = button.dataset.name;

        const price = Number(button.dataset.price);

        const existing = cart.find(item=>item.name===name);

        if(existing){

            existing.quantity++;

        }

        else{

            cart.push({

                name,

                price,

                quantity:1

            });

        }

        saveCart();

        updateCart();

    });

});



/*======================================================
                UPDATE CART
======================================================*/

function updateCart(){

    if(!cartItems) return;

    cartItems.innerHTML = "";

    if(cart.length===0){

        cartItems.innerHTML = `

        <p class="empty-cart">

            Your cart is empty.

        </p>

        `;

        cartCount.textContent = 0;

        subtotal.textContent = "₹0";

        gst.textContent = "₹0";

        total.textContent = "₹0";

        return;

    }



    let subtotalValue = 0;

    let totalItems = 0;



    cart.forEach((item,index)=>{

        subtotalValue += item.price * item.quantity;

        totalItems += item.quantity;

        cartItems.innerHTML += `

        <div class="cart-item">

            <div>

                <div class="cart-item-name">

                    ${item.name}

                </div>

                <div class="cart-item-price">

                    ₹${item.price}

                </div>

                <div class="quantity-box">

                    <button
                        class="quantity-btn minus"
                        data-index="${index}">

                        -

                    </button>

                    <span class="quantity-value">

                        ${item.quantity}

                    </span>

                    <button
                        class="quantity-btn plus"
                        data-index="${index}">

                        +

                    </button>

                </div>

            </div>

        </div>

        `;

    });



    const gstValue = subtotalValue * 0.05;

    const finalTotal = subtotalValue + gstValue - discount;

    cartCount.textContent = totalItems;

    subtotal.textContent = `₹${subtotalValue.toFixed(0)}`;

    gst.textContent = `₹${gstValue.toFixed(0)}`;

    total.textContent = `₹${Math.max(finalTotal,0).toFixed(0)}`;



    quantityButtons();

}

/*======================================================
            SCRIPT.JS - PART 2
======================================================*/


/*======================================================
            QUANTITY BUTTONS
======================================================*/

function quantityButtons(){

    const plusButtons = document.querySelectorAll(".plus");
    const minusButtons = document.querySelectorAll(".minus");



    plusButtons.forEach(button=>{

        button.onclick = ()=>{

            const index = Number(button.dataset.index);

            cart[index].quantity++;

            saveCart();

            updateCart();

        };

    });



    minusButtons.forEach(button=>{

        button.onclick = ()=>{

            const index = Number(button.dataset.index);

            cart[index].quantity--;

            if(cart[index].quantity <= 0){

                cart.splice(index,1);

            }

            saveCart();

            updateCart();

        };

    });

}



/*======================================================
                COUPON SYSTEM
======================================================*/

const coupons = {

    "ARROZ100":100,

    "WELCOME50":50,

    "BIRYANI25":25

};



if(couponButton){

    couponButton.addEventListener("click",()=>{

        if(cart.length===0){

            alert("Your cart is empty.");

            return;

        }



        if(couponApplied){

            alert("Coupon already applied.");

            return;

        }



        const code = couponInput.value
            .trim()
            .toUpperCase();



        if(!coupons[code]){

            alert("Invalid coupon code.");

            return;

        }



        discount = coupons[code];

        couponApplied = true;



        alert(`Coupon Applied! ₹${discount} OFF`);

        updateCart();

    });

}



/*======================================================
            CHECKOUT BUTTON
======================================================*/

if(checkoutButton){

    checkoutButton.addEventListener("click",()=>{

        if(cart.length===0){

            alert("Please add items to your cart.");

            return;

        }



        document
            .getElementById("checkout")
            .scrollIntoView({

                behavior:"smooth"

            });



        cartSidebar.classList.remove("active");

    });

}



/*======================================================
            CLOSE CART ON OUTSIDE CLICK
======================================================*/

document.addEventListener("click",(e)=>{

    if(

        cartSidebar.classList.contains("active")

        &&

        !cartSidebar.contains(e.target)

        &&

        !cartBtn.contains(e.target)

    ){

        cartSidebar.classList.remove("active");

    }

});



/*======================================================
            ESC KEY CLOSE
======================================================*/

document.addEventListener("keydown",(e)=>{

    if(

        e.key==="Escape"

        &&

        cartSidebar.classList.contains("active")

    ){

        cartSidebar.classList.remove("active");

    }

});



/*======================================================
            INITIALIZE
======================================================*/

updateCart();


/*======================================================
            SCRIPT.JS - PART 3
            CHECKOUT & WHATSAPP ORDER
======================================================*/

const checkoutForm = document.getElementById("checkoutForm");



/*======================================================
            PLACE ORDER
======================================================*/

if(checkoutForm){

    checkoutForm.addEventListener("submit",function(e){

        e.preventDefault();



        if(cart.length===0){

            alert("Your cart is empty.");

            return;

        }



        const customerName = document
            .getElementById("customerName")
            .value
            .trim();

        const customerPhone = document
            .getElementById("customerPhone")
            .value
            .trim();

        const customerEmail = document
            .getElementById("customerEmail")
            .value
            .trim();

        const customerCity = document
            .getElementById("customerCity")
            .value
            .trim();

        const customerAddress = document
            .getElementById("customerAddress")
            .value
            .trim();



        if(
            !customerName ||
            !customerPhone ||
            !customerCity ||
            !customerAddress
        ){

            alert("Please fill all required fields.");

            return;

        }



        const payment = document.querySelector(
            'input[name="payment"]:checked'
        ).value;



        let subtotalValue = 0;

        let message =
`🍛 *ARROZ INDIANO ORDER*

`;



        cart.forEach(item=>{

            subtotalValue += item.price * item.quantity;

            message +=
`• ${item.name}
Qty : ${item.quantity}
Price : ₹${item.price}

`;

        });



        const gstValue = subtotalValue * 0.05;

        const finalTotal = subtotalValue + gstValue - discount;



        message +=
`--------------------------

Subtotal : ₹${subtotalValue.toFixed(0)}

GST : ₹${gstValue.toFixed(0)}

Discount : ₹${discount}

Total : ₹${finalTotal.toFixed(0)}

--------------------------

Customer Details

Name : ${customerName}

Phone : ${customerPhone}

Email : ${customerEmail || "-"}

City : ${customerCity}

Address :

${customerAddress}

Payment :

${payment}

`;



        /*======================================================
                CHANGE THIS NUMBER
        ======================================================*/

        const whatsappNumber = "919355652060";



        const whatsappURL =
`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;



        window.open(
            whatsappURL,
            "_blank"
        );



        alert(
            "Thank you! Your order is ready to be sent on WhatsApp."
        );



        cart = [];

        discount = 0;

        couponApplied = false;



        localStorage.removeItem("arrozCart");



        if(couponInput){

            couponInput.value = "";

        }



        updateCart();



        checkoutForm.reset();

    });

}



/*======================================================
        PAGE LOAD
======================================================*/

window.addEventListener("load",()=>{

    updateCart();

});



/*======================================================
            END OF SCRIPT
======================================================*/

