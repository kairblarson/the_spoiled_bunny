const exampleCartItem = {
    productName: "socks",
    productPrice: 18.99,
    productQuantity: 1,
    productImage: "image/src.jpg",
    productID: 12345, //if applicable (i imagine it is)
    productFile: "",
};
let cart = [];

function getCart() {
    return cart;
}

getCartFromSession();

function getCartFromSession() {
    const cartSession = JSON.parse(sessionStorage.getItem("cart"));
    console.log("CART SESSION: " + cartSession);
    if (cartSession) {
        cart = cartSession;
        $(".cart-amount").show();
        $(".cart-amount").html(cartSession.length > 0 ? cartSession.length : $(".cart-amount").hide());
    } else {
        $(".cart-amount").hide();
    }
}

function toggleMessageModal() {
    const modal = $(".message-modal");

    modal.addClass("show"); // Slide in

    setTimeout(() => {
        modal.removeClass("show"); // Slide out after 3s
    }, 3000);
}

function addItemToCart(item) {
    console.log("adding to cart: " + JSON.stringify(item));
    cart.push(item);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    toggleMessageModal();
}

$("body").on("click", ".checkout-item", function (e) {
    const file = $(this).data("file");
    window.location.href = file;
});

function removeFromCart(event, item) {
    event.stopPropagation();
    console.log("removing from cart: " + JSON.stringify(item));
    const updatedCart = cart.filter((product) => product.productID != item.productID);
    cart = updatedCart;
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    $(".checkout-items").empty();
    cart.forEach((item) => {
        $(".checkout-items").append(`
            <div class='checkout-item' data-file='${item.productFile}'>
                <img src='${item.productImage}' class='checkout-item-image'/>
                <div class='checkout-item-details'>
                    <p class='checkout-item-title'>${item.productName}</p>
                    <div style='display: flex; flex-direction: row; gap: 10px; align-items: center;'>
                        <label class='checkout-item-select-label'>Quantity: </label>
                        <select class='checkout-item-quantity-select'>
                            ${[...Array(10)].map((_, i) => `<option ${item.productQuantity == i + 1 ? "selected" : ""}>${i + 1}</option>`).join("")}
                        </select>
                        <img src='images/trash.png' class='checkout-remove-item'
                            onClick='removeFromCart(event, ${JSON.stringify(item)})' />     
                    </div>
                </div>  
            </div>
        `);
    });

    if (cart.length == 0) {
        $(".checkout-items").append(`<p style='font-weight: 400'>Your cart is empty</p>`);
        $(".checkout-checkout-btn").prop("disabled", true);
    }

    $(".checkout-menu").animate({ right: "0px" }, "slow");
    $(".checkout-menu").css("display", "flex");
    $("#unfocused-div").css("display", "block");
    isCartActive = true;
    getCartFromSession();
}

function submitOrder() {
    //call serverless function here to generate checkout session
    console.log("Submitting order...: " + JSON.stringify(cart));
    fetch("api/create-checkout-session", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            line_items: [
                { price: "price_123", quantity: 2 },
                { price: "price_456", quantity: 1 },
            ],
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("RES: "+res);
            // window.location.href = data.url; // redirect to Stripe Checkout
        });
}

