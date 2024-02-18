export let cart = JSON.parse(localStorage.getItem('cart')) || [{
    productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity:2,
    deliveryOptionId:'1'
}];

// if(!cart) {
//   cart = [{
//     id:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
//     quantity:2
//   }]
// }

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
  let matchingItem;

  cart.forEach((cartItem)=>{
    if(productId===cartItem.productId){
      matchingItem = cartItem;
    }
  })

  if(matchingItem){
    matchingItem.quantity++;
  } else{
      cart.push({
        productId: productId,
        quantity: 1,
        deliveryOptionId: '1'
      });
  }
  saveToStorage();
}

export function removeFromCart(productId){
  const newCart =[];
  cart.forEach((item) =>{
    if(item.productId !== productId){
      newCart.push(item)
    }
  });
  cart = newCart;
  saveToStorage();
}

export function updateDeliveryOption(productId,deliveryId){
  let matchingItem;
  cart.forEach((cartItem)=>{
    if(productId===cartItem.productId){
      matchingItem = cartItem;
    }
  })

  matchingItem.deliveryOptionId = deliveryId;
  saveToStorage();
}