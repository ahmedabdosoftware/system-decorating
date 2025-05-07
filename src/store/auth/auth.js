import { defineStore } from "pinia";
import { db, auth, storage } from "@/firebase/firebaseConfig.js";
import { encrypt, decrypt } from "@/helpers/encryption.js";

// we will stop "this" right now becase it need cloud function that need paid plan "money"
// we will use just "that" firestore and securty rules to handel permation until we go to paid plan in firebase

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    role: null,
    MoreUserInfo:null,
  }),
  actions: {

    async  registerUser(userData) {
        try {
          const {
            company_name,
            email,
            name,
            number,
            password,
            role, 
            subscription_type,
            subscription_start,
            subscription_end,
            subscription_days,
            template_id,
            notes,
            profileImageURL,
          } = userData;
      console.log(userData)
          // ✅ حفظ بيانات الإدمن الحالي قبل ما تتغير
          const adminUser = auth.currentUser;
          const adminEmail = adminUser.email;
      
          const adminDoc = await db.collection("users").doc(adminUser.uid).get();
          const adminPasswordEncrypted = adminDoc.data().password;
          const adminPassword = decrypt(adminPasswordEncrypted);
      
          // ✅ تسجيل مستخدم جديد
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          const uid = userCredential.user.uid;
      
          // ✅ بيانات أساسية
          const baseUser = {
            id: uid,
            name,
            email,
            password,
            role,
            number: number || null,
            profileImageURL: profileImageURL || null,
            created_at: new Date().toISOString(),
          };
      
          // ✅ بيانات إضافية لو كان مستاجر و ايضا اضافة مستاجر
          if (role === "admin") {
            baseUser.subscription_type = subscription_type || null;
            baseUser.subscription_start = subscription_start || null;
            baseUser.subscription_end = subscription_end || null;
            baseUser.subscription_days = subscription_days || null;
            baseUser.template_id = template_id || null;
            baseUser.company_name = company_name || null;
            baseUser.notes = notes || ""

            await db.collection("Tenants").doc(uid).set({
              uid,
              name,
              email,
              number,
              role,
              profileImageURL: profileImageURL|| null,
              subscription_type: subscription_type || null, 
              subscription_start : subscription_start || null,
              subscription_end : subscription_end || null,
              subscription_days : subscription_days || null,
              company_name: company_name || null,
              template_id: template_id || null,
              notes:notes || null,
              createdAt: new Date(),
            });
          }
      
          // ✅ حفظ بيانات المستخدم الجديد في Firestore
          await db.collection("users").doc(uid).set(baseUser);
      
          // ✅ تسجيل الخروج التلقائي من المستخدم الجديد
          await auth.signOut();
      
          // ✅ الرجوع للإدمن الأصلي
          if (adminUser) {
            await this.login(adminEmail, adminPassword);

          }   

          console.log("✅ User registered and admin session restored");
          return userCredential;
      
        } catch (error) {
          console.error("❌ Error registering user:", error.message);
          return { success: false, error: error.message };
        }
      },
    
    async login(email, password) {
      console.log("before signInWithEmailAndPassword", email, password);

      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      this.user = userCredential.user;
      console.log("after signInWithEmailAndPassword", email, password);

      // this  *2* insted way for roles
      //await this.fetchUserRole();

      // add pass  in firestore after encrypt
      console.log("before update docment with pass");
      const userDoc = await db.collection("users").doc(this.user.uid).get();
      
      // Add Full Data
      this.MoreUserInfo = userDoc.data()
      if (
        userDoc.exists &&
        ["admin", "superAdmin"].includes(userDoc.data().role)
      ){
        console.log("yes, he is :- ", userDoc.data().role);
        const passwordEncrypted = encrypt(password);
        await db
          .collection("users")
          .doc(this.user.uid)
          .update({ password: passwordEncrypted });
      }
      console.log("after update docment with pass");
      // that 2  *2* insted way for roles
      await this.fetchUserRoleFromFirestore();

      return this.user.uid;
    },
    async logout() {
      await auth.signOut();
      this.user = null;
      this.role = null;
      console.log(this.role);
      console.log(this.user);
    },

    // that 2  *2* insted way for roles
    async fetchUserRoleFromFirestore() {
      if (this.user) {
        const userDoc = await db.collection("users").doc(this.user.uid).get();
        if (userDoc.exists) {
          this.role = userDoc.data().role;
        } else {
          this.role = null;
        }
      }
      console.log(this.role);
    },

    // this  *2* insted way for roles
    //    async fetchUserRole() {
    //       if (this.user) {
    //          const idTokenResult = await this.user.getIdTokenResult();
    //           this.role = idTokenResult.claims.role;
    //        }
    //       },

    async handleAuthStateChanged() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.user = user;
          console.log("فيه حد مسجل يبوحميد", user);
          console.log("فيه حد مسجل يبوحميد", this.user);

          // this 2  *2* insted way for roles
          //   await this.fetchUserRole();

          // that 2  *2* insted way for roles
          await this.fetchUserRoleFromFirestore();
        } else {
          console.log("مفيش حد مسجل يبوحميد");
          this.user = null;
          this.role = null;
        }
      });
    },

    // this 2  *2* insted way for update user by admin SDK
    //   ...........

    // that 2  *2* insted way for update user
    async updateUser({
      uid,
      oldEmail,
      oldPassword,
      newEmail,
      newPassword,
      name,
      number,
      profileImageURL,
    }) {
      try {
        console.log("Run Fun");

        //get email
        const adminUser = auth.currentUser;
        const adminEmail = adminUser.email;

        //get pass
        const adminDoc = await db.collection("users").doc(adminUser.uid).get();
        const adminPasswordEncrypted = adminDoc.data().password;
        const adminPassword = decrypt(adminPasswordEncrypted);

        console.log("get admin data", adminEmail, adminPassword);

        await auth.signOut();
        await this.login(oldEmail, oldPassword);

        console.log("sign out and in user");

        const user = auth.currentUser;

        console.log("user data ", user);

        if (user) {
          if (newEmail && newEmail !== oldEmail) {
            console.log("before change email", user.updateEmail);
            await user.updateEmail(newEmail);
            console.log(
              "تم تعديل البريد الإلكتروني في Firebase Authentication"
            );
          }

          if (newPassword && newPassword !== oldPassword) {
            await user.updatePassword(newPassword);
            console.log("تم تعديل كلمة المرور في Firebase Authentication");
          }

          await db
            .collection("users")
            .doc(uid)
            .update({
              name,
              email: newEmail || oldEmail,
              number,
              profileImageURL,
            });
          console.log("تم تعديل بيانات المستخدم في Firestore");
        }
        console.log("updated done ");

        await auth.signOut();

        await auth.signInWithEmailAndPassword(adminEmail, adminPassword);
        console.log("تم إعادة تسجيل الدخول بحساب الأدمن");
      } catch (error) {
        console.error(
          "حدث خطأ أثناء تعديل بيانات المستخدم:",
          error.code,
          error.message
        );
      }
    },
    // this 2  *2* insted way for delete user by admin SDK
    //   ...........

    // that 2  *2* insted way for delete user
    async deleteUser({ uid, oldEmail, oldPassword }) {
      try {
        const adminUser = auth.currentUser;
        const adminEmail = adminUser.email;

        const adminDoc = await db.collection("users").doc(adminUser.uid).get();
        const adminPasswordEncrypted = adminDoc.data().password;
        const adminPassword = decrypt(adminPasswordEncrypted);

        console.log("قبل تسجيل الخروج من حساب الأدمن");
        await this.logout();
        console.log("تم تسجيل الخروج من الأدمن");

        // محاولة تسجيل الدخول بالحساب الذي سيتم حذفه
        let user = null;
        try {
          console.log(
            "محاولة تسجيل الدخول بالحساب الذي سيتم حذفه:",
            oldEmail,
            oldPassword
          );
          await this.login(oldEmail, oldPassword);
          console.log("تم تسجيل الدخول بالحساب الذي سيتم حذفه");

          user = auth.currentUser;
        } catch (loginError) {
          console.error(
            "فشلت محاولة تسجيل الدخول بالحساب القديم:",
            loginError.code,
            loginError.message
          );
        }

        // إذا تم تسجيل الدخول بنجاح والحصول على المستخدم
        if (user) {
          await user.delete();

          await this.login(adminEmail, adminPassword);

          await db.collection("users").doc(uid).delete();
          alert("User updated successfully!");
        } else {
          await this.login(adminEmail, adminPassword);
          alert("Error deleting user: ");
        }
      } catch (error) {
        console.error(
          "حدث خطأ أثناء حذف المستخدم أو تسجيل الدخول مرة أخرى:",
          error.code,
          error.message
        );
      }
    },
    async uploadImage({ uid, file }) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`users/${uid}/profile.jpg`);
      await fileRef.put(file);
      const fileURL = await fileRef.getDownloadURL();

      // update user info in Firestore
      console.log("before update", uid);
      await db.collection("users").doc(uid).update({
        profileImageURL: fileURL,
      });
      console.log("succsed update with pic");
    },
  },
  getters: {
    isAdmin() {
      return this.role === "admin" || this.role === "superAdmin";
    },
    isTechnical() {
      return this.role === "technical";
    },
    isClint() {
      return this.role === "clint";
    },
  },
});
