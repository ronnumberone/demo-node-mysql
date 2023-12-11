const connection = require('../../config/db');

class Products {
  getAllProducts() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT P.*, U.userName FROM Products P LEFT JOIN Users U ON P.userId = U.userId;', function (err, results, fields) {
        if (err) {
          reject(err);
          return;
        }

        resolve(results);
      });
    });
  }

  getProductById(productId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT P.*, U.userName FROM Products P LEFT JOIN Users U ON P.userId = U.userId where productId = ?;', [productId], function (err, results, fields) {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  createProduct(values) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO products (productId, productName, productCost, productDescription, image, userId) VALUES (?, ?, ?, ?, ?, ?);', values, (err, result) => {
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

  updateProduct(values) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE products SET productName= ?, productCost = ?, productDescription = ?, image = ? WHERE productId = ?;', values, (err, result) => {
        if (err) {
          console.error('Lỗi khi cập nhật dữ liệu:', err);
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }
        console.log('Dữ liệu đã được cập nhật');
        resolve(result); // Trả về kết quả nếu thành công
      });
    });
  }

  getProductsByUserName(userName) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT Products.* FROM Products INNER JOIN Users ON Products.userId = Users.userId WHERE Users.userName = ?;', [userName], function (err, results, fields) {
        if (err) {
          reject(err);
          return;
        }

        resolve(results);
      });
    });
  }

  deleteProductsById(productId) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM products WHERE productId = ?;', [productId], function (err, results, fields) {
        if (err) {
          reject(err);
          return;
        }
        console.log('xoa thanh cong');
        resolve(results);
      });
    });
  }

  searchForProducts(productName) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Products WHERE productName LIKE ?', [productName], (err, result) => {
        if (err) {
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }
        resolve(result); // Trả về kết quả nếu thành công
      });
    });
  }

  numberOfProducts() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT COUNT(productId) AS numberOfProducts FROM Products", (err, result) => {
        if (err) {
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }
        resolve(result); // Trả về kết quả nếu thành công
      });
    });
  }

}

module.exports = new Products;