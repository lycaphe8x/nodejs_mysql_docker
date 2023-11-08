const express = require('express');
const mysql = require('mysql');
const app = express();

// Thiết lập EJS làm template engine
app.set('view engine', 'ejs');

// Định nghĩa thông tin kết nối CSDL
const connection = mysql.createConnection({
  host: 'localhost', // Hoặc IP máy chủ CSDL nếu không phải localhost
  user: 'root',  // Tên đăng nhập
  password: '',  // Mật khẩu
  database: 'books' // Tên CSDL
});

// Kết nối đến CSDL
connection.connect(error => {
  if (error) {
    console.error('Kết nối thất bại: ' + error.stack);
    return;
  }
  console.log('Kết nối thành công với id ' + connection.threadId);
});

// Định nghĩa route cho trang chủ
app.get('/', (req, res) => {
  // Truy vấn lấy 10 cuốn sách đầu tiên
  connection.query('SELECT * FROM items ORDER BY id ASC LIMIT 10', (error, results, fields) => {
    if (error) throw error;

    // Render kết quả ra file EJS (giao diện)
    res.render('index', { books: results });
  });
});

// Bắt đầu server trên port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên port ${port}`);
});

// Đóng kết nối khi ứng dụng kết thúc
process.on('SIGINT', () => {
  connection.end(err => {
    if (err) return console.log(`Lỗi khi đóng CSDL: ${err}`);
    console.log('Kết nối CSDL đã được đóng.');
    process.exit();
  });
});
