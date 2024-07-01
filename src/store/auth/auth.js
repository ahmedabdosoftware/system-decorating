import { defineStore } from 'pinia';
import firebase, { auth, db } from '@/firebase/firebaseConfig.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    role: null,
  }),
  actions: {
    async registerUser({ email, password, name, role }) {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      this.user = userCredential.user;

      // إنشاء المستخدم في Firestore
      await db.collection('users').doc(this.user.uid).set({
        name,
        email,
        role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // استدعاء فانكشن الصلاحيات
      await firebase.functions().httpsCallable('setCustomClaims')({
        uid: this.user.uid,
        role
      });

      await this.fetchUserRole();
    },
    async login(email, password) {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      this.user = userCredential.user;
      await this.fetchUserRole();
    },
    async logout() {
      await auth.signOut();
      this.user = null;
      this.role = null;
    },
    async fetchUserRole() {
      if (this.user) {
        const idTokenResult = await this.user.getIdTokenResult();
        this.role = idTokenResult.claims.role;
      }
    },
    async handleAuthStateChanged() {
      auth.onAuthStateChanged(async user => {
        if (user) {
          this.user = user;
          await this.fetchUserRole();
        } else {
          this.user = null;
          this.role = null;
        }
      });
    },
    async uploadImage({ uid, file }) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`users/${uid}/profile.jpg`);
      await fileRef.put(file);
      const fileURL = await fileRef.getDownloadURL();

      // تحديث رابط الصورة في Firestore
      await db.collection('users').doc(uid).update({
        profileImageURL: fileURL,
      });
    },
  },
  getters: {
    isAdmin() {
      return this.role === 'admin';
    },
    isTechnical() {
      return this.role === 'technical';
    },
    isClient() {
      return this.role === 'client';
    }
  }
});
