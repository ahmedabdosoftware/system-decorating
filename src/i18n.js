import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

// رسائل الترجمة
const messages = {
  en: {
    services: {
      title: "Services",
      loading: "Loading Services...",
      noData: "No services found.",
      details: {
        descriptionTitle: "Service Description",
        installationTitle: "Installation Details",
        standardInstallation: "Standard Installation",
        standardInstallationNote: "Includes basic setup and configuration",
        additionalSpecs: "Additional Specifications",
        highlightsTitle: "Service Highlights",
        time: "Average completion time: 4–6 hours",
        schedule: "Scheduling available 7 days a week",
        tools: "All tools and materials provided",
        limitedTitle: "Limited Time Offer",
        claim: "Claim Offer",
        included: "included",
        benefit1: "Professional installation by certified technicians",
        benefit2: "Premium materials and components",
        benefit3: "2-year warranty on all installations",
      }
    },
     hero:{
        catalog:"CATALOG",
    },
    header:{
        navbar: {
            services: "Services",
            portfolio: "Portfolio",
            request: "Request",
            contact: "Contact",
        },
        request:"Request",
    },
    portfolio:{
        title: "Portfolio",
        all: "All",
        loading: "Loading projects...",
        noProjects: "No projects found.",
        loadMore: "Load more",
        project: {
            materials: "Materials Used",
            duration: "Project Duration",
            testimonial: "Client Testimonial",
            location: "Location",
            category: "Category",
            previous: "Previous",
            next: "Next",
      },
    },
    footer: {
    businessTitle: "Our Business",
    businessDesc: "High quality craftsmanship and service.",
    quickLinks: "Quick Links",
    links: {
      services: "Services",
      portfolio: "Portfolio",
      about: "About Me",
      testimonials: "Testimonials",
      blog: "Blog",
      contact: "Contact"
    },
    businessHours: "Business Hours",
    workshopLocation: "Workshop Location",
    paymentMethods: "Payment Methods (soon):",
    copyRight: "© 2025 John Carpenter Woodworks. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    sitemap: "Sitemap"
  },
   catalog: {
      title: "Catalog",
      searchBy: "Search by",
      writeHere: "Write here",
      noProducts: "No products found.",
      selectCategory: "Select Category",
      filters: {
        name: "By name",
        category: "By category",
        color: "By color",
        price: "By price",
        feature: "By feature"
      },
      specialDiscount: "Special Discount 🎉",
      productDetails: {
        images: "Images",
        colorsAndShapes: "Colors & Shapes",
        features: "Features"
    }
    },
     inspection: {
      title: "Request an Inspection",
      subtitle: "Fill out the form below to request an inspection or consultation. I’ll get back to you within 24 hours.",
      fullName: "Full Name",
      location: "Location",
      phone: "Phone Number",
      serviceType: "Service Type",
      projectDescription: "Project Description",
      preferredDate: "Preferred Date",
      agreement: "I agree to the terms and conditions privacy policy.",
      submit: "Submit Request"
    },
    banner: {
      title: "Transforming Spaces with Elegance",
      subtitle: "Where craftsmanship meets design to create timeless beauty in every detail.",
      button: "Explore Design Services",
      snackbar: "Design services will be available soon!"
    }
  },
  ar: {
    services: {
      title: "الخدمات",
      loading: "جاري تحميل الخدمات...",
      noData:"لا توجد خدمات لعرضها",
      details: {
        descriptionTitle: "وصف الخدمة",
        installationTitle: "تفاصيل التركيب",
        standardInstallation: "التركيب ",
        standardInstallationNote: "يشمل الإعداد والتكوين الأساسي",
        additionalSpecs: "مواصفات إضافية",
        highlightsTitle: "مميزات الخدمة",
        time: " مدة التنفيذ: في اسرع وقت مع مراعاة الدقة ",
        schedule: "إمكانية الحجز طوال أيام الأسبوع",
        tools: "نوفر جميع الأدوات والخامات",
        limitedTitle: "عرض لفترة محدودة",
        claim: "احجز العرض",
        included: "مشمول",
        benefit1: "تركيب احترافي بواسطة فنيين معتمدين",
        benefit2: "خامات ومكونات عالية الجودة",
        benefit3: "ضمان سنتين على جميع التركيبات",

      }
    },
    hero:{
        catalog:"كتالوج",
    },
    header:{
        navbar: {
            services: "الخدمات",
            portfolio: "أعمالنا",
            request: "طلب معاية",
            contact: "تواصل"
        },
      request:"طلب معاينة",

    },
    portfolio:{
      title: "أعمالنا",
      all: "الكل",
      loading: "جاري تحميل المشاريع...",
      noProjects: "لا توجد مشاريع حالياً.",
      loadMore: "تحميل المزيد",
      project: {
        materials: "المواد المستخدمة",
        duration: "مدة المشروع",
        testimonial: "رأي العميل",
        location: "الموقع",
        category: "الفئة",
        previous: "السابق",
        next: "التالي",
     },
    },
    footer: {
    businessTitle: "أعمالنا",
    businessDesc: "حرفية عالية وجودة في الخدمة.",
    quickLinks: "روابط سريعة",
    links: {
      services: "الخدمات",
      portfolio: "الأعمال",
      about: "من نحن",
      testimonials: "آراء العملاء",
      blog: "المدونة",
      contact: "تواصل معنا"
    },
    businessHours: "ساعات العمل",
    workshopLocation: "موقع الورشة",
    paymentMethods: "طرق الدفع (قريبًا):",
    copyRight: "© 2025 ورشة جون كاربنتر. جميع الحقوق محفوظة.",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    sitemap: "خريطة الموقع"
  },
   catalog: {
      title: "الكتالوج",
      searchBy: "البحث",
      writeHere: "اكتب هنا",
      selectCategory: "اختر التصنيف",
      noProducts: "لا توجد منتجات لعرضها.",
      filters: {
        name: "حسب الاسم",
        category: "حسب التصنيف",
        color: "حسب اللون",
        price: "حسب السعر",
        Feature: "حسب الميزة"
      },
      specialDiscount: "خصم خاص 🎉",
      productDetails: {
        images: "الصور",
        colorsAndShapes: "الألوان والأشكال",
        features: "المميزات"
    }
    },
     inspection: {
      title: "طلب معاينة",
      subtitle: "املأ النموذج أدناه لطلب معاينة أو استشارة. هنرد عليك خلال 24 ساعة.",
      fullName: "الاسم الكامل",
      location: "الموقع",
      phone: "رقم الهاتف",
      serviceType: "نوع الخدمة",
      projectDescription: "وصف المشروع",
      preferredDate: "التاريخ المفضل",
      agreement: "أوافق على الشروط وسياسة الخصوصية.",
      submit: "إرسال الطلب"
    },
    banner: {
      title: "نحو مساحات أنيقة ومتميزة",
      subtitle: "حيث يلتقي الإبداع مع الحرفية لصنع جمال خالد في كل تفصيلة.",
      button: "استعرض خدمات التصميم",
      snackbar: "خدمات التصميم ستتوفر قريبًا!"
    }

  }
};



// إنشاء i18n instance
const i18n = new VueI18n({
  locale: "en", // اللغة الافتراضية
  fallbackLocale: "en", // لو مافيش ترجمة
  messages,
});

export default i18n;
