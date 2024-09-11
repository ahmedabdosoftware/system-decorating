import { defineStore } from 'pinia';
import { db  } from '@/firebase/firebaseConfig.js'; 

export const useBranchesStore = defineStore('useBranchesStore', {
  state: () => ({
    branches: [],
  }),
  actions: {
    async fetchBranches() {
      const querySnapshot = await db.collection('branches').get();
      this.branches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(this.branches);
      console.log(this.branches[0]);
    },

    async addBranch(branch) {
      await db.collection('branches').add(branch);
      this.fetchBranches();
    },
    
    async updateBranch(branch) {
      await db.collection('branches').doc(branch.id).update(branch);
      this.fetchBranches();
    },
    
    async deleteBranch(branchId) {
      await db.collection('branches').doc(branchId).delete();
      this.fetchBranches();
    },
    },
   
});
