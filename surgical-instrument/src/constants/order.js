
const ORDER_STATUS = {
  CREATED: 'created',
  REJECTED: 'rejected',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};
const DELIVERY_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  };
const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
};
const PAYMENT_METHOD = {
  STRIPE: "stripe",
  PAYPAL: "paypal",
  COD: "cod",
};
module.exports = {
  ORDER_STATUS,DELIVERY_STATUS,PAYMENT_STATUS,PAYMENT_METHOD
}