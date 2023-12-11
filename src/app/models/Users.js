const connection = require('../../config/db');

class Users {
  createUser(values) {
    return new Promise((resolve, reject) => {
      // Truy vấn kiểm tra xem userName đã tồn tại hay chưa
      connection.query('SELECT * FROM users WHERE userName = ?', [values[1]], (err, results) => {
        if (err) {
          console.error('Lỗi khi kiểm tra người dùng:', err);
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }

        // Kiểm tra xem tên người dùng đã tồn tại hay chưa
        if (results.length > 0) {
          reject([true]); // Trả về lỗi nếu tên người dùng bị trùng
          return;
        }

        // Nếu userName chưa tồn tại, thêm dữ liệu người dùng mới vào cơ sở dữ liệu
        connection.query('INSERT INTO users (userId, userName, password) VALUES (?, ?, ?)', values, (err, result) => {
          if (err) {
            console.error('Lỗi khi thêm dữ liệu:', err);
            reject(err); // Trả về lỗi nếu có lỗi
            return;
          }
          console.log('Đã thêm mới một User');
          resolve(result); // Trả về kết quả nếu đăng ký thành công
        });
      });
    });
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM users where role != 'admin';", (err, result) => {
        //nếu chưa có người dùng 
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      })
    });
  }

  deleteUserById(userId) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM Carts WHERE userId = ?', [userId], (error, results) => {
        connection.query('DELETE FROM Products WHERE userId = ?', [userId], (error, results) => {
          connection.query('DELETE FROM Users WHERE userId = ?', [userId], (error, results) => {
            if (error) {
              console.error("Lỗi khi xóa dữ liệu từ bảng Users:", error);
              // Xử lý lỗi ở đây
            } else {
              resolve(results);
            }
          });
        });
      });
    });
  }

  changePassword(userName, password) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE Users SET password = ? WHERE userName = ?;', [password, userName], (err, result) => {
        //nếu chưa có người dùng 
        if (err) {
          console.log('Đổi mk thất bại');
          reject(err);
          return;
        }
        console.log('Đổi mk thành công');
        resolve(result);
      })
    });
  }

  getHashedPassword(userName) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT password FROM users where userName = ?;', [userName], (err, result) => {
        //nếu chưa có người dùng 
        if (result.length === 0) {
          reject(err);
          return;
        }
        resolve(result[0].password);
      })
    });
  }

  getUserIdByName(userName) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT userId FROM users where userName = ?;', [userName], (err, result) => {
        //nếu chưa có người dùng 
        if (err) {
          reject(err)
          return;
        }
        resolve(result[0].userId);
      })
    });
  }

  checkAdmin(userId) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM users where userId = ? and role = 'admin';", [userId], (err, result) => {
        //nếu chưa có người dùng 
        if (err) {
          reject(err);
          return;
        }
        if (result.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
    });
  }

  numberOfUsers() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT COUNT(userId) AS numberOfUsers FROM Users where USERNAME != 'admin'", (err, result) => {
        if (err) {
          reject(err); // Trả về lỗi nếu có lỗi
          return;
        }
        resolve(result); // Trả về kết quả nếu thành công
      });
    });
  }

}

module.exports = new Users;