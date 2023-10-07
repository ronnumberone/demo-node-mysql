const connection = require('../../config/db');

class Products {
    getAllUsers() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM products', function (err, results, fields) {
                if (err) {
                    reject(err);
                    return;
                }    
                
                resolve(results);
            });
        });
    }

    createProduct(sql, values) {
        return new Promise((resolve, reject) => {
          connection.query(sql, values, (err, result) => {
            if (err) {
              console.error('Lỗi khi thêm dữ liệu:', err);
              reject(err); // Trả về lỗi nếu có lỗi
              return;
            }
            console.log('Dữ liệu đã được thêm vào bảng Products');
            resolve(result); // Trả về kết quả nếu thành công
          });
        });
      }
}

module.exports = new Products;