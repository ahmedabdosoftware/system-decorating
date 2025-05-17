import { defineStore } from "pinia";
import { db } from "@/firebase/firebaseConfig.js";

export const usePortfolioStore = defineStore("portfolioStore", {
  state: () => ({
    categories: [],
    products: [],
        lastVisibleDoc: null,
        endReached: false,
    loading: false,


  }),

  actions: {
     async fetchCategories(companyName) {
      this.loading = true;
      const querySnapshot = await db.collection("portfolioCategories")
     .where("companyName", "==", companyName)
     .get();
      this.categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.loading = false;
    },

    // Pagination Products
    async fetchProducts(companyName) {
    this.loading = true;
    try {
        const querySnapshot = await db
        .collection("portfolioProducts")
        .where("companyName", "==", companyName)
        .limit(5)
        .get();

        this.products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));

        this.lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        this.endReached = querySnapshot.docs.length < 5;

    } catch (error) {
        console.error("خطأ في جلب المنتجات:", error);
    } finally {
        this.loading = false;
    }
    },

    async loadMore(companyName) {
    if (this.endReached || !this.lastVisibleDoc) return;
    this.loading = true;

    try {
        const querySnapshot = await db
        .collection("portfolioProducts")
        .where("companyName", "==", companyName)
        .startAfter(this.lastVisibleDoc)
        .limit(5)
        .get();

        const newProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));

        this.products.push(...newProducts);

        if (querySnapshot.docs.length < 5) {
        this.endReached = true;
        } else {
        this.lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        }

    } catch (error) {
        console.error("خطأ في تحميل المزيد:", error);
    } finally {
        this.loading = false;
    }
    },

    async searchProducts(companyName,searchQuery) {
    if (!searchQuery) {
        this.products = [];
        this.lastVisibleDoc = null;
        this.endReached = false;
        return this.fetchProducts(companyName); // رجوع للوضع العادي
    }

    this.loading = true;
    try {
        const querySnapshot = await 
       db.collection("portfolioProducts")
        .where("companyName", "==", companyName)
        // To Fix Using More Than Query Issue In Firebase ::👇💪--
        //  Added Magic keywords To Every Product And Use "array-contains" (THATS WOW ) 
        .where("keywords", "array-contains", searchQuery)
        // .where("name", "<=", searchQuery + "\uf8ff")
        .get();

        this.products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));

        this.lastVisibleDoc = null; // مفيش Load more في البحث
        this.endReached = true;

    } catch (error) {
        console.error("خطأ في البحث عن المنتجات:", error);
    } finally {
        this.loading = false;
    }
    },

    async addCategory(category) {

        this.loading = true;
        const docRef = await db.collection("portfolioCategories").add(category);
        this.categories.push({ id: docRef.id, ...category });
        this.loading = false;

    },

    async deleteCategory(categoryId) {
      await db.collection("portfolioCategories").doc(categoryId).delete();
      this.categories = this.categories.filter((c) => c.id !== categoryId);
    },
     async updateCategory(categoryId, updatedData) {
       
       this.loading = true;
      await db.collection("portfolioCategories").doc(categoryId).update(updatedData);
      const index = this.categories.findIndex((c) => c.id === categoryId);
      if (index !== -1) {
        this.categories[index] = { id: categoryId, ...updatedData };
      }
      this.loading = false;

    },

    async uploadImageToImgBB(file) {
      const apiKey = 'a70bc1d60d105c80b4eb207fb2ca3ba1';
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("رفع الصورة فشل");
      }

      return data.data.url;
    },

    async addProduct(productData) {
      this.loading = true;
      try {
        // سجل المنتج الجديد في Firestore
        const newProduct = {
          ...productData,
          createdAt: new Date(),
        };

        const docRef = await db.collection("portfolioProducts").add(newProduct);

        this.products.push({ id: docRef.id, ...newProduct });
      } catch (error) {
        console.error("حدث خطأ أثناء إضافة المنتج:", error);
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(productId) {
      this.loading = true;
      try {
        await db.collection("portfolioProducts").doc(productId).delete();
        this.products = this.products.filter((p) => p.id !== productId);
      } catch (error) {
        console.error("حدث خطأ أثناء حذف المنتج:", error);
      } finally {
        this.loading = false;
      }
    },
     async updateProduct(productId, updatedData) {
       
       this.loading = true;
      await db.collection("portfolioProducts").doc(productId).update(updatedData);
      const index = this.products.findIndex((p) => p.id === productId);
      if (index !== -1) {
        this.products[index] = { id: productId, ...updatedData };
      }
     this.loading = false;

    },
  },
});
