const permissions = {
  "Customer": {
    "Product Info": "R",
    "Order Info": "R/W",
    "User Profiles": "R/W",
    "Inventory Data": "NA",
    "Payment Info": "R",
    "Shipping Data": "R",
    "Reviews": "R",
    "Analytics": "NA",
    "Promotions": "NA",
    "Admin Settings": "NA",
    "Legal Data": "NA"
  },
  "Vendor": {
    "Product Info": "R/W",
    "Order Info": "R",
    "User Profiles": "NA",
    "Inventory Data": "R/W",
    "Payment Info": "NA",
    "Shipping Data": "NA",
    "Reviews": "R",
    "Analytics": "NA",
    "Promotions": "NA",
    "Admin Settings": "NA",
    "Legal Data": "NA"
  },
  "Warehouse Staff": {
    "Product Info": "NA",
    "Order Info": "NA",
    "User Profiles": "NA",
    "Inventory Data": "R/W",
    "Payment Info": "NA",
    "Shipping Data": "R/W",
    "Reviews": "NA",
    "Analytics": "NA",
    "Promotions": "NA",
    "Admin Settings": "NA",
    "Legal Data": "NA"
  },
  "Delivery Personnel": {
    "Product Info": "NA",
    "Order Info": "R",
    "User Profiles": "NA",
    "Inventory Data": "R",
    "Payment Info": "NA",
    "Shipping Data": "R/W",
    "Reviews": "NA",
    "Analytics": "NA",
    "Promotions": "NA",
    "Admin Settings": "NA",
    "Legal Data": "NA"
  },
  "Customer Service": {
    "Product Info": "R",
    "Order Info": "R/W",
    "User Profiles": "R",
    "Inventory Data": "NA",
    "Payment Info": "R",
    "Shipping Data": "R",
    "Reviews": "R",
    "Analytics": "NA",
    "Promotions": "NA",
    "Admin Settings": "NA",
    "Legal Data": "NA"
  },
  "Marketing Team": {
    "Product Info": "R",
    "Order Info": "NA",
    "User Profiles": "NA",
    "Inventory Data": "NA",
    "Payment Info": "NA",
    "Shipping Data": "NA",
    "Reviews": "R",
    "Analytics": "R",
    "Promotions": "R/W",
    "Admin Settings": "NA",
    "Legal Data": "NA"
  },
  "Finance Team": {
    "Product Info": "NA",
    "Order Info": "R",
    "User Profiles": "NA",
    "Inventory Data": "NA",
    "Payment Info": "R/W",
    "Shipping Data": "NA",
    "Reviews": "NA",
    "Analytics": "NA",
    "Promotions": "NA",
    "Admin Settings": "NA",
    "Legal Data": "NA"
  },
  "IT Team": {
    "Product Info": "R/W",
    "Order Info": "R/W",
    "User Profiles": "R/W",
    "Inventory Data": "R/W",
    "Payment Info": "R/W",
    "Shipping Data": "R/W",
    "Reviews": "R/W",
    "Analytics": "R",
    "Promotions": "NA",
    "Admin Settings": "R/W",
    "Legal Data": "NA"
  },
  "Legal Team": {
    "Product Info": "NA",
    "Order Info": "NA",
    "User Profiles": "NA",
    "Inventory Data": "NA",
    "Payment Info": "NA",
    "Shipping Data": "NA",
    "Reviews": "NA",
    "Analytics": "NA",
    "Promotions": "NA",
    "Admin Settings": "NA",
    "Legal Data": "R"
  },
  "Admin": {
    "Product Info": "R/W",
    "Order Info": "R/W",
    "User Profiles": "R/W",
    "Inventory Data": "R/W",
    "Payment Info": "R/W",
    "Shipping Data": "R/W",
    "Reviews": "R/W",
    "Analytics": "R/W",
    "Promotions": "R/W",
    "Admin Settings": "R/W",
    "Legal Data": "R/W"
  }
};

export default permissions;