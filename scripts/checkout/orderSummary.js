import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions,getDeliveryOption} from '../../data/delivery-option.js';

function updateCartQuantity(){
  let cartQuantity = 0;

  cart.forEach((item)=>{
    cartQuantity += item.quantity;
  })
  if(cartQuantity===0){
    document.querySelector('.js-checkout-header-middle').innerHTML = 'Check out()'
  }else{
    document.querySelector('.js-checkout-header-middle').innerHTML = `Check out(${cartQuantity})`
  }
}

export function renderOrderSummary(){

  let cartSummaryHTML = '';
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct= getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
      const toDay = dayjs();
      const deliveryDate = toDay.add(
        deliveryOption.deliveryDays,
        'days'
      )
      const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionHTML(matchingProduct,cartItem)}
        </div>
      </div>
    </div>
    `
    updateCartQuantity();
  });

  function deliveryOptionHTML(matchingItems, cartItem){  
    let html = '';

    deliveryOptions.forEach((item)=>{
      const toDay = dayjs();
      const deliveryDate = toDay.add(
        item.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format('dddd, MMMM D');
      const princeString = item.priceCents === 0 ? 'FREE - ' : `$${formatCurrency(item.priceCents)} -`
      const isChecked = item.id === cartItem.deliveryOptionId ? 'checked' : ''

      html+=`
        <div class="delivery-option js-delivery-option" 
          data-product-id="${matchingItems.id}" 
          data-delivery-id= "${item.id}"
        >
          <input type="radio"
            ${isChecked}
            class="delivery-option-input"
            name="delivery-option-${matchingItems.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${princeString} Shipping
            </div>
          </div>  
        </div>
      `
    })
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML= cartSummaryHTML;
  
  document.querySelectorAll('.js-delete-link').forEach((link)=>{
    link.addEventListener('click',()=>{
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      updateCartQuantity();
      container.remove();
    })
  })

  document.querySelectorAll('.js-delivery-option').forEach((element)=>{
    element.addEventListener('click', ()=>{
      const {productId, deliveryId} = element.dataset;
      updateDeliveryOption(productId,deliveryId);
      renderOrderSummary();
    })
  })
}
