const connection = require('../../config/db');

class User {
    getAllUsers() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users', function (err, results, fields) {
                if (err) {
                    reject(err);
                    return;
                }    
                
                resolve(results);
            });
        });
    }
}

module.exports = new User;