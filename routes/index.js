const verifyToken = require('../auth/verify');
const jwt = require('jsonwebtoken');
const express = require('express');
const {nanoid} = require('nanoid');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const moment = require('moment');
const client = require('../db/conn.js');
const config = require('../config');

module.exports = router;

router.use(jsonParser);

// show all users
router.get('/api/profile', verifyToken, (req, res, next) => {
  try {
    if (req.role === 'admin') {
      client.query('SELECT * FROM users', (error, result) => {
        if (result.rows !== undefined) {
          res.setHeader('Content-Type', 'application/json');
          res.status(200);
          return res
              .send(
                  JSON.stringify(
                      {
                        status: 200,
                        message: 'Semua user',
                        data: result.rows,
                      },
                      null,
                      3,
                  ),
              );
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        return res
            .send(
                JSON.stringify(
                    {
                      status: 400,
                      message: 'User kosong',
                    },
                    null,
                    3,
                ),
            );
      });
    } else {
      client.query(
          'SELECT * FROM users WHERE id_user = $1',
          [req.id_user],
          (error, result) => {
            console.log(result);
            if (result.rows[0] !== undefined) {
              const myname = result.rows[0].name;
              const myemail = result.rows[0].email;
              const mypass = result.rows[0].pass;
              const mycash = result.rows[0].jumlah;
              const myuid = result.rows[0].id_user;
              const mywallet = result.rows[0].nomor_wallet;
              res.setHeader('Content-Type', 'application/json');
              res.status(200);
              return res
                  .send(
                      JSON.stringify(
                          {
                            id_user: myuid,
                            name: myname,
                            pass: mypass,
                            email: myemail,
                            jumlah: mycash,
                            nomor_wallet: mywallet,    
                          },
                          null,
                          3,
                      ),
                  );
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(400);
            return res
                .send(
                    JSON.stringify(
                        {
                          status: 400,
                          message: 'User tidak ditemukan',
                        },
                        null,
                        3,
                    ),
                );
          },
      );
    }
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .send(
            JSON.stringify(
                {
                  status: 500,
                  message: 'Server error',
                },
                null,
                3,
            ),
        );
  }

});

// Daftar pengguna
router.post('/api/profile', async (req, res, next) => {
  try {
    if (!req.body.name || req.body.name.length < 3) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
          .send(
              JSON.stringify(
                  {
                    status: 400,
                    message: 'Nama tidak boleh kurang dari 3 huruf',
                  },
                  null,
                  3,
              ),
          );
    }
    if (!req.body.pass || req.body.pass.length < 3) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
          .send(
              JSON.stringify(
                  {
                    status: 400,
                    message: 'Password tidak boleh kurang dari 3 huruf',
                  },
                  null,
                  3,
              ),
          );
    }
    if (!req.body.email || !req.body.email.includes('@')) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
          .send(
              JSON.stringify(
                  {
                    status: 400,
                    message: 'Email tidak sesuai',
                  },
                  null,
                  3,
              ),
          );
    }

    client.query(
        'SELECT EXISTS (SELECT name FROM users WHERE name = $1)',
        [req.body.name],
        (error, result) => {
          if (result.rows[0].exists === true) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400);
            return res
                .send(
                    JSON.stringify(
                        {
                          status: 400,
                          message: 'Name telah digunakan',
                        },
                        null,
                        3,
                    ),
                );
          }
          const id_user = nanoid(16);
          const nomor_wallet = nanoid(16);
          client.query(
              'INSERT INTO users(id_user, name, pass, email, role, jumlah, nomor_wallet) VALUES ($1, $2, $3, $4, \'user\', 10000, $5)',
              [id_user, req.body.name, req.body.pass, req.body.email, nomor_wallet],
              (error, result) => {
                if (result.rowCount !== 0) {
                  res.setHeader('Content-Type', 'application/json');
                  res.status(200);
                  return res
                      .send(
                          JSON.stringify(
                              {
                                status: 200,
                                message: 'Pendaftaran Berhasil',
                              },
                              null,
                              3,
                          ),
                      );
                }
              },
          );
        },
    );
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .send(
            JSON.stringify(
                {
                  status: 500,
                  message: 'Server error',
                },
                null,
                3,
            ),
        );
  }
});

// login
router.post('/api/login', async (req, res, next) => {
  try {
    if (!req.body.pass || req.body.pass.length < 3) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
          .send(
              JSON.stringify(
                  {
                    status: 400,
                    message: 'Password tidak boleh kurang dari 3 huruf',
                  },
                  null,
                  3,
              ),
          );
    }
    if (!req.body.email || !req.body.email.includes('@')) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
          .send(
              JSON.stringify(
                  {
                    status: 400,
                    message: 'Email tidak sesuai',
                  },
                  null,
                  3,
              ),
          );
    }

    client.query(
        'SELECT * FROM users WHERE email = $1 AND pass = $2',
        [req.body.email, req.body.pass],
        (error, result) => {
          if (result.rows[0] !== undefined) {
          // console.log(result.rows[0])
            const myname = result.rows[0].name;
            const myemail = result.rows[0].email;
            const myrole = result.rows[0].role;
            const mycash = result.rows[0].jumlah;
            const myuid = result.rows[0].id_user;
            const mywallet = result.rows[0].nomor_wallet;
            const token = jwt.sign(
                {
                  id_user: myuid,
                  name: myname,
                  email: myemail,
                  role: myrole,
                  jumlah: mycash,
                  nomor_wallet: mywallet,
                },
                config.secret,
                {expiresIn: 86400},
            );
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            return res
                .send(
                    JSON.stringify(
                        {

                          jwt: token,
                        },
                        null,
                        3,
                    ),
                );
          }
          res.setHeader('Content-Type', 'application/json');
          res.status(400);
          return res
              .send(
                  JSON.stringify(
                      {
                        status: 400,
                        message: 'Invalid User or Password',
                      },
                      null,
                      3,
                  ),
              );
        },
    );
  } catch (error) {
    // console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .send(
            JSON.stringify(
                {
                  status: 500,
                  message: 'Server error',
                },
                null,
                3,
            ),
        );
  }
});

