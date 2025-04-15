import Vue from "vue";

Vue.filter("sub", function (text) {
  return text.substring(0, 35) + "...";
});

Vue.filter("subName", function (text) {
  return text.substring(0, 25) + "...";
});

Vue.filter("formatDate", function (value) {
  if (!value) return "";
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
});
