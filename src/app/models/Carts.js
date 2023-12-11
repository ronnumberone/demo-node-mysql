const connection = require('../../config/db');

class Carts {
  getAllProductsInCartByUserId(userId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT P.productId, P.productName, P.productCost, P.image, C.quantity FROM Products P INNER JOIN Carts C ON P.productId = C.ProductId where C.userId = ?;', [userId], function (err, results, fields) {
        if (err) {
          reject(err);
          return;
        }

        resolve(results);
      });
    });
  }

  checkIfProducts(userId, productId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT productId from Carts where userId = ? and productId = ?;', [userId, productId], function (err, results, fields) {
        if (err) {
          reject(err);
          return;
        }
        const hasProducts = results.length > 0;
        resolve(hasProducts);
      });
    });
  }

  addToCart(values) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO carts (userId, productId, quantity) VALUES (?, ?, ?);', values, (err, result) => {
        if (err) {
          console.error('Lỗi khi thêm dữ liệu:', err);
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }
        console.log('Dữ liệu đã được thêm vào bảng Carts');
        resolve(result); // Trả về kết quả nếu thành công
      });
    });
  }

  totalCost(userId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT SUM(p.productCost * c.quantity) AS totalCost FROM Carts c JOIN Products p ON c.productId = p.productId WHERE c.userId = ?; ', [userId], (err, result) => {
        if (err) {
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }
        resolve(result); // Trả về kết quả nếu thành công
      });
    });
  }

  numberOfProducts(userId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT COUNT(productId) AS numberOfProducts FROM Carts where userId = ?;', [userId], (err, result) => {
        if (err) {
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }
        resolve(result); // Trả về kết quả nếu thành công
      });
    });
  }

  quantityOfProduct(userId, productId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT quantity FROM Carts where userId = ? and productId = ?', [userId, productId], (err, result) => {
        if (err) {
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }
        resolve(result); // Trả về kết quả nếu thành công
      });
    });
  }

  updateQuantity(quantity, userId, productId){
    return new Promise((resolve, reject) => {
      connection.query('UPDATE Carts set quantity = ? where userId = ? and productId = ?;', [quantity, userId, productId], (err, result) => {
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

  deleteProducts(userId, productId){
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM Carts WHERE userId = ? and productId = ?;', [userId, productId], (err, result) => {
        if (err) {
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }
        resolve(result); // Trả về kết quả nếu thành công
      });
    });
  }
}

module.exports = new Carts;