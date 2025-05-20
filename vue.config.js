// Before Custom Domain With GitHub Pages
// module.exports = {
//   publicPath:
//     process.env.NODE_ENV === "production" ? "/system-decorating/" : "/",
// };

// After Custom Domain With GitHub Pages
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://ahmedabdosoftware.github.io/system-decorating/'
    : '/'
}

