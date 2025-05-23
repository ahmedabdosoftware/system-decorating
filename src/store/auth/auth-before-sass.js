import { defineStore } from "pinia";
import { db, auth, storage } from "@/firebase/firebaseConfig.js";
import { encrypt, decrypt } from "@/helpers/encryption.js";

// we will stop "this" right now becase it need cloud function that need paid plan "money"
// we will use just "that" firestore and securty rules to handel permation until we go to paid plan in firebase

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    role: null,
  }),
  actions: {
    //That 1    *1* insted way for create and givie him permissions by firestore "you will see it in mark '2' "
    async registerUser({
      email,
      password,
      name,
      number,
      role,
      profileImageURL,
    }) {
      // store info for curent user

      //get email
      const adminUser = auth.currentUser;
      const adminEmail = adminUser.email;

      // get pass
      const adminDoc = await db.collection("users").doc(adminUser.uid).get();
      const adminPasswordEncrypted = adminDoc.data().password;
      const adminPassword = decrypt(adminPasswordEncrypted);

      // for test => console.log("first : store admin data", auth.currentUser)

      // make new account for user
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // for test => console.log("second : the user data created", userCredential)

      // add user in Firestore for extra enformation
      await db.collection("users").doc(userCredential.user.uid).set({
        name,
        email,
        role,
        number,
        profileImageURL,
      });

      // for test =>  console.log("third : add to collection to id", userCredential.user.uid)

      // its made auto login so signOut
      await auth.signOut();

      // for test => console.log("four : sing out")

      // sign in as admin again

      if (adminUser) {
        // for test => console.log("five :before  sing in",adminUser.email, adminPassword)

        await this.login(adminEmail, adminPassword);

        // for test => console.log("six : the control came baack to admin")
      }

      return userCredential;

      // this  *1* insted way for creat user and givie him permissions by custom claims "you will see it in mark '2' "
      //const createUserWithClaims = functions.httpsCallable('createUserWithClaims');
      //await createUserWithClaims({ email, password, name, role });
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
      if (userDoc.exists && userDoc.data().role === "admin") {
        console.log("yes, he is admin");
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
      return this.role === "admin";
    },
    isTechnical() {
      return this.role === "technical";
    },
    isClint() {
      return this.role === "clint";
    },
  },
});
