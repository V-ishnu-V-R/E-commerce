var express = require('express');
var session = require("express-session");
var router = express.Router();
const adminController = require("../controller/admin-controller");
const sessionCheck = require('../middlewares/session')
const multer=require("multer")
const bannerController=require("../controller/banner-controller")

////////////////////////////////////////////////////////////////////////////////////////////////
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/productUploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        ;
        cb(null,uniqueSuffix + '-' +file.originalname   )
    }
});
const upload = multer({ storage: storage });

///////////////////////////////////////////////////////////////////////////////////////////////////
const storages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/bannerImages');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        ;
        cb(null,uniqueSuffix + '-' +file.originalname   )
    }
});
const uploads = multer({ storage: storages });

//////////////////////////////////////////////////////////////////////////////////////////////////


router.get('/',adminController. getAdmin);
router.get('/logout',adminController.logout)
router.post('/',adminController.getAdminPage)

router.get('/dashboard',sessionCheck.adminSessionChecker,adminController.getAdminDashboard );



router.get('/products',sessionCheck.adminSessionChecker,adminController.getAdminProducts)
//router.post('/products',adminController.getAdminProducts)

router.get('/category',sessionCheck.adminSessionChecker,adminController.getAdminCategory)
router.post('/category',sessionCheck.adminSessionChecker,adminController.getAdminCategory)

router.get('/users',sessionCheck.adminSessionChecker,adminController.getAdminUsers)

router.get("/add-Category",sessionCheck.adminSessionChecker,adminController.getAddCategory)
router.post("/add-Category",sessionCheck.adminSessionChecker,adminController.createCategory)

router.get("/edit-Category/:id",sessionCheck.adminSessionChecker,adminController.getEditCategory)
router.post("/edit-Category/:id",sessionCheck.adminSessionChecker,adminController.getEditCategoryId )
router.get("/deleteCategory/:id",sessionCheck.adminSessionChecker,adminController.deleteCategoryId)

router.get("/blockUser/:id",sessionCheck.adminSessionChecker,adminController.blockUser)
router.get("/unblockUser/:id",sessionCheck.adminSessionChecker,adminController.unblockUser)

router.get("/add-products",sessionCheck.adminSessionChecker,adminController.getAddProducts)
router.post("/add-products",upload.array('photos',4) ,sessionCheck.adminSessionChecker,adminController.AddProducts)

router.get("/deleteProduct/:id",sessionCheck.adminSessionChecker,adminController.deleteProduct) 

router.get("/edit-products/:id",adminController.geteditProducts) 
router.post("/edit-products/:id",upload.array('photos', 4),adminController.editProducts)
router.get("/userManage",sessionCheck.adminSessionChecker,adminController.userManage)
router.get("/orderStatus/:id",sessionCheck.adminSessionChecker,adminController.orderStatus)
router.post("/editStatus/:id",sessionCheck.adminSessionChecker,adminController.editStatus)

router.get("/bannerTable",sessionCheck.adminSessionChecker,bannerController.getBanner)
router.get("/addBanner",sessionCheck.adminSessionChecker,bannerController.addBanner)
router.post("/addBanner",sessionCheck.adminSessionChecker,uploads.single('image'),bannerController.addBannerButton)
router.get("/editBanner/:id",sessionCheck.adminSessionChecker,bannerController.editBanner)
router.post("/editBanner/:id",sessionCheck.adminSessionChecker,uploads.single('image'),bannerController.editBannerButton)
router.get('/deleteBanner/:id',sessionCheck.adminSessionChecker,bannerController.deleteBanner)

router.get("/couponTable",sessionCheck.adminSessionChecker,adminController.getCoupon)
router.get("/addCoupon",sessionCheck.adminSessionChecker,adminController.getAddCoupon)
router.post("/addCoupon",sessionCheck.adminSessionChecker,adminController.addCoupon)
router.get("/editCoupon/:id",sessionCheck.adminSessionChecker,adminController.getEditCoupon)
router.post("/editCoupon/:id",sessionCheck.adminSessionChecker,adminController.editCoupon)
router.get("/deleteCoupon/:id",sessionCheck.adminSessionChecker,adminController.deleteCoupon)

router.use((req,res,next) => {
    //next(createError(404))
    res.render("admin/error",{layout:false})
})

router.use((err,req,res,next) => {
    console.log("admin error route handler");
    res.status(err.status || 500);
    res.render('admin/error',{layout:false})
})











module.exports = router;  
  