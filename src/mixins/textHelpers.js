// src/mixins/textHelpers.js
export default {
  methods: {
    generateKeywords(text) {
      const keywords = [];
      text = text.toLowerCase(); // Optional: توحيد الكيس
      for (let i = 1; i <= text.length; i++) {
        keywords.push(text.slice(0, i));
      }
      return keywords;
    }
  }
}
