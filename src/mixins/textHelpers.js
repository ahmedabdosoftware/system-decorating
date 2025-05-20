// src/mixins/textHelpers.js
export default {
  methods: {
    generateKeywords(input) {
      const generate = (text) => {
        const keywords = [];
        text = text.toLowerCase();
        for (let i = 1; i <= text.length; i++) {
          keywords.push(text.slice(0, i));
        }
        return keywords;
      };

      const result = [];

      if (Array.isArray(input)) {
        input.forEach(item => {
          const keywords = generate(item);
          result.push(...keywords); 
        });
        return result;
      } else if (typeof input === 'string') {
        return generate(input);
      } else {
        return [];
      }
    }
  }
}
