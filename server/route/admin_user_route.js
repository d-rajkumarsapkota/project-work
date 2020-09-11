const {    
    login,
    signUp,
    loggedOut,
    verifyUser,
    addNewEmployee,
    getAllEmployees,
    getByEmployeeNumber,
    updateEmployeePassword,
    updateEmployeeWithEmpNumber,
    deleteEmployeeWithEmpNumber 
} = require('../controller/admin_user_controller');
const { checkToken } = require('../config/token_validation');
const router = require('express').Router();

// filesystem node js inbuilt module to delete stored image
const fs = require('fs');

// To make node js app accept multipart/form-data from angular app
// By default this application accept application/json
const multer = require('multer');

// Multer storage configuration
const _storage = multer.diskStorage({
    destination: function(req, file, callBack) {
        if(req.body.empOldAvatar != 'null') {            
            fs.unlinkSync(req.body.empOldAvatar.slice(req.body.empOldAvatar.search("profile_image")));
        }
        callBack(null, './profile_image/')
    },
    filename: function(req, file, callBack) {
        callBack(null, file.originalname)
    }
});

// This act as a middleware to get binary file from the angular app
const uploader = multer({storage: _storage}).single('empAvatar');



router.post('/login', login); 
router.post('/sign-up', signUp);
// req.file is the name of your file in the form above, here 'empAvatar'
// req.body will hold the text fields, if there were any
router.post('/add', uploader, addNewEmployee);
router.get('/all', getAllEmployees);
router.get('/:id', getByEmployeeNumber);
router.post('/verify-user-email', verifyUser);
router.delete('/:id', deleteEmployeeWithEmpNumber);
router.post('/update-secret', updateEmployeePassword);
router.post('/logout', loggedOut);
router.post('/:id', uploader, updateEmployeeWithEmpNumber); //Keep this method last



module.exports = router;