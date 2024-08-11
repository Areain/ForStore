const products = [];

// Load products from localStorage when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products.push(...JSON.parse(storedProducts));
        renderProductList();
    }
});

// Handle form submission to add or update a product
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').files[0];

    const reader = new FileReader();
    reader.onload = function() {
        const product = {
            name,
            category,
            price,
            image: reader.result
        };

        // Check if we are updating an existing product
        const index = document.getElementById('productIndex').value;
        if (index !== '') {
            products[index] = product;
        } else {
            products.push(product);
        }

        localStorage.setItem('products', JSON.stringify(products));
        renderProductList();
        resetForm();
    };
    reader.readAsDataURL(image);
});

// Function to display a product in the product list
function displayProduct(product, index) {
    const productList = document.getElementById('productList');
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div>
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <p>Rs. ${product.price}</p>
            <button onclick="removeProduct(${index})">Remove</button>
            <button onclick="customizeProduct(${index})">Customize</button>
        </div>
    `;
    productList.appendChild(productDiv);
}

// Function to remove a product by index
function removeProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    renderProductList();
}

// Function to customize a product by index
function customizeProduct(index) {
    const product = products[index];
    document.getElementById('name').value = product.name;
    document.getElementById('category').value = product.category;
    document.getElementById('price').value = product.price;
    document.getElementById('productIndex').value = index;

    // Clear the image input (since it can't be programmatically set)
    document.getElementById('image').value = null;
}

// Render the entire product list
function renderProductList() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach((product, index) => displayProduct(product, index));
}

// Reset the form fields
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productIndex').value = '';
}

// Handle input in the search bar for autocomplete suggestions
document.getElementById('searchBar').addEventListener('input', function(e) {
    const searchValue = e.target.value.toLowerCase();
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    if (searchValue) {
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchValue)
        );

        filteredProducts.forEach(product => {
            const li = document.createElement('li');
            li.classList.add('suggestion-item');
            li.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="max-width: 50px; vertical-align: middle; margin-right: 10px;">
                ${product.name}
            `;
            li.addEventListener('click', function() {
                displaySearchResult(product);
                suggestions.innerHTML = '';
                e.target.value = '';
            });
            suggestions.appendChild(li);
        });
    }
});

// Function to display the search result
function displaySearchResult(product) {
    const productList = document.getElementById('productList');
    productList.innerHTML = `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <p>Rs ${product.price}</p>
            </div>
        </div>
    `;
}