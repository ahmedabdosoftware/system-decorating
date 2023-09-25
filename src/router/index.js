import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Reviews from "../views/Reviews.vue";
import AddCatagory from "../views/category/AddCatagory.vue";
import Category from "../views/category/Category.vue";
import Product from "../views/product/Product.vue";
import EditCategory from "../views/category/EditCategory.vue";
import EditProduct from "../views/product/EditProduct.vue";
import AddNewProduct from "../views/product/AddNewProduct.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/Reviews",
    name: "Reviews",
    component: Reviews,
  }, 
  {
    path: "/addcatagory",
    name: "AddCatagory",
    component: AddCatagory,
  },
  {
    path: "/Category",
    name: "Category",
    component: Category,
  },
  {
    path: "/Product",
    name: "Product",
    component: Product,
  },
  {
    path: "/AddNewProduct",
    name: "AddNewProduct",
    component: AddNewProduct,
  },
  {
    path: "/EditCategory/:id",
    name: "EditCategory",
    component: EditCategory,
  },
  {
    path: "/EditProduct/:id",
    name: "EditProduct",
    component: EditProduct,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
