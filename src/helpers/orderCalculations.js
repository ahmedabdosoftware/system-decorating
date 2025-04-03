export function calculateGrandTotal(orderInfo, isCustomized) {
    let totalMaterials = 0;
  
    // حساب إجمالي المواد من المنتجات العادية
    if (orderInfo.products) {
      totalMaterials += orderInfo.products.reduce((total, product) => {
        const productPrice =
          product.priceWithIncrease && isCustomized === "true"
            ? product.priceWithIncrease
            : product.productInfo.priceMaterial;
  
        const productTotalPrice = productPrice * product.quantity;
        const discountAmount = productTotalPrice * (product.price_offer / 100);
        return total + (productTotalPrice - discountAmount);
      }, 0);
    }
  
    // حساب إجمالي المواد من حقول Joker
    if (orderInfo.jokerFields) {
      totalMaterials += orderInfo.jokerFields.reduce((total, joker) => {
        if (joker.willBeCalculated && joker.calculationType === "material") {
          if (joker.value && joker.quantity) {
            return total + joker.value * joker.quantity;
          } else if (joker.value) {
            return total + joker.value;
          }
        }
        return total;
      }, 0);
    }
  
    // حساب تكلفة الشحن
    const shippingCost = Number(orderInfo.shipping) || 0;
    return (totalMaterials + shippingCost).toFixed(2);
  }
  
  export function calculateTotalQuantity(orderInfo) {
    return orderInfo.products.reduce((total, product) => {
      return product.productInfo.priceWithLabor ? total + Number(product.quantity) : total;
    }, 0);
  }
  
  export function calculateTotalInstallationWithJoker(orderInfo, isCustomized) {
    let totalInstallation = 0;
  
    // حساب التركيبات من المنتجات العادية
    if (orderInfo.products) {
      totalInstallation += orderInfo.products.reduce((total, product) => {
        let productInstallationPrice = 0;
  
        if (
          isCustomized === "true" &&
          product.editOfInstallation &&
          Number(product.editOfInstallation) > 0
        ) {
          productInstallationPrice = product.editOfInstallation * product.quantity;
        } else if (product.productInfo.priceWithLabor) {
          productInstallationPrice = product.productInfo.priceWithLabor * product.quantity;
        }
  
        return total + productInstallationPrice;
      }, 0);
    }
  
    // حساب التركيبات من حقول Joker
    if (orderInfo.jokerFields) {
      totalInstallation += orderInfo.jokerFields.reduce((total, joker) => {
        if (joker.willBeCalculated && joker.calculationType === "installation") {
          if (joker.value && joker.quantity) {
            return total + joker.value * joker.quantity;
          } else if (joker.value) {
            return total + joker.value;
          }
        }
        return total;
      }, 0);
    }
  
    return totalInstallation.toFixed(2);
  }
  
  export function calculateTotalInstallation(orderInfo, isCustomized) {
    return orderInfo.laborPrice ? orderInfo.laborPrice : calculateTotalInstallationWithJoker(orderInfo, isCustomized);
  }
  