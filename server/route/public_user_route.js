const { 
    createUser, 
    createQuotation,
    display,
    displayWithQuery,     
} = require('../controller/public_user_controller');

const { 
    emailController, 
    sendVerificationEmail 
} = require('../service/email_service');
const router = require('express').Router();


router.post('/create-user', createUser);
router.post('/create-quote', createQuotation);
router.get('/test-api', display);
router.get('/:name', displayWithQuery)
router.post('/send-email', emailController);
router.post('/send-verify-email', sendVerificationEmail)


module.exports = router;