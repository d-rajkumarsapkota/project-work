const pool = require('../config/db_config');
const crypto = require('crypto');


module.exports = {    

    getUserByEmailService: (email, callBack) => {
        pool.query(
            // 'SELECT * FROM  user_gen_quote WHERE email=?;',
            'SELECT * FROM  employees WHERE email=?;',
            [email],
            (error, results) => {
                if(error) { 
                    console.error(error);
                    return callBack(error);                    
                }
                return callBack(null, results[0], results.length);
            }
        );
    },

    createEmployeeAdminService: (data, callBack) => {
        pool.query(
            'INSERT INTO employees (emp_number, email, password, create_time, role) VALUES (?, ?, ?, ?, ?);',
            [ data.email, data.email, data.password, new Date(), process.env.ADMIN ],
            (error, results) => {
                if(error) {
                    console.error(error);
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },

    getUpdateUserWithToken: (id, callBack) => {
        const token = genereateToken();
        pool.query(
            'UPDATE employees SET verify_token = ? WHERE emp_user_id = ?',
            [ token, id ],
            (error, results) => {
                if(error) {
                    console.error(error);
                    return callBack(error);
                }
                return callBack(null, token, results);
            }
        );
    },

    // getEmployeeByUniqueID: (data, callBack) => {
    //     pool.query(
    //         'SELECT emp_user_id, emp_number, first_name, last_name, gender, email, role, home_number, active,'+ 
    //         'mobile_number, street_address, suburb_postcode, state FROM employees WHERE emp_number = ?',
    //         [id],
    //         (error, results) => {
    //             if(error) {
    //                 return callBack(error);
    //             }
    //             return callBack(null, results[0], results.length);
    //         }
    //     )
    // },


    // ************* not used ***************** //
    getEmployeeByEmail: (data, callBack) => {
        pool.query(
            'SELECT emp_user_id, emp_number, SUM(IF(emp_number = ?, 1, 0)) as emp_number_count, email, '+
            'SUM(IF(email = ?, 1, 0)) as email_count FROM employees WHERE emp_number = ? OR email = ?;'
            ,
            [
                data.empIdNumber,
                data.empEmail,
                data.empIdNumber,
                data.empEmail
            ],
            (error, results) => {
                if(error) {
                    return callBack(error)
                }
                return callBack(null, results, results.length);
            }
        )
    },


    getEmployeeByEmailOrNumber: (data, callBack) => {
        pool.query(
            'SELECT emp_user_id, emp_number, SUM(IF(emp_number = ?, 1, 0)) as emp_number_count, email, '+
            'SUM(IF(email = ?, 1, 0)) as email_count FROM employees WHERE emp_number = ? OR email = ?;',
            [
                data.empIdNumber,
                data.empEmail,
                data.empIdNumber,
                data.empEmail
            ],
            (error, results) => {
                if(error) {
                    return callBack(error)
                }
                return callBack(null, results, results.length);
            }
        )
    },    

    getMatchingEmployeeByEmailOrNumberNotSelf: (data, callBack) => {
        
        pool.query(
            'SELECT emp_number, email FROM employees WHERE emp_user_id != ? AND (emp_number = ? OR email = ?);',
            [
                data.uniqueForEmp,
                data.empIdNumber,
                data.empEmail
            ],
            (error, results) => {
                if(error) {                    
                    return callBack(error)
                }
                return callBack(null, results, results.length);
            }
        )
    },

    getTradeInfoByTaxFileNumber: (data, callBack) => {
        pool.query(
            'SELECT * FROM employee_trade_info WHERE tax_file_no = ?;',
            [data.taxNumber],
            (error, results) => {
                if(error) {
                    return callBack(error)
                }
                return callBack(null, results, results.length);
            }
        )
    },

    // ************* not used *************
    getEmployeeByEmployeeNumber: (id, callBack) => {
        pool.query(
            'SELECT emp_number, first_name, last_name, gender, email, role, home_number, active,'+ 
            'mobile_number, street_address, suburb_postcode, state FROM employees WHERE emp_number = ?',
            [id],
            (error, results) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results[0], results.length);
            }
        )

    },

    // ************* not used *************
    getEmployeeTradeInfoByEmployeeNumber: (id, callBack) => {
        pool.query(
            'SELECT emp_user_id, emp_number, tax_file_no, hourly_rate, penelty_1, penelty_2 FROM employee_trade_info WHERE emp_number = ?',
            [id],
            (error, results) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results[0], results.length);
            }
        )
    },

    getEmployeeDetailsAndTradeInfo: (id, callBack) => {
        pool.query(
            'SELECT emp.emp_user_id, emp.emp_number, emp.first_name, emp.last_name, emp.email, emp.gender, emp.role, '+ 
            'emp.profile_picture_name, emp.active, emp.home_number, emp.mobile_number, emp.street_address, emp.street_address, '+ 
            'emp.suburb_postcode, emp.state, trade.id, trade.tax_file_no, trade.hourly_rate, trade.penelty_1, '+
            'trade.penelty_2 FROM employees as emp LEFT JOIN employee_trade_info AS trade '+
            'ON emp.emp_number = trade.emp_number WHERE emp.emp_number = ?;',
            [id],
            (error, results) => {                              
                if(error) {
                    console.error(error);
                    return callBack(error);
                }
                return callBack(null, results[0], results.length);
            }
        
        )
        
    },

    createNewEmployeeService: (req, callBack) => {

        const body = req.body;      

        // To check if this request contain employee profile picture
        let fileName = '';
        if(req.file) fileName = req.file.path;             

        pool.query(
            'INSERT INTO employees (emp_number, first_name, last_name, username, email, password, gender, create_time, modified_time,'
            +'role, profile_picture_name, home_number, mobile_number, street_address, suburb_postcode, state)'
            +'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );',
            [
                body.empIdNumber, body.empFirstName, body.empLastName, '', body.empEmail, body.empPassword, body.empGender, new Date(), new Date(),
                body.empCategory, fileName, body.empHomeNumber, body.empMobileNumber, body.empStreet, body.suburbPostcode, body.empState
            ],
            (error, results) => {
                if(error) {
                    return callBack(error);
                }
                
               addEmployeeTradeInfo(body, results, (err, res) => {
                    if(err) {
                        console.error(err);
                        return callBack(err);
                    }
                    return callBack(null, res);
                });                
            }
        );
    },


    getEmployees: callBack => {
        pool.query(
            'SELECT emp_number, first_name, last_name, email, role, active,'+ 
            'mobile_number, street_address, street_address, suburb_postcode, state from employees;',
            [],
            (error, results) => {
                if(error) { 
                    return callBack(error);                    
                }
                return callBack(null, results);
            }

        )
    },


    updateEmployee: (req, len, callBack)  => {
        const body = req.body;

        // To check if this request contain employee profile picture
        let fileName;
        if(req.file) fileName = req.file.path; 


        pool.query(
            'UPDATE employees SET emp_number = ?, first_name = ?, last_name = ?, email = ?, gender = ?, modified_time = ?, role = ?, '+
            'profile_picture_name = ?, home_number = ?, mobile_number = ?, street_address = ?, suburb_postcode = ?, state = ? '+
            'WHERE emp_user_id = ?',
            [
                body.empIdNumber, body.empFirstName, body.empLastName, body.empEmail, body.empGender, new Date(), body.empCategory,
                fileName, body.empHomeNumber, body.empMobileNumber, body.empStreet, body.suburbPostcode, body.empState, body.uniqueForEmp
            ],
            (error, results) => {
                if(error) { 
                    return callBack(error);                    
                }
                
                if(len == 0){                    
                    addEmployeeTradeInfo(body, { insertId: body.uniqueForEmp }, (err, res) => {
                        if(err) {
                            console.error(err);
                            return callBack(err);
                        }
                        return callBack(null, res);
                    });
                } else {
                    updateEmployeeTradeInfo(body, (err, res) => {
                        if(err) {
                            console.error(err);
                            return callBack(err);
                        }
                        return callBack(null, res);
                    });
                }
                               
            }
        )
    },

    verifyUserWithEmailAndToken: (data, callBack) => {
        pool.query(
            'SELECT verify_token, active FROM employees WHERE email = ?;',
            [ data.email ],
            (error, result) => {
                if(error) { 
                    return callBack(error);                    
                }
                return callBack(null, result[0], result.length);
            }
        )
    },


    updateEmployeeAsActive: (data, callBack) => {
        pool.query(
            'UPDATE employees SET active = ?, verify_token = ? WHERE email = ?;',
            [ true, null, data.email ],
            (error, result) => {
                if(error) { 
                    return callBack(error);                    
                }
                return callBack(null, result);
            }
        )
    },

    // Not need to delete employee reference from employee_trade_info table
    // as ON DELETE CASCADE property is set.
    deleteEmployee: (id, callBack) =>{
        pool.query(
            'DELETE FROM employees WHERE emp_number = ?;',
            [ id ],
            (error, result) => {
                if(error) return callBack(error);
                return callBack(null, result);                
            }
        )
    },

    updateEmployeePasswordAndStatus: (data, callBack) => {
        pool.query(
            'UPDATE employees SET password = ?, active = ?, modified_time = ? WHERE email = ?',
            [ data.newPassword, true, new Date(), data.email ],
            (error, result) => {
                if(error) return callBack(error);
                return callBack(null, result);
            }
        )
    },
    
    sessionStart: (data, callBack) => {
        pool.query(
            'INSERT INTO employee_login_history (emp_user_id, emp_number, login_time) VALUES (?, ?, ?);',
            [ data.emp_user_id, data.emp_number, new Date() ],
            (error, result) => {
                if(error) return callBack(error);
                return callBack(null, result);                
            }
        )
    },

    sessionEnd: (historyId, callBack) => {
        pool.query(
            'UPDATE employee_login_history SET logout_time = ? WHERE history_id = ?;',
            [ new Date(), historyId ],
            (error, result) => {
                if(error) return callBack(error);
                return callBack(null, result);                
            }
        )
    }

}

function genereateToken() {
    return crypto.randomBytes(16).toString('hex');
}


function updateEmployeeTradeInfo(body, callBack) {
    pool.query(
        'UPDATE employee_trade_info SET emp_number = ?, tax_file_no = ?, hourly_rate = ?, penelty_1 = ?, '+
        'penelty_2 = ?, modified_time = ? WHERE  id = ?',
        [ body.empIdNumber, body.taxNumber, body.hourRate, body.peneltyOne, body.peneltyTwo, new Date(), body.uniqueForTrade ],
        (error, results) => {
            if(error) {
                return callBack(error);
            }
            return callBack(null, results);
        }
    )
}

function addEmployeeTradeInfo(body, results, callBack) {
    pool.query(
        'INSERT INTO employee_trade_info (emp_user_id, emp_number, tax_file_no, hourly_rate, penelty_1, penelty_2, create_time, modified_time)' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [results.insertId, body.empIdNumber, body.taxNumber, body.hourRate, body.peneltyOne, body.peneltyTwo, new Date(), new Date()],
        (error, results) => {
            if(error) {
                return callBack(error);
            }
            return callBack(null, results);
        }
    )
}