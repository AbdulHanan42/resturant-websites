 $(document).ready(function() {
    const storedCart = localStorage.getItem('burgerCart');
    const storedAccount = localStorage.getItem('burgerUserAccount');
    const storedSession = localStorage.getItem('burgerUserSession');

    let burgerCart = storedCart ? JSON.parse(storedCart) : [];
    let userAccount = storedAccount ? JSON.parse(storedAccount) : null;
    let userSession = storedSession ? JSON.parse(storedSession) : { loggedIn: false };

    function saveCart() {
        localStorage.setItem('burgerCart', JSON.stringify(burgerCart));
    }

    function saveAccount() {
        if (userAccount) {
            localStorage.setItem('burgerUserAccount', JSON.stringify(userAccount));
        }
    }

    function saveSession() {
        localStorage.setItem('burgerUserSession', JSON.stringify(userSession));
    }

    function updateAuthLinks() {
        if (userSession && userSession.loggedIn) {
            $('.auth-links').addClass('d-none');
            $('.user-dropdown').removeClass('d-none');
            $('.nav-user').text(userSession.name || userSession.email);
            $('.user-detail-name').text(userSession.name || 'N/A');
            $('.user-detail-email').text(userSession.email || 'N/A');
            $('.user-detail-phone').text(userSession.phone || 'N/A');
        } else {
            $('.auth-links').removeClass('d-none');
            $('.user-dropdown').addClass('d-none');
        }
    }

    function updateCartCount() {
        const total = burgerCart.reduce((sum, item) => sum + item.quantity, 0);
        $('.cart-count').text(total ? `(${total})` : '');
    }

    function showToast(message, type = 'success') {
        const toast = $(`<div class="toast-message ${type}">${message}</div>`);
        $('body').append(toast);
        setTimeout(() => toast.addClass('visible'), 10);
        setTimeout(() => {
            toast.removeClass('visible');
            setTimeout(() => toast.remove(), 300);
        }, 2600);
    }

    function showCartMessage(message, type = 'success') {
        $('#cartMessage').html(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}</div>`);
        setTimeout(() => $('#cartMessage').fadeOut(300, function() { $(this).html('').show(); }), 3000);
    }

    function addToCart(item) {
        const existingItem = burgerCart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            burgerCart.push(item);
        }
        saveCart();
        updateCartCount();
        showToast(`${item.quantity} x ${item.name} added to cart.`);
    }

    function renderCart() {
        const cartContainer = $('#cartContainer');
        if (!cartContainer.length) {
            return;
        }

        if (!burgerCart.length) {
            cartContainer.html(`
                <div class="cart-empty text-center py-5">
                    <h3>Your cart is empty</h3>
                    <p>Visit the <a href="menu.html">menu</a> to add tasty items.</p>
                </div>
            `);
            return;
        }

        let rows = '';
        burgerCart.forEach((item, index) => {
            rows += `
                <tr>
                    <td>
                        <strong>${item.name}</strong>
                        <p class="text-muted small mb-0">${item.description || ''}</p>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" min="1" class="form-control cart-qty" data-index="${index}" value="${item.quantity}">
                    </td>
                    <td>$${(item.quantity * item.price).toFixed(2)}</td>
                    <td><button type="button" class="btn btn-link text-danger remove-item" data-index="${index}">Remove</button></td>
                </tr>
            `;
        });

        const total = burgerCart.reduce((sum, item) => sum + item.quantity * item.price, 0);
        cartContainer.html(`
            <div class="cart-table-wrapper table-responsive">
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div class="cart-summary p-4 bg-white rounded shadow-sm mt-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>Total</h5>
                    <strong>$${total.toFixed(2)}</strong>
                </div>
                <div class="d-flex flex-column flex-sm-row gap-2">
                    <button type="button" id="checkoutButton" class="btn btn-primary">Checkout</button>
                    <a class="btn btn-outline-secondary" href="menu.html">Continue Shopping</a>
                </div>
                ${!userSession.loggedIn ? '<p class="mt-3 text-danger">You must <a href="login.html">log in</a> before placing an order.</p>' : ''}
            </div>
        `);
    }

    updateAuthLinks();
    updateCartCount();
    renderCart();

    $('.btn-order').click(function() {
        window.location.href = 'menu.html';
    });

    $('.menu-btn').click(function() {
        const overlay = $(this).closest('.menu-overlay');
        const parent = $(this).closest('.menu-item');
        let quantity = parseInt(overlay.find('.qty-input').val(), 10) || 1;
        if (quantity < 1) {
            quantity = 1;
        }

        addToCart({
            name: $(this).data('name'),
            price: parseFloat($(this).data('price')),
            quantity,
            description: parent.find('.menu-desc').text().trim(),
        });
    });

    $('body').on('click', '.logout-link', function(event) {
        event.preventDefault();
        userSession = { loggedIn: false };
        saveSession();
        updateAuthLinks();
        showToast('You have been logged out.', 'info');
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
        }
    });

    if ($('#contactForm').length) {
        $('#contactForm').submit(function(event) {
            event.preventDefault();
            showToast('Thank you! Your message has been sent.', 'success');
            $(this).trigger('reset');
        });
    }

    if ($('#loginForm').length) {
        $('#loginForm').submit(function(event) {
            event.preventDefault();
            const email = $('#loginEmail').val().trim();
            const password = $('#loginPassword').val();
            const errorField = $('#loginError');
            errorField.text('');

            if (!userAccount) {
                errorField.text('No account found. Please sign up first.');
                return;
            }

            if (userAccount.email !== email || userAccount.password !== password) {
                errorField.text('Email or password is incorrect.');
                return;
            }

            userSession = { 
                loggedIn: true, 
                email: userAccount.email, 
                name: userAccount.name,
                phone: userAccount.phone,
                address: userAccount.address
            };
            saveSession();
            updateAuthLinks();
            showToast('Login successful!', 'success');
            window.location.href = 'index.html';
        });
    }

    if ($('#signupForm').length) {
        $('#signupForm').submit(function(event) {
            event.preventDefault();
            const name = $('#signupName').val().trim();
            const email = $('#signupEmail').val().trim();
            const password = $('#signupPassword').val();
            const phone = $('#signupPhone').val().trim();
            const address = $('#signupAddress').val().trim();
            const errorField = $('#signupError');
            errorField.text('');

            if (!name || !email || !password || !phone || !address) {
                errorField.text('Please complete every field.');
                return;
            }

            userAccount = { name, email, password, phone, address };
            saveAccount();
            userSession = { loggedIn: true, email, name, phone, address };
            saveSession();
            updateAuthLinks();
            showToast('Account created successfully!', 'success');
            window.location.href = 'index.html';
        });
    }

    $('#cartContainer').on('change', '.cart-qty', function() {
        const index = parseInt($(this).data('index'), 10);
        const newQuantity = parseInt($(this).val(), 10) || 1;

        if (newQuantity < 1) {
            burgerCart.splice(index, 1);
        } else {
            burgerCart[index].quantity = newQuantity;
        }

        saveCart();
        updateCartCount();
        renderCart();
    });

    $('#cartContainer').on('click', '.remove-item', function() {
        const index = parseInt($(this).data('index'), 10);
        burgerCart.splice(index, 1);
        saveCart();
        updateCartCount();
        renderCart();
        showToast('Item removed from cart.', 'info');
    });

    $('body').on('click', '#checkoutButton', function() {
        if (!userSession.loggedIn) {
            showToast('Please log in before checking out.', 'danger');
            window.location.href = 'login.html';
            return;
        }

        if (!burgerCart.length) {
            showToast('Your cart is empty.', 'info');
            return;
        }

        burgerCart = [];
        saveCart();
        updateCartCount();
        renderCart();
        showToast('Order placed successfully! Thank you.', 'success');
        showCartMessage('Your order was placed successfully. We will contact you shortly.', 'success');
    });

    $('a[href^="#"]').on('click', function(event) {
        const target = $(this).attr('href');
        if (target === '#') {
            return;
        }

        if ($(target).length) {
            event.preventDefault();
            $('html, body').animate({ scrollTop: $(target).offset().top - 70 }, 800);
        }
    });
});
