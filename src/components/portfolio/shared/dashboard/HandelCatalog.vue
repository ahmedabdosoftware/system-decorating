<template>
    <div class="space-y-6">
      <!-- الكاتيجوري -->
      <div>
        <div class="flex justify-between items-center">
          <h3 class="text-right text-lg font-bold">التصنيفات</h3>
          <v-btn color="primary" style="width: 120px;" @click="showCategoryDialog = true">➕ إضافة تصنيف</v-btn>
        </div>
        <v-list>
          <v-list-item v-for="category in categories" :key="category.id">
            <v-list-item-title>{{ category.name }}</v-list-item-title>
            <v-btn icon @click="editCategory(category)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon @click="deleteCategory(category.id)"><v-icon>mdi-delete</v-icon></v-btn>
          </v-list-item>
        </v-list>
      </div>
  
     <!-- المنتجات -->
      <div>
        <div class="flex justify-between items-center">
          <h3 class="text-right text-lg font-bold">المنتجات</h3>
          <div style="display: flex !important; flex-direction: row !important;" class="flex search-products-catalog justify-between items-center gap-2">
            <v-btn color="success" style="width: 120px;" @click="showProductDialog = true">➕ إضافة منتج</v-btn>
            <v-text-field style="margin-right: 10px;"
              v-model="searchQuery"
              label="بحث عن منتج"
              outlined
              dense
              hide-details
              clearable
              class="w-64"
            />
          </div>
        </div>
        <v-list>
          <v-list-item v-for="product in products" :key="product.id">
            <v-list-item-content>
              <v-list-item-title>{{ product.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ product.description }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="editProduct(product)">
                  <v-list-item-title>تعديل</v-list-item-title>
                </v-list-item>
                <v-list-item @click="HandeldeleteProduct(product.id)">
                  <v-list-item-title>حذف</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
        </v-list>

        <div class="text-center mt-4">
          <v-btn v-if="!endReached && !searchQuery" style="width: 120px;" @click="loadMore(tenantUid)" :loading="loading" color="primary" outlined>عرض المزيد</v-btn>
        </div>
      </div>

  
      <!-- دايلوج إضافة منتج -->
      <v-dialog class="add-product-dia" v-model="showProductDialog" max-width="800">
        <v-card>
          <v-card-title class="text-right">إضافة منتج جديد</v-card-title>
          <v-card-text>
            <v-text-field v-model="productForm.name" label="اسم المنتج" outlined dense />
            <v-textarea v-model="productForm.description" label="الوصف" outlined dense />
            <v-text-field v-model="productForm.size" label="المقاس" outlined dense />
            <v-text-field v-model="productForm.price" label="السعر" outlined dense />
            <v-select :items="categories" item-text="name" item-value="name" v-model="productForm.category" label="التصنيف" outlined dense />
            <v-text-field v-model="productForm.unit" label="الوحدة (مثل متر / لوح)" outlined dense />
            <v-text-field v-model="productForm.discount" label="الخصم (إن وجد)" outlined dense />
            
            <!-- رفع صور -->
            <v-file-input
              label="صور المنتج"
              multiple
              show-size
              outlined
              dense
              @change="handleImageUpload"
            />
            <div class="flex flex-wrap mt-2 gap-2">
              <div v-for="(img, index) in productForm.images" :key="index" class="relative w-24 h-24">
                <img :src="getImageSrc(img)" height="80" width="80" />
                <v-btn icon small class="absolute top-0 right-0" @click="removeImage(index)">
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </div>
            </div>
  
            <!-- الألوان -->
            <v-combobox
              v-model="productForm.colors"
              label="الألوان المتوفرة"
              multiple
              outlined
              dense
              clearable
              chips
            />
            <v-combobox
              v-model="productForm.Feature"
              label="المميزات مثل : مقاوم لرطوبه "
              multiple
              outlined
              dense
              clearable
              chips
            />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="showProductDialog = false">إلغاء</v-btn>
            <v-btn :loading="loading" color="primary" @click="saveProduct">حفظ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- دايلوج إضافة كاتيجوري -->
      <v-dialog v-model="showCategoryDialog" max-width="500">
        <v-card>
          <v-card-title class="text-right">إضافة تصنيف</v-card-title>
          <v-card-text>
            <v-text-field v-model="categoryForm.name" label="اسم التصنيف" outlined dense />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="showCategoryDialog = false">إلغاء</v-btn>
            <v-btn :loading="loading" color="primary" @click="saveCategory">حفظ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  // Store
import { mapState, mapActions } from "pinia";
import { usePortfolioStore } from "@/store/portfolio/portfolioData/catalog";
// mixins
import tenantUidMixin from "@/mixins/tenantUidMixin";
import textHelpers from "@/mixins/textHelpers";

  export default {
    name: "HandelCatalog",
    mixins: [textHelpers,tenantUidMixin],
    data() {
      return {
        searchQuery: "",
        visibleCount: 5, // عدد المنتجات المبدئي
        showProductDialog: false,
        showCategoryDialog: false,
        productForm: {
          name: "",
          description: "",
          size: "",
          price: "",
          category: null,
          unit: "",
          colors: [],
          Feature: [],
          discount: "",
          images: [],
        },
        categoryForm: {
          name: "",
        },
      };
    },
    computed: {

  ...mapState(usePortfolioStore, ["products", "categories", "loading","endReached"]),
    },
    methods: {

      ...mapActions(usePortfolioStore, [
        "fetchCategories", "fetchProducts", "addCategory", "updateCategory", "deleteCategory",
        "addProduct", "updateProduct", "deleteProduct","searchProducts","loadMore", "uploadImageToImgBB"
      ]),

      
      async saveProduct() {
        const product = { ...this.productForm };
        // Link The Product With UserId
        product.userId = this.tenantUid;
        // For Search Easely In Firestore Without Problem (index)
        product.keywords = this.generateKeywords(product.name);
        product.keywordsCategory = this.generateKeywords(product.category);
        product.keywordsPrice = this.generateKeywords(product.price);
        product.keywordsColors = this.generateKeywords(product.colors);
        product.keywordsFeature = this.generateKeywords(product.Feature);

        // Pictures First
         const imageUrls = [];
        if (product.images && product.images.length > 0) {
          for (const img of product.images) {
            if (typeof img === "string") {
              // الصورة موجودة مسبقًا كرابط (مش صورة جديدة)
              imageUrls.push(img);
            } else if (img instanceof File) {
              // الصورة جديدة من نوع File - نرفعها
              const uploadedURL = await this.uploadImageToImgBB(img);
              imageUrls.push(uploadedURL);
            } else {
              // حالة غير متوقعة، ممكن تتجاهل أو تعطي تحذير هنا
              console.warn("صورة غير صالحة في المعرض:", img);
            }
          }
        } else {
          console.warn("لا توجد صور في المعرض للرفع");
        }
        product.images = imageUrls
        
        ;
        // Add Or Edit
        if (product.id) {
          await this.updateProduct(product.id, product);
        } else {
          await this.addProduct(product);
        }

        this.resetProductForm();
        this.showProductDialog = false;
      },

    
      async saveCategory() {
        const category = { ...this.categoryForm };
        category.userId = this.tenantUid;

        if (category.id) {
          await this.updateCategory(category.id, category);
        } else {
          await this.addCategory(category);
        }

        this.categoryForm = { name: "" };
        this.showCategoryDialog = false;
      },

      editProduct(product) {
        this.productForm = { ...product };
        this.showProductDialog = true;
    },
      async HandeldeleteProduct(id) {
        if (confirm("هل أنت متأكد من حذف المنتج؟")) {
          await this.deleteProduct(id);
        }
      },

    editCategory(category) {
      this.categoryForm = { ...category };
      this.showCategoryDialog = true;
    },
    async deleteCategory(id) {
      if (confirm("هل أنت متأكد من حذف التصنيف؟")) {
        await this.deleteCategory(id);
      }
    },

   handleImageUpload(newFiles) {
        if (!newFiles) return;

        const total = this.productForm.images.length + newFiles.length;

        if (total > 4) {
            const availableSlots = 4 - this.form.gallery.length;
            const filesToAdd = newFiles.slice(0, availableSlots);
            this.productForm.images(...filesToAdd);
        } else {
            this.productForm.images.push(...newFiles);
        }
        },

    resetProductForm() {
      this.productForm = {
        name: "",
        description: "",
        size: "",
        price: "",
        category: null,
        unit: "",
        colors: [],
        Feature: [],
        discount: "",
        images: [],
      };
      },
        getImageSrc(img) {
        return typeof img === "string" ? img : URL.createObjectURL(img);
      },
      removeImage(index) {
        this.productForm.images.splice(index, 1);
      },
     
    },
    watch: {
      tenantUid(newVal) {
      if (newVal) {
        console.log("userId", newVal);
        this.fetchCategories(newVal);
        this.fetchProducts(newVal);
      }
    },
    searchQuery: function () {
      this.searchProducts(this.tenantUid,this.searchQuery);
    }
  },




  };
  </script>
  <style scoped>
 
</style>