$(document).ready(function () {
    let isMenuActive = false;
    let isCartActive = false;

    $(".loader").hide();

    $(".checkout-checkout-btn").click(submitOrder);

    //need to do some form validation and add a loading modal or something
    $("#contact-form").on("submit", function (event) {
        const isValidated = performFormValidation();

        if (!isValidated) return false;

        $("#send-btn-text").hide();
        $(".loader").show();

        emailjs.init("5TPwb3kOLF_MWJSG7");

        event.preventDefault();

        emailjs.sendForm("service_xraq8lh", "template_fvfhpkr", this).then(
            function (response) {
                $(".loader").hide();
                $("#send-btn-text").show();
                alert("Email has been sent, we will get back to you shortly");
                document.getElementById("contact-form").reset();
            },
            function (error) {
                $(".loader").hide();
                $("#send-btn-text").show();
                alert("Email could not be sent, please try again later");
                console.log("FAILED...", error);
            }
        );
    });

    // $(".search-icon").click(toggleMessageModal);

    function performFormValidation() {
        const nameField = $("#from_name");
        const emailField = $("#reply_to");
        const messageField = $("#message");

        if (nameField[0].value.trim() === "") {
            nameField.addClass("invalid-field");
            alert("Please enter your name before sending a message");
            return false;
        }

        if (emailField[0].value.trim() == "" || !emailField[0].value.trim().includes("@")) {
            emailField.addClass("invalid-field");
            alert("Please enter your email before sending a message");
            return false;
        }

        if (messageField[0].value.trim() == "") {
            messageField.addClass("invalid-field");
            alert("Please enter a message before sending a message");
            return false;
        }

        return true;
    }

    $(".merch-other-img").click(function () {
        const prevSelectedImageNode = $(".selected-image");
        prevSelectedImageNode.removeClass("selected-image");
        $(this).addClass("selected-image");
        $("#selected-merch-image").attr("src", $(this).attr("src"));
    });

    $("#merch-right-arrow").click(function () {
        const selectedImage = $(".selected-image");
        const selectedImageID = Number(selectedImage.attr("id").substring(10, selectedImage.attr("id").length));

        if (selectedImageID >= 3) {
            $("#merch-img-1").addClass("selected-image");
            $("#selected-merch-image").attr("src", $("#merch-img-1").attr("src"));
        } else {
            $(`#merch-img-${selectedImageID + 1}`).addClass("selected-image");
            $("#selected-merch-image").attr("src", $(`#merch-img-${selectedImageID + 1}`).attr("src"));
        }

        selectedImage.removeClass("selected-image");
    });

    $("#merch-left-arrow").click(function () {
        const selectedImage = $(".selected-image");
        const selectedImageID = Number(selectedImage.attr("id").substring(10, selectedImage.attr("id").length));

        if (selectedImageID <= 1) {
            $("#merch-img-3").addClass("selected-image");
            $("#selected-merch-image").attr("src", $("#merch-img-3").attr("src"));
        } else {
            $(`#merch-img-${selectedImageID - 1}`).addClass("selected-image");
            $("#selected-merch-image").attr("src", $(`#merch-img-${selectedImageID - 1}`).attr("src"));
        }

        selectedImage.removeClass("selected-image");
    });

    //product pages
    $(".princess-pink-btn").on("click", function () {
        window.location.href = "PrincessPilatesPink.html";
    });

    $(".get-a-grip-btn").on("click", function () {
        window.location.href = "GetAGrip.html";
    });

    $(".dirty-martini-btn").on("click", function () {
        window.location.href = "DirtyMartini.html";
    });

    $(".cherry-red-btn").on("click", function () {
        window.location.href = "CherryRed.html";
    });

    $(".bow-light-btn").on("click", function () {
        window.location.href = "BowLightBlue.html";
    });

    $(".hot-girls-pilates-btn").on("click", function () {
        window.location.href = "HotGirlsPilates.html";
    });
    //

    $(".menu-container").click(function () {
        if ($("#menuCheckbox").prop("checked") == true) {
            $("#menu").animate({ left: "-=100px" }, "slow");
        } else {
            $("#menu").animate({ left: "+=100px" }, "slow");
        }
    });

    //setting the height of the gradient overlay
    const heightOfVideo = $("#content-video").height();
    $(".content-gif-overlay").height(heightOfVideo);

    //setting the height of the unfocused div for when the mobile menu is active
    $("#unfocused-div").height($(window).height);

    //placing the mobile menu off the screen
    const widthOfMenu = $("#mobile-menu-container").width();
    $("#mobile-menu-container").css({
        top: "0px",
        left: -(widthOfMenu + 100),
    });

    const widthOfCheckout = $(".checkout-menu").width();
    $(".checkout-menu").css({
        top: "0px",
        right: -(widthOfCheckout + 200),
    });

    $(window).resize(function () {
        const heightOfVideo = $("#content-video").height();
        $(".content-gif-overlay").height(heightOfVideo);
    });

    $("#menu-container").click(function () {
        if (isMenuActive) {
            $("#mobile-menu-container").animate({ left: -200 }, "slow");
            $("#unfocused-div").css("display", "none");
            isMenuActive = false;
        } else {
            $("#mobile-menu-container").animate({ left: "0px" }, "slow");
            $("#mobile-menu-container").css("display", "flex");
            $("#unfocused-div").css("display", "block");
            isMenuActive = true;
            $(".menu-bar").css("background-color", "black");
        }
    });

    //get this working
    window.toProductPage = function (file) {
        window.location.href = file;
    };

    //now actually dynamically fill cart here
    $(".cart-icon, .cart-amount").click(function () {
        document.body.style.overflowY = "hidden";
        $(".checkout-items").empty();
        cart.forEach((item) => {
            $(".checkout-items").append(`
                <div class='checkout-item' data-file='${item.productFile}'>
                    <img src='${item.productImage}' class='checkout-item-image' />
                    <div class='checkout-item-details'>
                        <p class='checkout-item-title'>${item.productName}</p>
                        <div style='display: flex; flex-direction: row; gap: 10px; align-items: center;'>
                            <label for='checkout-item-quantity-select' class='checkout-item-select-label'>Quantity: </label>
                            <select class='checkout-item-quantity-select'>
                                <option ${item.productQuantity == 1 ? "selected" : null}>1</option>
                                <option ${item.productQuantity == 2 ? "selected" : null}>2</option>
                                <option ${item.productQuantity == 3 ? "selected" : null}>3</option>
                                <option ${item.productQuantity == 4 ? "selected" : null}>4</option>
                                <option ${item.productQuantity == 5 ? "selected" : null}>5</option>
                                <option ${item.productQuantity == 6 ? "selected" : null}>6</option>
                                <option ${item.productQuantity == 7 ? "selected" : null}>7</option>
                                <option ${item.productQuantity == 8 ? "selected" : null}>8</option>
                                <option ${item.productQuantity == 9 ? "selected" : null}>9</option>
                                <option ${item.productQuantity == 10 ? "selected" : null}>10</option>
                            </select>
                            <img src='images/trash.png' class='checkout-remove-item' onClick='removeFromCart(event, ${JSON.stringify(item)})'/>     
                        </div>
                    </div>  
                </div>
            `);
        });

        if (cart.length == 0) {
            $(".checkout-items").append(`<p style='font-weight: 400'>Your cart is empty</p>`);
            $(".checkout-checkout-btn").prop("disabled", true);
        }

        $(".checkout-menu").animate({ right: "0px" }, "slow");
        $(".checkout-menu").css("display", "flex");
        $("#unfocused-div").css("display", "block");
        isCartActive = true;
    });

    $("#unfocused-div").click(function () {
        //hide the mobile menu
        document.body.style.overflowY = "auto";

        if (isMenuActive && !isCartActive) {
            $("#mobile-menu-container").animate({ left: -200 }, "slow");
            $("#unfocused-div").css("display", "none");
            isMenuActive = false;
        }

        //hide cart
        if (isCartActive && !isMenuActive) {
            $(".checkout-menu").animate({ right: -400 }, "slow");
            $("#unfocused-div").css("display", "none");
            isCartActive = false;
        }
    });

    $("#content-programs-btn").click(function () {
        if (checkIfOnIndexPage() == false) {
            window.location.href = "index.html?scrollTo=programs";
        }
        $("html, body").animate(
            {
                scrollTop: $(".content-box-3").offset().top - 100,
            },
            1000
        );
    });

    $("#content-contactme-btn, #footer-contact-me").click(function () {
        if (checkIfOnIndexPage() == false) {
            window.location.href = "index.html?scrollTo=contactme";
        }
        $("html, body").animate(
            {
                scrollTop: $(".content-box-4").offset().top - 100,
            },
            1000
        );
    });

    //main nav buttons
    $("#nav-button-home").click(function () {
        if (checkIfOnIndexPage() == false) {
            window.location.href = "index.html?scrollTo=home";
        }
        $("html, body").animate(
            {
                scrollTop: $("#main").offset().top,
            },
            1000
        );
    });

    $("#nav-button-about").click(function () {
        window.location.href = "about.html";
    });

    $("#nav-button-contactme").click(function () {
        if (checkIfOnIndexPage() == false) {
            window.location.href = "index.html?scrollTo=contactme";
        }
        $("html, body").animate(
            {
                scrollTop: $(".content-box-4").offset().top,
            },
            1000
        );
    });

    $("#nav-button-merchandise").click(function () {
        window.location.href = "merchandise.html";
    });

    $("#main-products-btn").click(function () {
        window.location.href = "merchandise.html";
    });
    //

    //mobile nav buttons
    $("#mobile-menu-home").click(function () {
        if (checkIfOnIndexPage() == false) {
            window.location.href = "index.html?scrollTo=home";
        }
        $("html, body").animate(
            {
                scrollTop: $("#main").offset().top,
            },
            1000
        );
        hideMobileMenu();
    });

    $("#mobile-menu-aboutme, #get-to-know-btn").click(function () {
        window.location.href = "about.html";
    });

    $("#mobile-menu-contactme").click(function () {
        if (checkIfOnIndexPage() == false) {
            window.location.href = "index.html?scrollTo=contactme";
        }
        $("html, body").animate(
            {
                scrollTop: $(".content-box-4").offset().top - 100,
            },
            1000
        );
        hideMobileMenu();
    });

    $("#mobile-menu-merchandise").click(function () {
        window.location.href = "merchandise.html";
        hideMobileMenu();
    });
    //

    function hideMobileMenu() {
        $("#mobile-menu-container").animate({ left: -200 }, "slow");
        $("#unfocused-div").css("display", "none");
        isMenuActive = false;
    }

    $(".checkout-close-btn").click(function () {
        document.body.style.overflowY = "auto";
        hideCart();
    });

    function hideCart() {
        $(".checkout-menu").animate({ right: -340 }, "slow");
        $("#unfocused-div").css("display", "none");
        isCartActive = false;
    }

    function checkIfOnIndexPage() {
        if (window.location.pathname == "/index.html") {
            return true;
        } else {
            return false;
        }
    }

    scrollToSection();
    function scrollToSection() {
        if (window.location.search.includes("=")) {
            switch (window.location.search.substring(10, window.location.search.length)) {
                case "home":
                    {
                        $("html, body").animate(
                            {
                                scrollTop: $("#main").offset().top,
                            },
                            1000
                        );

                        let url = new URL(window.location.href);
                        url.searchParams.delete("scrollTo");
                        window.history.replaceState({}, "", url);
                    }
                    break;
                case "contactme":
                    {
                        $("html, body").animate(
                            {
                                scrollTop: $(".content-box-4").offset().top - 100,
                            },
                            1000
                        );

                        let url = new URL(window.location.href);
                        url.searchParams.delete("scrollTo");
                        window.history.replaceState({}, "", url);
                    }
                    break;
            }
        }
    }
});
