const pool = require('../config/db_config');



module.exports = {    
    createUserService: (data, callBack) => {
        pool.query(
            'INSERT INTO public_users (username, email, contact_number, site_location, create_time, modified_time) values (?, ?, ? ,?, ?, ?);',
            [
                data.username,
                data.email,
                data.contactNumber,
                data.siteLocation,
                new Date(),
                new Date()
            ],
            (error, results, fields) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },

    createQuotationService: (data, callBack) => {
        pool.query(
            'INSERT INTO public_user_quotations(user_id, facility, freq_of_cleaning, gross_area, shower_count, toilet_count)'+
             'values(?, ?, ? ,?, ?, ?);',
            [
                data.userId,
                data.selectedFacility,
                data.selectedFrequency,
                data.selectedArea,
                data.selectedShower,
                data.selectedToilet
            ],
            (error, results, fields) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },  

    
}