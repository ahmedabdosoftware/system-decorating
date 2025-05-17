import Vue from "vue";
import VueRouter from "vue-router";
import { db, auth } from "@/firebase/firebaseConfig.js";

import ManageTenants from "../views/management/ManageTenants.vue";
import MainDashboard from "@/shared/layouts/MainDashboard.vue";
import Dashboard from "../views/dashboard/Dashboard.vue";
import Reviews from "../views/Reviews.vue";
import Category from "../views/category/Category.vue";
import AddCatagory from "../views/category/AddCatagory.vue";
import EditCategory from "../views/category/EditCategory.vue";
import Product from "../views/product/Product.vue";
import AddNewProduct from "../views/product/AddNewProduct.vue";
import EditProduct from "../views/product/EditProduct.vue";
import Units from "../views/product/units/Units.vue";
import AddUnit from "../views/product/units/AddUnit.vue";
import EditUnit from "../views/product/units/EditUnit.vue";

// Old Design
import AddNewOrder from "../views/order/oldDesign/AddNewOrder.vue";
import EditOrder from "../views/order/oldDesign/EditOrder.vue";
import Fatora from "../views/order/oldDesign/invoice/Fatora.vue";
import CustomInvoice from "../views/order/oldDesign/invoice/CustomInvoice.vue";
import DetailsOrder from "../views/order/oldDesign/DetailsOrder.vue";
import Order from "../views/order/oldDesign/Order.vue";

// New Design => what is New Components?
import AddNewOrderNewDesign from "../views/order/newDesign/AddNewOrder.vue";
import EditOrderNewDesign from "../views/order/newDesign/EditOrder.vue";
// Test
import test from "../views/order/Test/test.vue";

import Branches from "../views/storage/Branches.vue";
import AddNewBranch from "../views/storage/AddNewBranch.vue";
import EditBranch from "../views/storage/EditBranch.vue";
import DetailsBranch from "../views/storage/DetailsBranch.vue";
import Transfer from "../views/storage/transfer/Transfer.vue";
import AddTransfer from "../views/storage/transfer/AddTransfer.vue";
import StockAlerts from "../views/storage/Stockalerts/StockAlerts.vue";
import Purchases from "../views/purchase/Purchases.vue";
import AddPurchase from "../views/purchase/AddPurchase.vue";
import DetailsPurchase from "../views/purchase/DetailsPurchase.vue";
import Returns from "../views/returns/Returns.vue";
import AddPurchaseReturn from "../views/returns/AddPurchaseReturn.vue";
import DetailsReturn from "../views/returns/DetailsReturn.vue";

import Technical from "../views/users/technicalPages/Technical.vue";
import AddTechnical from "../views/users/technicalPages/AddTechnical.vue";
import Clint from "../views/users/clintePages/Clint.vue";
import AddClint from "../views/users/clintePages/AddClint.vue";
import deleteUser from "../views/users/shared/deleteUser.vue";

import MainProfile from "@/shared/layouts/MainProfile.vue";
import UserOrder from "../views/UserProfile/orders/UserOrder.vue";

//  Old
// import UserFinancial from "../views/UserProfile/financial/userFinancial/oldDesign/UserFinancial.vue";
// import AddFinancial from "../views/UserProfile/financial/specificTransaction/AddFinancial.vue";
// import EditTransaction from "../views/UserProfile/financial/specificTransaction/oldDesign/EditTransaction.vue";
// import TransactionDetails from "../views/UserProfile/financial/specificTransaction/oldDesign/TransactionDetails.vue";
// import ListOfTransaction from "../views/UserProfile/financial/specificTransaction/oldDesign/ListOfTransaction.vue";
// import GroupOfFinancial from "../views/UserProfile/financial/specificTransaction/oldDesign/setlling/GroupOfFinancial.vue";

//  New
import UserFinancial from "../views/UserProfile/financial/userFinancial/newDesign/UserFinancial.vue";
// specificTransaction
import AddFinancial from "../views/UserProfile/financial/specificTransaction/newDesign/AddFinancial.vue";
import EditFinancial from "../views/UserProfile/financial/specificTransaction/newDesign/EditFinancial.vue";
import ListOfTransaction from "../views/UserProfile/financial/specificTransaction/newDesign/ListOfTransaction.vue";
// RandomFinancial
import RandomFinancial from "../views/UserProfile/financial/randomFinancial/RandomFinancial.vue";

import UserProject from "../views/UserProfile/projects/UserProject.vue";
import UserSetting from "../views/UserProfile/settings/UserSetting.vue";

