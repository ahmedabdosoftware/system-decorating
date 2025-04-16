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
          <v-btn color="success" style="width: 120px;" @click="showProductDialog = true">➕ إضافة منتج</v-btn>
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
                <v-list-item @click="deleteProduct(product.id)">
                  <v-list-item-title>حذف</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
        </v-list>
      </div>
  
      <!-- دايلوج إضافة منتج -->
      <v-dialog v-model="showProductDialog" max-width="800">
        <v-card>
          <v-card-title class="text-right">إضافة منتج جديد</v-card-title>
          <v-card-text>
            <v-text-field v-model="productForm.name" label="اسم المنتج" outlined dense />
            <v-textarea v-model="productForm.description" label="الوصف" outlined dense />
            <v-text-field v-model="productForm.size" label="المقاس" outlined dense />
            <v-text-field v-model="productForm.price" label="السعر" outlined dense />
            <v-select :items="categories" item-text="name" item-value="id" v-model="productForm.categoryId" label="التصنيف" outlined dense />
            <v-text-field v-model="productForm.unit" label="الوحدة (مثل متر / لوح)" outlined dense />
            <v-text-field v-model="productForm.discount" label="الخصم (إن وجد)" outlined dense />
            
            <!-- رفع صور -->
            <v-file-input
              label="صور المنتج"
              multiple
              show-size
              v-model="productForm.images"
              outlined
              dense
              @change="handleImageUpload"
            />
            <div class="flex flex-wrap mt-2 gap-2">
              <div v-for="(img, index) in productForm.images" :key="index" class="relative w-24 h-24">
                <img :src="img.preview || URL.createObjectURL(img)" class="w-full h-full object-cover rounded" />
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
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="showProductDialog = false">إلغاء</v-btn>
            <v-btn color="primary" @click="saveProduct">حفظ</v-btn>
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
            <v-btn color="primary" @click="saveCategory">حفظ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: "HandelCatalog",
    data() {
      return {
        products: [
      {
        id: 1,
        name: "دهان بلاستيك أبيض",
        description: "دهان عالي الجودة يستخدم للأسطح الداخلية.",
        size: "5 لتر",
        price: "250",
        categoryId: 1,
        unit: "علبة",
        discount: "10",
        colors: ["أبيض", "بيج", "رمادي"],
        images: [
          { preview: "https://via.placeholder.com/150" },
          { preview: "https://via.placeholder.com/150/aaaaaa" },
        ],
      },
      {
        id: 2,
        name: "ورق حائط مودرن",
        description: "تصميم عصري مناسب لغرف النوم والمعيشة.",
        size: "10 متر",
        price: "600",
        categoryId: 2,
        unit: "لفة",
        discount: "0",
        colors: ["ذهبي", "أسود", "رمادي"],
        images: [
          { preview: "https://via.placeholder.com/150/eeeeee" },
        ],
      },
    ],
        categories: [
        { id: 1, name: "دهانات" },
        { id: 2, name: "ورق حائط" },
        { id: 3, name: "أسقف معلقة" },
        ],
        showProductDialog: false,
        showCategoryDialog: false,
        productForm: {
          name: "",
          description: "",
          size: "",
          price: "",
          categoryId: null,
          unit: "",
          colors: [],
          discount: "",
          images: [],
        },
        categoryForm: {
          name: "",
        },
      };
    },
    methods: {
      saveProduct() {
        // logic للحفظ
        this.showProductDialog = false;
      },
    //   saveCategory() {
    //     // logic للحفظ
    //     this.showCategoryDialog = false;
    //   },
    //   editProduct(product) {
    //     // logic للتعديل
    //   },
    //   deleteProduct(id) {
    //     // logic للحذف
    //   },
    //   editCategory(category) {
    //     // logic للتعديل
    //   },
    //   deleteCategory(id) {
    //     // logic للحذف
    //   },
    //   handleImageUpload(event) {
    //     // ممكن تحسين المعالجة لاحقًا
    //   },
      removeImage(index) {
        this.productForm.images.splice(index, 1);
      },
    },
  };
  </script>
  