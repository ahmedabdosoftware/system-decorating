// src/store/transactions.js
import { defineStore } from 'pinia';
import { db } from '@/firebase/firebaseConfig.js';
import { useGetUserStore } from '@/store/users/users.js';

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    //old way
    transactions: [],
    userTransactions:[],


    // new way
    specificTransactions: [], 
    specificUserTransactions:[],

    // New array to store user transactions with remaining values
    userTransactionSummaries: [], 

    
  }),
  actions: {

    // OLD way
    async fetchTransactions() {
      const querySnapshot = await db.collection('transactions').get();
      this.transactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    
    // OLD way
    async fetchTransactionById(transactionId) {
      const doc = await db.collection('transactions').doc(transactionId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        console.error('No such document!');
        return null;
      }
    },

    // OLD way
    async fetchTransactionsByUserId(userId) {
      const querySnapshot = await db.collection('transactions')
        .where('userId', '==', userId)
        .get();
      this.userTransactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    
    // OLD way
    async addTransaction(transaction) {
      await db.collection('transactions').doc(transaction.id).set(transaction);
      await this.fetchTransactions();
      return transaction.id;
    },
    
    // OLD way
    async updateTransaction(transaction) {
      await db.collection('transactions').doc(transaction.id).update(transaction);
      await this.fetchTransactions();
    },
    
    // OLD way
    async deleteTransaction(transactionId,userId) {
      await db.collection('transactions').doc(transactionId).delete();
       this.fetchTransactions();
       this.fetchTransactionsByUserId(userId);
    },

    //NEW way
    async fetchSpecificTransactions() {
      const querySnapshot = await db.collection('SpecificTransactions').where('status', '==', 'open').get();
      this.specificTransactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    //NEW way
    async addSpecificTransaction(transaction) {
      const transactionRef = db.collection('SpecificTransactions').doc();
      await transactionRef.set(transaction);
      await this.fetchSpecificTransactions();
      return transactionRef.id; 
    },
    // NEW FUNCTION: Fetch specific transaction by ID
    async fetchSpecificTransactionById(transactionId) {
      const doc = await db.collection('SpecificTransactions').doc(transactionId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        console.error('No such document!');
        return null;
      }
    },
    // NEW Way: Fetch By User Id
    async fetchSpecificTransactionByUserId(userId) {
      const querySnapshot = await db.collection('SpecificTransactions')
        .where('userId', '==', userId)
        .get();
      this.specificUserTransactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // NEW FUNCTION: Update specific transaction
    async updateSpecificTransaction(transaction) {
      await db.collection('SpecificTransactions').doc(transaction.id).update(transaction);
      await this.fetchSpecificTransactions();
    },
     // NEW way
     async deleteSpecificTransaction(transactionId,userId) {
      await db.collection('SpecificTransactions').doc(transactionId).delete();
       this.fetchTransactions();
       this.fetchSpecificTransactionByUserId(userId);
    },
    
    // NEW way
    async fetchUsersAndTransactions() {
      try {
        const userStore = useGetUserStore(); // استدعاء استور المستخدمين
        const users = userStore.clientUsers;
        console.log("clientUsers", users);
    
        // تشغيل جميع الطلبات بالتوازي باستخدام `Promise.all`
        // insted of For loop for every profile, Now It Faster
        const transactionsData = await Promise.all(users.map(async (user) => {
          const querySnapshot = await db.collection('SpecificTransactions')
            .where('userId', '==', user.id)
            .get();
    
          const userTransactions = querySnapshot.docs.map((doc) => {
            const transaction = { id: doc.id, ...doc.data() };
            let remainingBalance = 0;
            const bothType = transaction.typesData.find(t => t.type === 'both');
    
            if (bothType && bothType.totalAmount) {
              remainingBalance = bothType.remainingValue;
            } else {
              const materials = transaction.typesData.find(t => t.type === 'materials');
              const manufacturing = transaction.typesData.find(t => t.type === 'manufacturing');
    
              const materialsRemaining = materials ? Number(materials.remainingValue) || 0 : 0;
              const manufacturingRemaining = manufacturing ? Number(manufacturing.remainingValue) || 0 : 0;
    
              remainingBalance = materialsRemaining + manufacturingRemaining;
            }
    
            return { ...transaction, remainingBalance };
          });
    
          return { userId: user.id, userName: user.name, transactions: userTransactions };
        }));
    
        // تحديث حالة Pinia بالمصفوفة الجديدة دفعة واحدة
        this.userTransactionSummaries = transactionsData;
    
        console.log("userTransactionSummaries", this.userTransactionSummaries);
      } catch (error) {
        console.error("Error fetching users and transactions:", error);
      }
    },

  },
  getters: {
    totalRemainingBalance() {
      return this.userTransactionSummaries.reduce((total, user) => {
        const userTotal = user.transactions.reduce((sum, transaction) => sum + Number(transaction.remainingBalance) , 0);
        return total + userTotal;
      }, 0);
    }
  }
});