import Login from "../views/auth/Login.vue";
// Portfolio 
import ManagePortfolios from "../views/portfolio/manage/ManagePortfolios.vue";
import CompanyPortfolio from "../views/portfolio/portfolioPage/CompanyPortfolio.vue";
// Error acces 
import accessDenied from "../views/Error/access-denied.vue";
import PortfolioAlert from "../views/Error/Portfolio-alert.vue";
import PortfolioNotFound from "../views/Error/PortfolioNotFound.vue";

Vue.use(VueRouter);
const routes = [
  // Error
  {
    path: '/access-denied/:reason',
    name: 'AccessDenied',
    component: accessDenied,
    
  },
  {
    path: '/Portfolio-alert',
    name: 'PortfolioAlert',
    component: PortfolioAlert,
    
  },
  {
    path: '/Portfolio-not-found',
    name: 'PortfolioNotFound',
    component: PortfolioNotFound,
    
  },
  // Dashboard
  {
    path: "/",
    redirect: "/dashboard", // توجيه المسار الجذري إلى "/dashboard"
  },
  {
    path: "/dashboard",
    component: MainDashboard,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
        meta: {
            requiresAuth: true,
            roles: ["admin","superAdmin"] ,
            subscription_type: ["Full System"] ,
          },
      },
      {
        path: "ManageTenants",
        name: "ManageTenants",
        component: ManageTenants,
        meta: { requiresAuth: true, roles: ["superAdmin"] },
      },
      {
        path: "ManagePortfolios",
        name: "ManagePortfolios",
        component: ManagePortfolios,
        meta: { requiresAuth: true, roles: ["superAdmin"] },
      },
      {
        path: "Product",
        name: "Product",
        component: Product,
        meta: {
           requiresAuth: true,
           roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
        },
      },
      {
        path: "AddNewProduct",
        name: "AddNewProduct",
        component: AddNewProduct,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },      
      },
      {
        path: "addcatagory",
        name: "AddCatagory",
        component: AddCatagory,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },        
      },
      {
        path: "Category",
        name: "Category",
        component: Category,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },  
        },
      {
        path: "EditCategory/:id",
        name: "EditCategory",
        component: EditCategory,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },          
      },
      {
        path: "EditProduct/:id",
        name: "EditProduct",
        component: EditProduct,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },          
      },
      {
        path: "EditUnit/:unitId",
        name: "EditUnit",
        component: EditUnit,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },          
      },
      {
        path: "Units",
        name: "Units",
        component: Units,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },          
      },
      {
        path: "AddUnit",
        name: "AddUnit",
        component: AddUnit,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },          
      },
      {
        path: "Order",
        name: "Order",
        component: Order,
        // yes the componnent not common bit inside it another componnent with links and this compomment is comman
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "AddNewOrder",
        name: "AddNewOrder",
        component: AddNewOrder,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },          
      },
      // new design
      {
        path: "v1/AddNewOrder",
        name: "AddNewOrder",
        component: AddNewOrderNewDesign,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },          
      },
      {
        path: "EditOrder/:orderId",
        name: "EditOrder",
        component: EditOrder,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },          
      },
      {
        path: "v1/EditOrder/:orderId",
        name: "EditOrderNewDesign",
        component: EditOrderNewDesign,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },          
      },
      {
        path: "DetailsOrder/:orderId",
        name: "DetailsOrder",
        component: DetailsOrder,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "Fatora/:orderId/:isCustom",
        name: "Fatora",
        component: Fatora,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "CustomInvoice/:orderId",
        name: "CustomInvoice",
        component: CustomInvoice,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      // Test
      {
        path: "test",
        name: "test",
        component: test,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "Branches",
        name: "Branches",
        component: Branches,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "AddNewBranch",
        name: "AddNewBranch",
        component: AddNewBranch,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "EditBranch/:branchId",
        name: "EditBranch",
        component: EditBranch,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "DetailsBranch/:branchId",
        name: "DetailsBranch",
        component: DetailsBranch,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "Transfer",
        name: "Transfer",
        component: Transfer,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "AddTransfer",
        name: "AddTransfer",
        component: AddTransfer,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",

        },
      },
      {
        path: "StockAlerts",
        name: "StockAlerts",
        component: StockAlerts,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "Purchases",
        name: "Purchases",
        component: Purchases,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "AddPurchase",
        name: "AddPurchase",
        component: AddPurchase,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "DetailsPurchases/:purchasesId",
        name: "DetailsPurchase",
        component: DetailsPurchase,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "Returns",
        name: "Returns",
        component: Returns,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "Returns/:purchaseId",
        name: "ReturnsWithId",
        component: Returns,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "PurchaseReturn/:purchasesId",
        name: "PurchaseReturn",
        component: AddPurchaseReturn,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      {
        path: "DetailsReturn/:returnId",
        name: "DetailsReturn",
        component: DetailsReturn,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
          layout: "DashboardLayout",
        },
      },
      //old
      // {
      //   path: "TransactionDetails/:transactionId",
      //   name: "TransactionDetails",
      //   component: TransactionDetails,
      //   meta: { requiresAuth: true, roles: ['admin'],layout: 'DashboardLayout' },
      // },
      {
        path: "Reviews",
        name: "Reviews",
        component: Reviews,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       }, 
      },
      {
        path: "users/technicalPages/Technical",
        name: "Technical",
        component: Technical,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },         
      },
      {
        path: "users/technical/AddTechnical",
        name: "AddTechnical",
        component: AddTechnical,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },         
      },
      {
        path: "users/clintPages/Clint",
        name: "Clint",
        component: Clint,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },         
      },
      {
        path: "users/clint/AddClint",
        name: "AddClint",
        component: AddClint,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },         
      },
      {
        path: "users/clint/deleteUser/:profileId",
        name: "deleteUser",
        component: deleteUser,
        meta: {
          requiresAuth: true,
          roles: ["admin","superAdmin"],
          subscription_type: ["Full System"] ,
       },         
      },
      {
        path: "profile/:profileId",
        component: MainProfile,
        children: [
          {
            path: "",
            name: "AdminUserOrder",
            component: UserOrder,

            // why layout property? good qustion,
            //this componnent inside more than layout and there are links inside this componnent , and ?
            // i just want when i go to any link from thats links i keep on the same layout which i am in

            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },
          {
            path: "financial",
            name: "AdminUserFinancial",
            component: UserFinancial,
            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },
          {
            path: "ListOfTransaction",
            name: "ListOfTransaction",
            component: ListOfTransaction,
            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },
          {
            path: "AddFinancial",
            name: "AdminAddFinancial",
            component: AddFinancial,
            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },
          // New Design
          {
            path: "EditTransaction/:transactionId",
            name: "EditTransaction",
            component: EditFinancial,
            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },

          //old
          // {
          //   path: "TransactionDetails/:transactionId",
          //   name: "AdminTransactionDetails",
          //   component: TransactionDetails,
          //   meta: { requiresAuth: true, roles: ['admin'],layout: 'profileInDashboardLayout' },
          // },
          // {
          //   path: "EditTransaction/:transactionId",
          //   name: "AdminEditTransaction",
          //   component: EditTransaction,
          //   meta: { requiresAuth: true, roles: ['admin'],layout: 'profileInDashboardLayout' },
          // },
          // {
          //   path: "GroupOfFinancial",
          //   name: "GroupOfFinancial",
          //   component: GroupOfFinancial,
          //   meta: { requiresAuth: true, roles: ['admin'],layout: 'profileInDashboardLayout' },
          // },
          {
            path: "RandomFinancial",
            name: "RandomFinancial",
            component: RandomFinancial,
            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },
          {
            path: "projects",
            name: "AdminUserProjects",
            component: UserProject,
            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },
          {
            path: "settings",
            name: "AdminUserSetting",
            component: UserSetting,
            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },
          {
            path: "DetailsOrder/:orderId",
            name: "AdminOrderDetails",
            component: DetailsOrder,
            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },
          {
            path: "Fatora/:orderId/:isCustom",
            name: "AdminOrderFatora",
            component: Fatora,
            meta: {
              requiresAuth: true,
              roles: ["admin","superAdmin"],
              subscription_type: ["Full System"] ,
              layout: "profileInDashboardLayout",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/:companyName",
    name: "companyPortfolio",
    component: CompanyPortfolio,
  },
  {
    path: "/profile/:profileId",
    component: MainProfile,
    children: [
      {
        path: "",
        name: "UserOrder",
        component: UserOrder,
        meta: {
          requiresAuth: true,
          roles: ["technical", "clint", "admin","superAdmin"],
          layout: "profileOutDashboardLayout",
        },
      },
      {
        path: "financial",
        name: "UserFinancial",
        component: UserFinancial,
        meta: {
          requiresAuth: true,
          roles: ["technical", "clint", "admin","superAdmin"],
          layout: "profileOutDashboardLayout",
        },
      },
      {
        path: "ListOfTransaction",
        name: "ListOfTransaction",
        component: ListOfTransaction,
        meta: {
          requiresAuth: true,
          roles: ["technical", "clint", "admin","superAdmin"],
          layout: "profileOutDashboardLayout",
        },
      },
      // New Design
      {
        path: "/transactions/edit/:transactionId/:profileId",
        name: "EditFinancial",
        component: EditFinancial,
        meta: {
           requiresAuth: true, 
           roles: ['technical', 'clint', 'admin'] ,
           layout: 'profileOutDashboardLayout'},
      },
      // old
      // {
      //   path: "TransactionDetails/:transactionId",
      //   name: "UserTransactionDetails",
      //   component: TransactionDetails,
      //   meta: { requiresAuth: true, roles: ['technical', 'clint', 'admin'] ,layout: 'profileOutDashboardLayout'},
      // },
      // {
      //   path: "EditTransaction/:transactionId",
      //   name: "UserEditTransaction",
      //   component: EditTransaction,
      //   meta: { requiresAuth: true, roles: ['technical', 'clint', 'admin'] ,layout: 'profileOutDashboardLayout'},
      // },
      {
        path: "projects",
        name: "UserProjects",
        component: UserProject,
        meta: {
          requiresAuth: true,
          roles: ["technical", "clint", "admin","superAdmin"],
          layout: "profileOutDashboardLayout",
        },
      },
      {
        path: "settings",
        name: "UserSetting",
        component: UserSetting,
        meta: {
          requiresAuth: true,
          roles: ["technical", "clint", "admin","superAdmin"],
          layout: "profileOutDashboardLayout",
        },
      },
      {
        path: "DetailsOrder/:orderId",
        name: "OrderDetails",
        component: DetailsOrder,
        meta: {
          requiresAuth: true,
          roles: ["technical", "clint", "admin","superAdmin"],
          layout: "profileOutDashboardLayout",
        },
      },
      {
        path: "Fatora/:orderId/:isCustom",
        name: "OrderFatora",
        component: Fatora,
        meta: {
          requiresAuth: true,
          roles: ["technical", "clint", "admin","superAdmin"],
          layout: "profileOutDashboardLayout",
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const checkAuthState = () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe(); // Stop listening for auth state changes after we get the current state
        resolve(user);
      });
    });
  };

checkAuthState().then(async (user) => {
  let isUserExist = false;
  let role = null;
  let subscriptionType = null;
  let subscriptionStart = null;
  let subscriptionEnd = null;
  let isActive = false;

  if (user) {
    isUserExist = true;
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      role = userData.role;
      subscriptionType = userData.subscription_type;
      subscriptionStart = userData.subscription_start;
      subscriptionEnd = userData.subscription_end;
      isActive = userData.isActive;  // Assuming you have an `isActive` field
    }
  }

  const requiresAuth = to.meta.requiresAuth;
  const roles = to.meta.roles || [];
  const requiredSubscriptionType = to.meta.subscription_type || [];
  const now = new Date();

    // THANKS CONSOLE : -
    // console.log(isUserExist);
    // console.log("role", role);
    // console.log("subscriptionType", subscriptionType);
    // console.log("subscriptionStart", subscriptionStart);
    // console.log("subscriptionEnd", subscriptionEnd);
    // console.log("isActive", isActive);
    // console.log("requiredSubscriptionType", requiredSubscriptionType);
    // console.log("now", now);
    
    // First check: Super Admin
    if (role === "superAdmin" && isUserExist) {
      return next(); 
    }
    // Second check: If authentication is required but user doesn't exist
    if (requiresAuth && !isUserExist) {
      console.log("go login");
      return next("/login"); 
    }
    // Third check: Other validations for authenticated users
    if (requiresAuth && isUserExist) {
      if (
      (roles.length && !roles.includes(role)) || // دور مش صح
      (requiredSubscriptionType.length && !requiredSubscriptionType.includes(subscriptionType)) || // نوع اشتراك مش صح
      (subscriptionStart && new Date(subscriptionStart) > now) || // الاشتراك لسه مبدأش
      (subscriptionEnd && new Date(subscriptionEnd) < now) || // الاشتراك انتهى
      (!isActive) // الحساب مش Active
      ) {
          return next(`/access-denied/no-permission`); // ✅
      }
    }
    return next();

  
  });
});

export default router;
