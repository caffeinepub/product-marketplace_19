import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    stockQuantity : Nat;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type CustomerInfo = {
    name : Text;
    address : Text;
    email : Text;
  };

  type Order = {
    orderId : Nat;
    customerInfo : CustomerInfo;
    items : [CartItem];
    totalAmount : Nat;
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  let carts = Map.empty<Principal, Map.Map<Nat, CartItem>>();
  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, imageUrl : Text, stockQuantity : Nat) : async Nat {
    let product : Product = {
      id = nextProductId;
      name;
      description;
      price;
      imageUrl;
      stockQuantity;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, description : Text, price : Nat, imageUrl : Text, stockQuantity : Nat) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          price;
          imageUrl;
          stockQuantity;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.remove(id);
      };
    };
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (quantity > product.stockQuantity) {
          Runtime.trap("Insufficient stock quantity");
        };

        let cart = switch (carts.get(caller)) {
          case (null) {
            let newCart = Map.empty<Nat, CartItem>();
            carts.add(caller, newCart);
            newCart;
          };
          case (?existingCart) { existingCart };
        };

        let existingQuantity = switch (cart.get(productId)) {
          case (null) { 0 };
          case (?item) { item.quantity };
        };
        let newQuantity = existingQuantity + quantity;

        cart.add(productId, { productId; quantity = newQuantity });
      };
    };
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (null) { [ ] };
      case (?cart) { cart.values().toArray() };
    };
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, quantity : Nat) : async () {
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (quantity > product.stockQuantity) {
          Runtime.trap("Insufficient stock quantity");
        };

        switch (carts.get(caller)) {
          case (null) { Runtime.trap("Cart not found") };
          case (?cart) {
            switch (cart.get(productId)) {
              case (null) { Runtime.trap("Product not found in cart") };
              case (?_) {
                cart.add(productId, { productId; quantity });
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func removeCartItem(productId : Nat) : async () {
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        switch (cart.get(productId)) {
          case (null) { Runtime.trap("Product not found in cart") };
          case (?_) {
            cart.remove(productId);
          };
        };
      };
    };
  };

  public shared ({ caller }) func checkout(customerInfo : CustomerInfo) : async Nat {
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };

    let items = cart.values().toArray();
    if (items.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    var totalAmount = 0;
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found") };
        case (?product) {
          if (item.quantity > product.stockQuantity) {
            Runtime.trap("Insufficient stock quantity for " # product.name);
          };
          totalAmount += product.price * item.quantity;
        };
      };
    };

    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) {};
        case (?product) {
          let updatedProduct : Product = {
            product with
            stockQuantity = product.stockQuantity - item.quantity;
          };
          products.add(item.productId, updatedProduct);
        };
      };
    };

    let order : Order = {
      orderId = nextOrderId;
      customerInfo;
      items;
      totalAmount;
    };
    orders.add(nextOrderId, order);
    nextOrderId += 1;

    cart.clear();
    order.orderId;
  };
};
