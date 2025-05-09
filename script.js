const exampleCartItem = {
    productName: "socks",
    productPrice: 18.99,
    productQuantity: 1,
    productImage: "image/src.jpg",
    productID: 12345, //if applicable (i imagine it is)
};
let cart = [];

function getCart() {
    return cart;
}

getCartFromSession();

function getCartFromSession() {
    const cartSession = JSON.parse(sessionStorage.getItem("cart"));
    console.log(cartSession);
    if (cartSession) {
        cart = cartSession;
        $(".cart-amount").html(cartSession.length > 0 ? cartSession.length : $(".cart-amount").hide());
        $(".cart-amount").show();
    }
}

function addItemToCart(item) {
    console.log("adding to cart: " + JSON.stringify(item));
    cart.push(item);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    $("#cart").val(cart); //might be able to deprecate this then
    //add a message that says that the item has been added to the cart
}

function removeFromCart(item) {
    //remove it here
}

function submitOrder() {
    //call serverless function here to generate checkout session i think
    console.log("CART: " + JSON.stringify(cart));
}

$(document).ready(function () {
    let isMenuActive = false;
    let isCartActive = false;

    $(".loader").hide();

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
        // console.log("Window resized to: " + $(window).width() + "x" + $(window).height());
        const heightOfVideo = $("#content-video").height();
        $(".content-gif-overlay").height(heightOfVideo);
    });

    $(".view-hoodie-btn").click(function () {
        window.location.href = "hoodie.html";
    });

    $(".view-cap-btn").click(function () {
        window.location.href = "baseballcap.html";
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

    //now actually dynamically fill cart here
    $(".cart-icon").click(function () {
        ////need to adjust spacing on some things
        //make the trash button actually do something
        cart.forEach((item) => {
            $(".checkout-items").append(`
                <div class='checkout-item'>
                    <img src='${item.productImage}' class='checkout-item-image' />
                    <div class='checkout-item-details'>
                        <p class='checkout-item-title'>${item.productName}</p>
                        <div style='display: flex; flex-direction: row; gap: 10px; align-items: center;'>
                            <label for='checkout-item-quantity-select' class='checkout-item-select-label'>Quantity: </label>
                            <select class='checkout-item-quantity-select'>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option selected>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </select>
                    <img src='images/trash.png' class='checkout-remove-item' />     
                        </div>
                    </div>  
                </div>
            `);
        });

        $(".checkout-menu").animate({ right: "0px" }, "slow");
        $(".checkout-menu").css("display", "flex");
        $("#unfocused-div").css("display", "block");
        isCartActive = true;
    });

    $("#unfocused-div").click(function () {
        //hide the mobile menu
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

    $("#content-contactme-btn").click(function () {
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

    $("#nav-button-aboutme").click(function () {
        if (checkIfOnIndexPage() == false) {
            window.location.href = "index.html?scrollTo=aboutme";
        }
        $("html, body").animate(
            {
                scrollTop: $(".content-box-2").offset().top - 100,
            },
            1000
        );
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

    $("#mobile-menu-aboutme").click(function () {
        if (checkIfOnIndexPage() == false) {
            window.location.href = "index.html?scrollTo=aboutme";
        }
        $("html, body").animate(
            {
                scrollTop: $(".content-box-2").offset().top - 100,
            },
            1000
        );
        hideMobileMenu();
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
        hideCart();
    });

    function hideCart() {
        $(".checkout-menu").animate({ right: -340 }, "slow");
        $("#unfocused-div").css("display", "none");
        isMenuActive = false;
    }

    //change this to check if NOT on index page so we can redirect to from a specific item as well => what am i talking about here
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
                    }
                    break;
                case "aboutme":
                    {
                        $("html, body").animate(
                            {
                                scrollTop: $(".content-box-2").offset().top - 100,
                            },
                            1000
                        );
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
                    }
                    break;
            }
        }
    }
});
