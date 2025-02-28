import { defineStore } from "pinia";
import { db } from "@/firebase/firebaseConfig.js";
import { useGetUserStore } from '@/store/users/users.js';

export const useRandomTransactionsStore = defineStore("randomTransactions", {
  state: () => ({
  // بيانات add
  addTransactions: [],
  addLastVisible: null,
  addFirstVisible: null,
  addHasNextPage: false,
  addHasPreviousPage: false,

  // بيانات pull
  pullTransactions: [],
  pullLastVisible: null,
  pullFirstVisible: null,
  pullHasNextPage: false,
  pullHasPreviousPage: false,

  // الرصيد الحالي
  balance: 0, 

  // allAddTransactions
  allAddTransactions: [], 


  // التحكم في عرض أو إخفاء العناصر المخفية 
  hidden: false, 

// مصفوفة لتخزين بيانات كل ProfileId
  transactionsData: [], 



  }),

  actions: {
    
    // toggle Hidden
    toggleHidden() {
        this.hidden = !this.hidden;
      },


  //fetch Add Transactions
  async fetchAddTransactions(pageSize = 5, direction = null,profileId) {
    console.log("enter add function")

    let queryRef = db.collection("AddRandomTransaction")
    .where("userId", "==", profileId)
    // .orderBy("date", "desc");


    if (!direction) {
      queryRef = queryRef.limit(pageSize);
    } else if (direction === "next" && this.addLastVisible) {
      queryRef = queryRef.startAfter(this.addLastVisible).limit(pageSize);
    } else if (direction === "previous" && this.addFirstVisible) {
      queryRef = queryRef.endBefore(this.addFirstVisible).limitToLast(pageSize);
    }

    const querySnapshot = await queryRef.get();

    if (!querySnapshot.empty) {
      this.addTransactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.addFirstVisible = querySnapshot.docs[0];
      this.addLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      const prevQueryRef = db.collection("AddRandomTransaction")
        .orderBy("date", "desc")
        .endBefore(this.addFirstVisible)
        .limit(1);

      const prevSnapshot = await prevQueryRef.get();
      this.addHasPreviousPage = !prevSnapshot.empty;

      this.addHasNextPage = querySnapshot.docs.length === pageSize;
    } else {
      if (direction === "next") this.addHasNextPage = false;
      if (direction === "previous") this.addHasPreviousPage = false;
    }
  },

  //fetch Pull Transactions
  async fetchPullTransactions(pageSize = 5, direction = null,profileId) {
    console.log("enter pull function")
    let queryRef = db.collection("PullRandomTransaction")
    .where("userId", "==", profileId)
    // .orderBy("date", "desc");


    if (!direction) {
      queryRef = queryRef.limit(pageSize);
    } else if (direction === "next" && this.pullLastVisible) {
      queryRef = queryRef.startAfter(this.pullLastVisible).limit(pageSize);
    } else if (direction === "previous" && this.pullFirstVisible) {
      queryRef = queryRef.endBefore(this.pullFirstVisible).limitToLast(pageSize);
    }

    const querySnapshot = await queryRef.get();

    if (!querySnapshot.empty) {
      this.pullTransactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.pullFirstVisible = querySnapshot.docs[0];
      this.pullLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      const prevQueryRef = db.collection("PullRandomTransaction")
        .orderBy("date", "desc")
        .endBefore(this.pullFirstVisible)
        .limit(1);

      const prevSnapshot = await prevQueryRef.get();
      this.pullHasPreviousPage = !prevSnapshot.empty;

      this.pullHasNextPage = querySnapshot.docs.length === pageSize;
    } else {
      if (direction === "next") this.pullHasNextPage = false;
      if (direction === "previous") this.pullHasPreviousPage = false;
    }
  },
// add Random Transaction
  async addRandomTransaction(transaction,profileId) {
    // التحقق من نوع المعاملة لتحديد المجموعة
    let collectionName = "";
    if (transaction.type === "Add") {
      collectionName = "AddRandomTransaction";
    } else if (transaction.type === "Pull") {
      collectionName = "PullRandomTransaction";
    } else {
      throw new Error("نوع المعاملة غير صالح"); // رسالة خطأ إذا كان النوع غير معروف
    }
  
    // إضافة المعاملة إلى المجموعة المناسبة
    const docRef = await db.collection(collectionName).add(transaction);
    transaction.id = docRef.id;
    this.fetchTransactionsByProfile(profileId)

  
    // تحديث الحالة حسب النوع
    if (transaction.type === "Add") {
      this.addTransactions.push(transaction);
    } else if (transaction.type === "Pull") {
      this.pullTransactions.push(transaction);
    }
  },




 // fetch Transactions By Profile
  async fetchTransactionsByProfile(profileId) {
    try {
      // جلب معاملات Add
      const addQuerySnapshot = await db
        .collection("AddRandomTransaction")
        .where("userId", "==", profileId)
        .get();

        const addTransactions = addQuerySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            amount: Number(doc.data().amount || 0),
          }));
          
      // جلب معاملات Pull
      const pullQuerySnapshot = await db
        .collection("PullRandomTransaction")
        .where("userId", "==", profileId)
        .get();

        const pullTransactions = pullQuerySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            amount: Number(doc.data().amount || 0),
          }));

      // حساب الرصيد
      const totalAdd = addTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalPull = pullTransactions.reduce((sum, t) => sum + t.amount, 0);
      const balance = totalAdd - totalPull;

      this.balance = balance;

      console.log(`Balance for profile ${profileId}:`, balance);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  },

  async fetchTransactionsForClients() {
    try {
      const userStore = useGetUserStore(); // استدعاء استور المستخدمين
      const clientUsers = userStore.clientUsers.map(user => user.id); // استخراج الـ IDs
      console.log("clientUsers",userStore.clientUsers)
      if (clientUsers.length > 0) {
        await this.fetchTransactionsByProfiles(clientUsers);
      }
    } catch (error) {
      console.error("Error fetching transactions for clients:", error);
    }
  },

  async fetchTransactionsByProfiles(profileIds) {
    try {
      
      // insted of For loop To Get every profile and Do  Request then Request and Repeat This Operation, Now It Faster
      const transactionsArray = await Promise.all(profileIds.map(async (profileId) => {
        // تشغيل الـ 2 requests في نفس الوقت (بدل ما يكونوا متتالين)
        const [addQuerySnapshot, pullQuerySnapshot] = await Promise.all([
          db.collection("AddRandomTransaction")
            .where("userId", "==", profileId)
            // .where("hidden", "==", true) // 
            .get(),
          db.collection("PullRandomTransaction")
            .where("userId", "==", profileId)
            // .where("hidden", "==", true) // 
            .get()
        ]);
  
        // تحويل البيانات من الـ snapshots
        const addTransactions = addQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          amount: Number(doc.data().amount || 0),
        }));
  
        const pullTransactions = pullQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          amount: Number(doc.data().amount || 0),
        }));
  
        // حساب الرصيد لكل بروفايل
        const totalAdd = addTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalPull = pullTransactions.reduce((sum, t) => sum + t.amount, 0);
        const balance = totalAdd - totalPull;
  
        // إنشاء كائن يحتوي على بيانات المستخدم
        return { profileId, addTransactions, pullTransactions, balance };
      }));
  
      // تحديث حالة Pinia بالمصفوفة الجديدة دفعة واحدة
      this.transactionsData = transactionsArray;
  
      console.log("Fetched Transactions Data:", this.transactionsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  },
  
    // Fetch All AddRandomTransaction
    async fetchAllAddTransactions() {
        try {
          const querySnapshot = await db
            .collection("AddRandomTransaction")
            .orderBy("date", "desc")
            .get();
  
          if (!querySnapshot.empty) {
            this.allAddTransactions = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
          } else {
            console.log("لا توجد معاملات في AddRandomTransaction");
          }
        } catch (error) {
          console.error("خطأ أثناء جلب المعاملات:", error);
        }
      },

       // حذف معاملة
    async deleteTransaction( id , typeTransaction , profileId) {
        console.log(typeTransaction, id)

        try {
            if( typeTransaction =="Add" ){
                await db.collection("AddRandomTransaction").doc(id).delete();
                this.addTransactions = this.addTransactions.filter(transaction => transaction.id !== id);
                this.fetchTransactionsByProfile(profileId)
            }else{
                await db.collection("PullRandomTransaction").doc(id).delete();
                this.pullTransactions = this.pullTransactions.filter(transaction => transaction.id !== id);
                this.fetchTransactionsByProfile(profileId)
            }
          console.log(`تم حذف المعاملة ${id}`);
        } catch (error) {
          console.error("خطأ أثناء حذف المعاملة:", error);
        }
      },
  
      // تحديث معاملة وإضافة خاصية hidden
      async hideTransaction(id,typeTransaction,tran,profileId) {
        try {
            console.log(typeTransaction, id)
            if( typeTransaction =="Add" ){
                await db.collection("AddRandomTransaction").doc(id).update({
                    hidden: !tran.hidden,
                }); 
                console.log("hidden",tran.hidden)  
                // if(tran.hidden === false){
                //   this.addTransactions = this.addTransactions.filter(transaction => transaction.id !== id);
                // }
                this.fetchAddTransactions(5,null,profileId)

            }else{
                await db.collection("PullRandomTransaction").doc(id).update({
                  hidden: !tran.hidden,
                });  
                console.log("hidden",tran.hidden)  

                // if(tran.hidden==false){
                //   this.pullTransactions = this.pullTransactions.filter(transaction => transaction.id !== id);
                // } 
                this.fetchPullTransactions(5,null,profileId)


            }
          console.log(`تم إخفاء او الغاء اخفاء المعاملة ${id}`);
        } catch (error) {
          console.error("خطأ أثناء تحديث المعاملة:", error);
        }
      },
  
  },
});
