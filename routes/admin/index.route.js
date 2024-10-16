const dashboardRoutes = require("./dashboard.route.js")
const productRoutes = require("./product.route.js")
const productCategoryRoutes = require("./product-category.route.js")
const roleRoutes = require("./role.route.js")
const accountRoutes = require("./account.route.js")
const authRoutes = require("./auth.route.js")
const systemConfig = require("../../config/system.js")

module.exports = (app)=>{ 
    const PATH_ADMIN = systemConfig.prefixAdmin//Tách riêng cái "/admin" qua file system.js
    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes)
    app.use(PATH_ADMIN + '/products',productRoutes )
    app.use(PATH_ADMIN + '/products-category',productCategoryRoutes)
    app.use(PATH_ADMIN + '/roles',roleRoutes)
    app.use(PATH_ADMIN + '/accounts',accountRoutes)
    app.use(PATH_ADMIN + '/auth',authRoutes)
}