// topup
router.put('/api/profile/:user', verifyToken, async (req, res, next) => {
  try {
    if (req.body.jumlah < 1000) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
          .send(
              JSON.stringify(
                  {
                    status: 400,
                    message: 'Topup tidak boleh kurang dari 1000',
                  },
                  null,
                  3,
              ),
          );
    }

    const {user} = req.params;
    client.query(
        'UPDATE users SET jumlah = jumlah + $1 WHERE id_user = $2',
        [req.body.jumlah, req.id_user],
        (error, result) => {
          if (result.rowCount > 0) {
            const todayDate = moment(new Date()).format('YYYY-MM-DD');
            const todayTime = moment(new Date()).format('HH:mm:ss');
            client.query(
                'INSERT INTO mk_histori_topup(id_user, name, jumlah, waktu, tanggal) VALUES($1, $2, $3, $4, $5)',
                [user, req.name, req.body.jumlah, todayTime, todayDate],
            );
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            return res
                .send(
                    JSON.stringify(
                        {
                          status: 200,
                          message: 'Top up berhasil',
                        },
                        null,
                        3,
                    ),
                );
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(400);
            return res
                .send(
                    JSON.stringify(
                        {
                          status: 400,
                          message: 'Topup gagal',
                        },
                        null,
                        3,
                    ),
                );
          }
        },
    );
  } catch (error) {
    conslo/log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .send(
            JSON.stringify(
                {
                  status: 500,
                  message: 'Server error',
                },
                null,
                3,
            ),
        );
  }
});

// topup history
router.get('/api/history', verifyToken, async (req, res, next) => {
  try {
    client.query('SELECT name, jumlah, tanggal FROM mk_histori_topup WHERE id_user = $1', [req.id_user], (error, result) => {
        if (result.rows[0] !== undefined) {
          const myname = result.rows[0].name;
          const myjumlah = result.rows[0].jumlah;
          const mydate = result.rows[0].tanggal;
          res.setHeader('Content-Type', 'application/json');
          res.status(200);
          return res
              .send(
                  JSON.stringify(
                      {
                        name: myname,
                        jumlah: myjumlah,
                        tanggal: mydate,   
                      },
                      null,
                      3,
                ),
            );
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        return res
            .send(
                JSON.stringify(
                    {
                      status: 400,
                      message: 'Tidak ada history topup',
                    },
                    null,
                    3,
                ),
            );
      }
    });
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .send(
            JSON.stringify(
                {
                  status: 500,
                  message: 'Server error',
                },
                null,
                3,
            ),
        );
  }
});

router.put('/api/pembelian', verifyToken, async (req, res, next) => {
  try {
    const {jumlah} = req.body;
    client.query('SELECT jumlah FROM users WHERE id_user = $1', [req.id_user], (error, result) => {
      if (result.rows[0] !== undefined) {
        if (result.rows[0]['jumlah'] < jumlah) {
          res.setHeader('Content-Type', 'application/json');
          res.status(400);
          return res
              .send(
                  JSON.stringify(
                      {
                        status: 400,
                        message: 'Saldo tidak mencukupi',
                      },
                      null,
                      3,
                  ),
              );
        }
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        return res
            .send(
                JSON.stringify(
                    {
                      status: 400,
                      message: 'User tidak ditemukan',
                    },
                    null,
                    3,
                ),
            );
      }
    });
    client.end;

    client.query('UPDATE users SET jumlah = jumlah - $1 WHERE id_user = $2', [jumlah, req.id_user], (error, result) => {
      if (result.rowCount > 0) {
        const todayDate = moment(new Date()).format('YYYY-MM-DD');
        const todayTime = moment(new Date()).format('HH:mm:ss');
        client.query(
            'INSERT INTO mk_histori_bayar(id_user, name, jumlah, waktu, tanggal) VALUES($1, $2, $3, $4, $5)',
            [req.id_user, req.name, req.body.jumlah, req.body.nomor_wallet, todayTime, todayDate],
        );
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        return res
            .send(
                JSON.stringify(
                    {
                      status: 200,
                      message: 'Pembayaran berhasil',
                    },
                    null,
                    3,
                ),
            );
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        return res
            .send(
                JSON.stringify(
                    {
                      status: 400,
                      message: 'Pembayaran gagal',
                    },
                    null,
                    3,
                ),
            );
      }
    });
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .send(
            JSON.stringify(
                {
                  status: 500,
                  message: 'Server error',
                },
                null,
                3,
            ),
        );
  }
});