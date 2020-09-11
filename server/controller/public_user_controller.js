const { 
    updateEmployee,
    createUserService, 
    createQuotationService,
} = require('../service/public_user_service');
const { 
    genSaltSync,
    hashSync,
    compareSync 
} = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { json } = require('body-parser');
const { uploader } = require('../route/public_user_route');

module.exports = {

    //Test api method
    //Remove it when not need
    display: (req, res) => {
        return res.status(200).json({
            success: 1,
            data: {
                name: "raj",
                working : "If displayed working"
            }
        })
    },

    displayWithQuery: (req, res) => {
        const name = req.params.name;
        console.log('===> ',name);
        return res.status(200).json({
            success: 1,
            data: {
                name: name               
            }
        })
    },
    //End test api method


    createUser: (req, res) => {
        const body = req.body;

        /* For testing success scenario */

        return res.status(200).json({
            success: 1,
            data: {
                insertId: 1,
                reqBody: body
                
            }
        })


       /*  For testing failure scenario */

        // return res.status(500).json({
        //     success: 0,
        //     message: 'Can not able to create new user'
        // });

        // createUserService(body, (err, results) => {
        //     if (err) {
        //         console.log(err);
        //         return res.status(500).json({
        //             success: 0,
        //             message: 'Database connection error'
        //         });
        //     }
        //     return res.status(200).json({
        //         success: 1,
        //         data: results
        //     })
        // })
    },

    createQuotation: (req, res) => {
        const body = req.body;

        /* for testing success scenario */

        return res.status(200).json({
            success: 1,
            data: {
                insertId: 1000
            }
        })


        /* for testing failure scenario */

        // return res.status(500).json({
        //     success: 0,
        //     message: 'Can not able to create quotation'
        //  });


        // createQuotationService(body, (err, results) => {
        //     if (err) {
        //         console.log(err);
        //         return res.status(500).json({
        //             success: 0,
        //             message: 'Database connection error'
        //         });
        //     }
        //     return res.status(200).json({
        //         success: 1,
        //         data: results
        //     })
        // })
    },  
    

}