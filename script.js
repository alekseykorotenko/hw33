const data = {
  Fruits: ['Apples', 'Bananas', 'Oranges'],
  Vegetables: ['Potatos', 'Tomatos', 'Cucumbers'],
  Berries: ['Strawberries', 'Grapes', 'Cherry'],
  Drinks: ['Soda', 'Coffee', 'Juice']
};

const prices = {
  Apples: 10,
  Bananas: 15,
  Oranges: 12,
  Potatos: 9,
  Tomatos: 8,
  Cucumbers: 6,
  Strawberries: 20,
  Grapes: 18,
  Cherry: 16,
  Soda: 7,
  Coffee: 3,
  Juice: 13
};

const leftSideBar = document.getElementById('left-sidebar');
const categoriesSection = document.getElementById('categories-section');
const categoryList = document.getElementsByClassName('category');
const productList = document.getElementById('product-list');
const productDetails = document.getElementById('product-details');
const buyButton = document.getElementById('buy-button');
const productsSection = document.getElementById('products-section');
const productsInfo = document.getElementById('products-info');
const orderForm = document.getElementById('order-form');
const orderButton = document.getElementById('orders-button');
const shoppingCart = document.getElementById('shopping-cart-section');
let selectedProduct;

function showProducts(category) {
  const products = data[category];
  productList.innerHTML = '';

  products.forEach((product, index) => {
    const listItem = document.createElement('li');
    listItem.id = 'product-list-item-' + product.toLowerCase();
    listItem.innerText = product;
    listItem.setAttribute('product-item-index', index);
    productList.appendChild(listItem);
  });
}

Array.from(categoryList).forEach((el) => {
  el.addEventListener('click', (event) => {
    const category = event.target.textContent;
    showProducts(category);
    productsSection.style.display = 'block';
    productsInfo.style.display = 'none';
    orderForm.reset();
  });
});

productList.addEventListener('click', (event) => {
  const product = event.target.textContent;
  productDetails.textContent = 'You choose: ' + product.toLowerCase();
  orderForm.style.display = 'none';
  productsInfo.style.display = 'block';
  orderForm.reset();
  selectedProduct = product;
});

buyButton.addEventListener('click', () => {
  orderForm.style.display = 'block';
});

function fillingForm() {
  const fullName = document.getElementById('full-name').value;
  const city = document.getElementById('city').value;
  const branch = document.getElementById('delivery-branch').value;
  const cashOnDelivery = document.getElementById('cash-on-delivery');
  const cardPayment = document.getElementById('card-payment');
  const quantity = document.getElementById('quantity').value;
  const comment = document.getElementById('comment').value;
  const price = prices[selectedProduct] * quantity;
  let selectedPaymentMethod;
  if (cashOnDelivery.checked) {
    selectedPaymentMethod = cashOnDelivery.value;
  }
  if (cardPayment.checked) {
    selectedPaymentMethod = cardPayment.value;
  }

  const order = {
    product: selectedProduct.toLowerCase(),
    price: price,
    orderTime: new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' }),
    city: city,
    deliveryBranch: branch,
    cardPayment: selectedPaymentMethod,
    quantity: quantity,
    fullName: fullName,
    comment: comment
  };

  return order;
}

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (orderForm.checkValidity()) {
    const order = fillingForm();
    saveOrder(order);

    alert(
      `You choose: ${order.product} : ${order.quantity} number of products. \n 
      City: ${order.city}. \n 
      System of payment:  ${order.cardPayment} \n
      Delivery branch: ${order.deliveryBranch}.\n Thank you for you order`
    );

    orderForm.reset();

    productDetails.innerText = '';
    productsInfo.style.display = 'none';
    productsSection.style.display = 'none';
    orderForm.style.display = 'none';
  }
});

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}

function getOrders() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}

orderButton.addEventListener('click', () => {
  categoriesSection.style.display = 'none';
  productsInfo.style.display = 'none';
  productDetails.style.display = 'none';
  productsSection.style.display = 'none';
  orderForm.style.display = 'none';
  shoppingCart.style.display = 'block';

  showUserOrders();
});

function showUserOrders() {
  shoppingCart.innerHTML = '';
  const storedObjects = getOrders();
  const shoppingCartTitle = document.createElement('h2');
  shoppingCartTitle.id = 'shopping-cart-title';
  shoppingCartTitle.textContent = 'Basket';
  shoppingCartTitle.style.display = 'block';
  shoppingCart.appendChild(shoppingCartTitle);

  const orderList = getOrdersTable(storedObjects);

  const shoppingCartList = document.createElement('div');
  shoppingCartList.id = 'shopping-cart-list';
  shoppingCartList.style.display = 'flex';
  shoppingCartList.style.flexDirection = 'column';
  shoppingCartList.innerHTML = orderList.join('');

  shoppingCart.appendChild(shoppingCartList);
  const updatePageButton = document.createElement('button');
  updatePageButton.id = 'update-page-button';
  updatePageButton.textContent = 'Return to main';

  const orderCartList = document.getElementsByClassName('order-title');
  const orderDetails = document.getElementsByClassName('order-details');
  //   const orderDelete = document.getElementsByClassName('order-delete');

  Array.from(orderCartList).forEach((el, index) => {
    el.addEventListener('click', (event) => {
      const order = event.target.textContent;
      orderDetails[index].style.display = 'block';

      const orderDelete = document.getElementsByClassName('order-delete')[index];
      orderDelete.style.display = 'block';

      // console.log(orderDelete);
      orderDelete.addEventListener('click', () => {
        removeOrder(orderDelete.value);
        showUserOrders();
      });
    });
  });

  const backButton = document.getElementById('back-button');
  backButton.addEventListener('click', () => {
    shoppingCart.style.display = 'none';
    categoriesSection.style.display = 'block';
  });
}

function getOrdersTable(orders) {
  const ordersList = [];
  orders.forEach((el, index) => {
    const orderTitle = 'Order ' + (index + 1);
    const orderDetails = `<span class="order-title">${orderTitle}</span>
        <ul class="order-details">
            <li> Name: ${el.fullName} </li>
            <li> City: ${el.city} </li>
            <li> Delivery Branch: ${el.deliveryBranch} </li>
            <li> Product: ${el.product} </li>
            <li> Type of Payment: ${el.cardPayment} </li>
            <li> Quantity: ${el.quantity} </li>
            <li> Price: ${el.price} </li>
            <li> Order Time: ${el.orderTime} </li> </ul>
            <button class="order-delete" value="${index}">Delete order</button>`;
    ordersList.push(orderDetails);
  });
  ordersList.push(`<button id="back-button"> Go Back </button>`);
  return ordersList;
}

function removeOrder(index) {
  const currentOrders = getOrders();
  currentOrders.splice(index, 1) || [];
  localStorage.clear();
  localStorage.setItem('orders', JSON.stringify(currentOrders));
}
