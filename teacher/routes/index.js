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
  res.render('index');
});

router.get('/getList', function(req, res) {
  var sql = 'SELECT * FROM teacher';
  db.query(sql, function(err, rows) {
    if (err) {
        console.log(err);
    }
    //res.json(rows);
    res.json(rows);
  });
});

router.post('/addQues', function(req, res) {
  var sql = "INSERT INTO teacher SET ?";
  
  db.query(sql, req.body,function(err, rows) {
    if (err) {
      console.log(err);
    }
    
    res.json({'id': rows.insertId});
  });
});

router.get('/preview/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM teacher WHERE id = ?";

  db.query(sql, id, function(err, rows) {
    if (err) {
      console.log(err);
    }
    res.json(rows);
  });
});

router.delete('/delete/:id', function(req, res) {
  var id = req.params.id;
  var sql = "DELETE FROM teacher WHERE id = ?";

  db.query(sql, id, function(err, rows) {
    if (err) {
      console.log(err);
    }
  });

  res.redirect(303, '/');
});


module.exports = router;
