var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var db = mysql.createConnection({
    host: "localhost",
    user: "test1",
    password: "test1",
    database: "test"
});

db.connect(function(err) {
  if (err) {
      console.log('connecting error');
      return;
  }
  console.log('connecting success');
});
/* GET home page. */
router.get('/', function(req, res) {
  res.render('student');
});

router.get('/getList', function(req, res) {
  var sql = 'SELECT * FROM teacher';
  db.query(sql, function(err, rows) {
    if (err) {
        console.log(err);
    }
    res.json(rows);
  });
});

router.post('/ans', function(req, res) {
  var sql = "INSERT INTO student SET ?";
  db.query(sql, req.body,function(err, rows) {
    if (err) {
      console.log(err);
    }
    
    res.json({'id': rows.insertId});
  });
});

module.exports = router;
