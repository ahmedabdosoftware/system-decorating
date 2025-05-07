import { defineStore } from "pinia";
import { db, storage } from "@/firebase/firebaseConfig.js";

export const useTemplateStore = defineStore("templateStore", {
  state: () => ({
    templates: [],
    loading: false,
  }),
  actions: {
    
    async fetchTemplates() {
      this.loading = true;
      const querySnapshot = await db.collection("templates").get();
      this.templates = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.loading = false;
    },

    async addTemplate(template, file) {
      let imageUrl = "";
      if (file) {
        const fileRef = storage
          .ref()
          .child(`templates/${Date.now()}_${file.name}`);
        await fileRef.put(file);
        imageUrl = await fileRef.getDownloadURL();
      }

      const docRef = await db.collection("templates").add({
        ...template,
        image: imageUrl,
      });

      this.templates.push({
        id: docRef.id,
        ...template,
        image: imageUrl,
      });
    },

    async updateTemplate(id, updatedData, file) {
      let imageUrl = updatedData.image;
      if (file) {
        const fileRef = storage
          .ref()
          .child(`templates/${Date.now()}_${file.name}`);
        await fileRef.put(file);
        imageUrl = await fileRef.getDownloadURL();
      }

      await db.collection("templates").doc(id).update({
        ...updatedData,
        image: imageUrl,
      });

      const index = this.templates.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.templates[index] = {
          id,
          ...updatedData,
          image: imageUrl,
        };
      }
    },

    async deleteTemplate(id) {
      await db.collection("templates").doc(id).delete();
      this.templates = this.templates.filter((t) => t.id !== id);
    },
  },
});
