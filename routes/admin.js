var express = require('express');
var router = express.Router();
const adminController = require("../controller/admin-controller");
const multer=require("multer")

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

// /* GET home page. */ admiln home page is the login page and it will go to the dashboard once logged in


router.get('/',adminController. getAdmin);
router.get('/logout',adminController.logout)
router.post('/',adminController.getAdminPage)

router.get('/dashboard',adminController.getAdminDashboard );



router.get('/products',adminController.getAdminProducts)
//router.post('/products',adminController.getAdminProducts)

router.get('/category',adminController.getAdminCategory)
router.post('/category',adminController.getAdminCategory)

router.get('/users',adminController.getAdminUsers)

router.get("/add-Category",adminController.getAddCategory)
router.post("/add-Category",adminController.createCategory)

router.get("/edit-Category/:id",adminController.getEditCategory)
router.post("/edit-Category/:id",adminController.getEditCategoryId )
router.get("/deleteCategory/:id",adminController.deleteCategoryId)

router.get("/blockUser/:id",adminController.blockUser)
router.get("/unblockUser/:id",adminController.unblockUser)

router.get("/add-products",adminController.getAddProducts)
router.post("/add-products",upload.array('photos',4) ,adminController.AddProducts)
router.get("/datatable",adminController.datatable)
router.get("/deleteProduct/:id",adminController.deleteProduct)









module.exports = router;  
  