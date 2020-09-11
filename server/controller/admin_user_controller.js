const {
    sessionEnd,
    sessionStart,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeeByEmail,
    getUserByEmailService,
    updateEmployeeAsActive,
    getUpdateUserWithToken,
    createNewEmployeeService,
    getEmployeeByEmailOrNumber,
    createEmployeeAdminService,
    getEmployeeByEmployeeNumber,
    getTradeInfoByTaxFileNumber,
    verifyUserWithEmailAndToken,
    getEmployeeDetailsAndTradeInfo,
    updateEmployeePasswordAndStatus,
    getEmployeeTradeInfoByEmployeeNumber,
    getMatchingEmployeeByEmailOrNumberNotSelf
} = require('../service/admin_user_service');
const {
    hashSync,
    compareSync
} = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { resolve } = require('path');

module.exports = {

    login: (req, res) => {        
        const body = req.body; 
        // console.info('>> ',req);       
        getUserByEmailService(body.email, (err, results, length) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: "Internal server error."
                });
            }
            
            if (length < 1) {
                return res.status(401).json({
                    success: 0,
                    message: "Invalid email or password"
                });
            } else {
                const result = compareSync(body.password, results.password); 
                if(!result) return res.status(401).json({
                    success: 0,
                    message: "Invalid email or password"
                });
            }
            // user Session history data added and session id is sent to front end
            // Session id needed when user signout to update session history table
            
            let historyID = '';
            new Promise((resolve, reject) => {
                sessionStart(results, (err, result) => {                
                    historyID = result.insertId;
                    resolve('');
                }) 
            })
            .then(() => {
                results.password = undefined;
                const jsontoken = sign({ result: results }, process.env.JWT_SECRET);
                if (!results.active) {
                    if(results.role == process.env.ADMIN) {
                        return res.status(200).json({
                            success: 0,
                            message: "Activate"                            
                        });
                    } else {
                        return res.status(200).json({
                            success: 0,
                            message: "Inactive",
                            token: jsontoken,
                            session: historyID
                        });
                    }               
                    
                } else {                
                    return res.status(200).json({                   
                        token: jsontoken,
                        session: historyID
                    });
                }
            })                       
        });
    },



    signUp: (req, res) => {
        const body = req.body;
        let Id = '';
        
        new Promise((resolve, reject) => {
            getUserByEmailService(body.email, (err, results, length) => {
                if(err) reject(err);
                if(length > 0) reject('catched')
                resolve('');
            })
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                body.password = hashSync(body.password, 10);
                createEmployeeAdminService(body, (err, results) => {
                    if (err) reject(err);
                    Id = results.insertId;
                    resolve('');               
                }); 
            })
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                getUpdateUserWithToken(Id, (err, token, result) => {
                    if(err) reject(err);
                    if(result.changedRows == 1) {
                        return res.status(200).json({token: token});
                    }
                });                
            })
        })        
        .catch(err => {            
            if (err !== 'catched') {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: 'Internal server error'
                });
            } else {
                return res.status(500).json({
                    success: 0,
                    message: 'Duplicate email'
                })
            }
        })        
    },



    /* 
        When admin try to create new employee, this method checks first for two things.
        One is the new employees email entred already exists in the employee table
        Two is the Tax file number entered for new employee matches with the existing exmployee

        If two of the above condition executes successfully then the insertion of new employee happens.
        Data are store in two tables- employee and employee trade info
    */
    addNewEmployee: (req, res) => {

        const body = req.body;
        let matchingValues = [];

        new Promise((resolve, reject) => {
            getEmployeeByEmailOrNumber(body, (err, results, length) => {
                // If getEmployeeByEmailOrNumber service method returns error, reject() is called then
                // catch() catches the error, which internal has method to send error response
                // to called api
                if (err) reject(err);
                if (length > 0) {
                    if (results[0].emp_number_count > 0) matchingValues.push('empIdNumber')
                    if (results[0].email_count > 0) matchingValues.push('empEmail');
                }
                // To call the next then() irrespective of empIdNumber or empEmail matches or not
                resolve('');
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                getTradeInfoByTaxFileNumber(body, (err, results, length) => {
                    if (err) reject(err); // Same as above err
                    if (length > 0) matchingValues.push('taxNumber');
                    resolve(''); // To call the next then() irrespective of taxNumber matches or not
                });
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                if (matchingValues.length > 0) {
                    
                    // when any of empEmail or taxNumber from the api data matched with the database value 
                    // (as these two fields should be unique) we reject here and catch() will catch error
                    // but wont send any error response to api.

                    // After reject() called, this method itself send response to api with data containing
                    // some error response which will be useful of front end to handle this error accordingly
                    reject('catched');
                    return res.status(409).json({
                        success: 0,
                        message: matchingValues.join(" ")                        
                    });

                } else {
                    // To call the next then() when none of empEmail or taxNumber matches with the database.
                    // Next then() is where we are storing the new employee details in two databases.
                    resolve('');
                }
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                body.empPassword = hashSync(body.empPassword, 10);
                createNewEmployeeService(req, (err, results) => {
                    if (err) reject(err);

                    return res.status(200).json({
                        success: 1,
                        message: 'Employee created'
                    })
                });

            })
        })
        .catch(err => {
            console.error('ERROR === ', err);
            if (err !== 'catched') {
                return res.status(500).json({
                    success: 0,
                    message: 'Internal server error'
                });
            }
        })
    },




    getAllEmployees: (req, res) => {
        getEmployees((err, results) => {
            if (err) {
                console.error(err);
                return;
            };
            if(results.length > 0){
                return res.status(200).send(results);
            } else {
                return res.status(200).send([]);
            }
            
        });
    },

    getByEmployeeNumber: (req, res) => {
        const id = req.params.id;
        getEmployeeDetailsAndTradeInfo(id, (err, results, length) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: 'Internal server error'
                });
            };

            if(length > 0) {
                if(results.profile_picture_name) {
                    results.profile_picture_name = generateFullImageURL(results.profile_picture_name);
                } 
                return res.status(200).send(results);
            } else {
                return res.status(400).send({message: 'No record'});
            }
            
            
        })

    },



    updateEmployeeWithEmpNumber: (req, res) => {
        const id = req.params.id;
        const body = req.body;
        let matchingValues = [];
        let tradeLength = 0;

        new Promise((resolve, reject) => {
            getMatchingEmployeeByEmailOrNumberNotSelf(body, (err, results, length) => {
                // If getMatchingEmployeeByEmailOrNumberNotSelf service method returns error, reject() is called then
                // catch() catches the error, which internal has method to send error response
                // to called api
                if (err) reject(err);
                if (length > 0) {
                    if (results[0].emp_number === body.empIdNumber) matchingValues.push('empIdNumber');
                    if (results[0].email === body.empEmail) matchingValues.push('empEmail');
                }
                // To call the next then() irrespective of empIdNumber or empEmail matches or not
                resolve('');
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                getTradeInfoByTaxFileNumber(body, (err, results, length) => {
                    if (err) reject(err); // Same as above err 
                    tradeLength = length;
                    if (length > 0 && results[0].id != body.uniqueForTrade) {                                               
                        matchingValues.push('taxNumber');
                    }
                    resolve(''); // To call the next then() irrespective of taxNumber matches or not
                });
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                if (matchingValues.length > 0) {
                    // when any of empEmail or taxNumber from the api data matched with the database value 
                    // (as these two fields should be unique) we reject here and catch() will catch error
                    // but wont send any error response to api.

                    // After reject() called, this method itself send response to api with data containing
                    // some error response which will be useful of front end to handle this error accordingly
                    reject('catched');
                    return res.status(200).json({                        
                        code: 'ER_DUP_ENTRY',
                        errorField: matchingValues                        
                    });

                } else {
                    // To call the next then() when none of empEmail or taxNumber matches with the database.
                    // Next then() is where we are storing the new employee details in two databases.
                    resolve('');
                }
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                updateEmployee(req, tradeLength, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        return res.status(200).json({
                            success: 1,
                            message: "Employee Updated"
                        });
                    }
                });
            })
        })
        .catch(err => {
            if (err !== 'catched') {
                return res.status(500).json({
                    success: 0,
                    message: 'Internal server error'
                });
            }
        })

    },


    verifyUser: (req, res) => {
        const body = req.body;
        new Promise((resolve, reject) =>  {
            return verifyUserWithEmailAndToken(body, (err, result, length) => {
                if(err) reject(err);
                
                // If length equal to '0' then email is not a valid email
                // If db query result token and body token doesn't match then body token is not valid
                // In both of above case sent error message as forbidden
                if(length == 0) {
                    reject('catched');
                } else {
                    if(result.active) {
                        reject('sent');
                        res.status(200).json({message: 'active'});
                    }
                    if(result.verify_token == body.token) {
                        resolve('')
                    } 
                }
            });
        })
        .then(() => {
            return updateEmployeeAsActive(body, (err, result) => {
                if(err) reject(err);
                if(result.affectedRows == 1) res.status(200).json({message: 'activated'});
            });
        })
        .catch(err => {
            if(err == 'sent') {
                return;
            } else if(err == 'catched') {
                return res.status(403).json({
                    success: 0,
                    message: 'Forbidden'
                });
            } else {
                return res.status(500).json({
                    success: 0,
                    message: 'Internal server error'
                });
            }            
        });
        
    },

    updateEmployeePassword: (req, res) => {
        const body = req.body;
        
        
        new Promise((resolve, reject) => {
            return getUserByEmailService(body.email, (err, result, length) => {

                if(err) reject(err);

                const isMatch = compareSync(body.oldPassword, result.password);
                if (isMatch) {
                    resolve('');
                } else {
                    reject('catched');                   
                }
            });
        })
        .then(() => {
            body.newPassword = hashSync(body.newPassword, 10);
            return updateEmployeePasswordAndStatus(body, (err, result) => {
                if(err) reject(err);

                return res.status(200).json({
                    success: 1,
                    message: "Employee Updated"
                });
            })
        })
        .catch(err => {
            if(err == 'catched') {
                return res.status(500).json({
                    success: 0,
                    message: 'No match'
                });
            } else {
                return res.status(500).json({
                    success: 0,
                    message: 'Internal server error'
                });
            }
        });  

        
    },

    deleteEmployeeWithEmpNumber: (req, res) => {
        const id = req.params.id;
        deleteEmployee(id, (err, result) => {
            if(err) return res.status(500).json({
                success: 0,
                message: 'Internal server error'
            });
            return res.status(200).json({
                success: 1,
                message: "Employee Deleted"
            });
        })
    },
    

    loggedOut: (req, res) => {
        const sessionId = req.body.session;
        sessionEnd(sessionId, (err, result) => {
            if(err) console.error(err);
            // return res.status(200).send('Session ended');
        });
    },
}

function generateFullImageURL(url) {
    return process.env.API_URL + url;
}