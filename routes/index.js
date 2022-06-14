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
const axios = require('axios');

module.exports = router;

router.use(jsonParser);

router.get('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile('/app/html/index.html');
});

router.get('/register', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile('/app/html/register.html');
});

router.get('/login', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile('/app/html/login.html');
});

router.get('/coinless', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile('/app/html/index.html');
});

// show all users
router.get('/api/profile', verifyToken, (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.role === 'admin') {
      client.query('SELECT * FROM users', (error, result) => {
        if (result.rowCount > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.status(200);
          return res.json({
            status: 200,
            message: 'Semua user',
            data: result.rows,
          });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        return res.json({
          status: 400,
          message: 'User Kosong',
          data: [],
        });
      });  
    } else {
      client.query(
          'SELECT * FROM users WHERE id_user = $1',
          [req.id_user],
          (error, result) => {
            //console.log(result);
            if (result.rows[0] !== undefined) {
              const myname = result.rows[0].name;
              const myemail = result.rows[0].email;
              const mypass = result.rows[0].pass;
              const mycash = result.rows[0].saldo;
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
                            saldo: mycash,
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
    return res.json({
      status: 500,
      message: 'Server error',
    });
  }
});

// Daftar pengguna
router.post('/api/profile', async (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!req.body.name || req.body.name.length < 3) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
          .json(
              {
                status: 400,
                message: 'Nama tidak boleh kurang dari 3 karakter',
                },
          );
    }
    if (!req.body.pass || req.body.pass.length < 8) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
        .json(
        {
          status: 400,
          message: 'Password tidak boleh kurang dari 8 karakter',
        },
      );
    }
    if (!req.body.email || !req.body.email.includes('@')) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
        .json(
          {
            status: 400,
            message: 'Email tidak sesuai format',
          },
      );
    }

    client.query(
        'SELECT EXISTS (SELECT email FROM users WHERE email = $1)',
        [req.body.name],
        (error, result) => {
          if (result.rows[0].exists === true) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400);
            return res
              .json(
                {
                  status: 400,
                  message: 'Email telah digunakan',
                },
              );
          }
          const id_user = nanoid(16);
          const nomor_wallet = nanoid(16);
          client.query(
              'INSERT INTO users(id_user, name, pass, email, role, saldo, nomor_wallet) VALUES ($1, $2, $3, $4, \'user\', 0, $5)',
              [id_user, req.body.name, req.body.pass, req.body.email, nomor_wallet],
              (error, result) => {
                if (result.rowCount !== 0) {
                  res.setHeader('Content-Type', 'application/json');
                  res.status(200);
                  return res
                      .json(
                            {
                              status: 200,
                              message: 'Pendaftaran Berhasil',
                            },
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
        .json(
              {
                status: 500,
                message: 'Server error',
              },
        );
  }
});

// login
router.post('/api/login', async (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!req.body.pass || req.body.pass.length < 3) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
          .json(
              {
                status: 400,
                message: 'Username atau password tidak sesuai',
              },
          );
    }

    client.query(
        'SELECT * FROM users WHERE email = $1 AND pass = $2',
        [req.body.email, req.body.pass],
        (error, result) => {
          if (result.rowCount > 0) {
            const myname = result.rows[0].name;
            const myemail = result.rows[0].email;
            const myrole = result.rows[0].role;
            const mycash = result.rows[0].saldo;
            const myuid = result.rows[0].id_user;
            const mywallet = result.rows[0].nomor_wallet;
            const token = jwt.sign(
                {
                  id_user: myuid,
                  name: myname,
                  email: myemail,
                  role: myrole,
                  saldo: mycash,
                  nomor_wallet: mywallet,
                },
                config.secret,
                {expiresIn: 86400},
            );
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            return res
                .json(
                    {
                      status: 200,
                      jwt: token,
                    },
                );
          }
          res.setHeader('Content-Type', 'application/json');
          res.status(400);
          return res
              .json(
                      {
                        status: 400,
                        message: 'Username atau password salah',
                      },
              );
        },
    );
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .json(
            {
              status: 500,
              message: 'Server error',
            },
        );
  }
});

// topup
router.put('/api/profile/:user', verifyToken, async (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body.jumlah < 1000) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res
          .json(
                  {
                    status: 400,
                    message: 'Topup tidak boleh kurang dari 1000',
                  },
          );
    }

    const {user} = req.params;
    client.query(
        'UPDATE users SET saldo = saldo + $1 WHERE id_user = $2',
        [req.body.jumlah, req.id_user],
        (error, result) => {
          if (result.rowCount > 0) {
            const todayDate = moment(new Date()).format('YYYY-MM-DD');
            const todayTime = moment(new Date()).format('HH:mm:ss');
            client.query(
                'INSERT INTO history_topup(id_user, name, jumlah, waktu, tanggal, keterangan) VALUES($1, $2, $3, $4, $5, \'Top up\')',
                [user, req.name, req.body.jumlah, todayTime, todayDate],
            );
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            return res
                .json(
                        {
                          status: 200,
                          message: 'Top up berhasil',
                        },
                );
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(400);
            return res
                .json(
                    {
                      status: 400,
                      message: 'Gagal topup',
                    },
                );
          }
        },
    );
  } catch (error) {
    conslo/log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .json(
            {
              status: 500,
              message: 'Server error',
            },
        );
  }
});

// History Top up
router.get('/api/history/topup', verifyToken, async (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    client.query('SELECT id_user, name, jumlah, tanggal, keterangan FROM history_topup WHERE id_user = $1', [req.id_user], (error, result) => {
      if (result.rowCount > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.status(200);
        return res
            .json(
                {
                  status: 200,
                  message: 'Histori topup',
                  data: result.rows,
                },
            );
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        return res
            .json(
                    {
                      status: 400,
                      message: 'Tidak ada history topup',
                    },
            );
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    return res
        .json(
                {
                  status: 500,
                  message: 'Server error',
                },
        );
  }
});

//pembelian
router.put('/api/pembelian', verifyToken, async (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const jumlah = req.body.jumlah;
    if (jumlah <= 0) {
      res.status(400);
      return res.json({
        status: 400,
        message: 'Jumlah tidak sesuai',
      });
    };
    console.log(jumlah);
    client.query('SELECT * FROM users WHERE id_user = $1', [req.id_user], (error, result) => {
      if (result.rowCount > 0) {
        if (req.saldo < jumlah) {
          res.status(400);
          return res.json({
            status: 400,
            message: 'Saldo anda tidak cukup',
          });
      } else {
        client.query('UPDATE users SET saldo = saldo - $1 WHERE id_user = $2', [jumlah, req.id_user], (error, result) => {
          if (result.rowCount > 0) {
            const todayDate = moment(new Date()).format('YYYY-MM-DD');
            const todayTime = moment(new Date()).format('HH:mm:ss');
            // console.log(req.uid, req.name, jumlah, todayDate, todayTime);
            client.query(
                "INSERT INTO history_pembelian(id_user, name, jumlah, waktu, tanggal, emoney, nama_barang) VALUES($1, $2, $3, $4, $5, 'CoinLess', $6)",
                [req.id_user, req.name, jumlah, todayTime, todayDate, req.body.nama_barang],
            );
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            return res
                .json(
                    {
                      status: 200,
                      message: 'Pembayaran berhasil',
                    },
                );
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(400);
            return res
                .json(
                    {
                      status: 400,
                      message: 'Pembayaran gagal',
                    },
                );
          }
        });
      }
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(400);
      return res.json({
        status: 400,
        message: 'User tidak ada',
      });
    }
  });
  client.end;
} catch (error) {
  console.log(error);
  res.setHeader('Content-Type', 'application/json');
  res.status(500);
  return res
      .json(
          {
            status: 500,
            message: 'Server error',
          },
      );
}
});

router.post('/api/transaksi', verifyToken, async (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id_barang, wallet, harga} = req.body;
    client.query('SELECT * FROM barang WHERE id_barang = $1', [id_barang], (error, result) => {
      // console.log(result.rows);
      if (result.rowCount <= 0) {
        res.status(400);
        return res.json({
          status: 400,
          message: 'Barang tidak ditemukan',
        });
      } else {
        if (wallet === 'coinless') {
          const token = req.headers.authorization;
          const config = {
            headers: {Authorization: token},
          };
          const payload = {
            harga: harga,
          };
          axios
              .put('https://coinless.herokuapp.com/api/pembelian', payload, config)
              .then((ress) => {
                // return res.send(ress.data);
                // kalau pembayaran berhasil
                if (ress.data.status === 200) {
                  return res.json({
                    status: 200,
                    message: 'Pembayaran dengan coinless berhasil',
                  });
                  // lakukan query disini
                }
              })
              .catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(400);
                return res.send(error.response.data);
              });
        } else if (wallet === 'otakupay') {
          axios
              .post('https://opay-v2.herokuapp.com/auth/login', {
                username: 'coinless',
                password: 'coinless123',
              })
              .then((ress) => {
                otakupayToken = ress.data.token;
                console.log(otakupayToken);
                const config = {
                  headers: {Authorization: `Bearer ${otakupayToken}`},
                };
                const payload = {
                  price: harga,
                };
                axios
                    .post('https://opay-v2.herokuapp.com/user/payment', payload, config)
                    .then((riss) => {
                      // res.send(riss.data);
                      // kalau pembarana berhasil
                      if (riss.data.msg === 'Payment Success') {
                        const todayDate = moment(new Date()).format('YYYY-MM-DD');
                        const todayTime = moment(new Date()).format('HH:mm:ss');
                        // console.log(req.uid, req.name, jumlah, todayDate, todayTime);
                        client.query(
                            "INSERT INTO history_pembelian(id_user, name, jumlah, waktu, tanggal, emoney, nama_barang) VALUES($1, $2, $3, $4, $5, 'otakupay', $6)",
                            [req.id_user, req.name, harga, todayTime, todayDate, req.body.nama_barang],
                        );
                        res.status(200);
                        return res.json({
                          status: 200,
                          message: 'Pembayaran dengan otakupay berhasil',
                        });
                        // lakukan query disini
                      }
                    })
                    .catch((error) => {
                      res.setHeader('Content-Type', 'application/json');
                      res.status(400);
                      return res.send(error.response.data);
                    });
                // res.cookie('harpay', ress.data.token);
                // return res.send(ress.data);
              })
              .catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(400);
                return res.send(error.response.data);
              });
        } else if (wallet === 'ecia') {
          // dapatin jwt
          axios
              .post('https://api-ecia.herokuapp.com/api/login', {
                email: 'coinless@test.com',
                pass: 'coinless123',
              })
              .then((ress) => {
                // dapatin info
                aciaToken = ress.data.token;
                const config = {
                  headers: {Authorization: `Bearer ${aciaToken}`},
                };
                axios
                    .get('https://api-ecia.herokuapp.com/api/profile', config)
                    .then((rass) => {
                      // return res.send(rass.data);
                      // lakukan pembelian barang
                      const idEcia = rass.data.id_user;
                      const walletEcia = rass.data.nomor_wallet;
                      const payloadBeli = {
                        id_user: idEcia,
                        nama_barang: result.rows[0]['nama_barang'],
                        harga: harga,
                        nomor_wallet: walletEcia,
                      };
                      axios
                          .post('https://api-ecia.herokuapp.com/api/pembelian', payloadBeli, config)
                          .then((riss) => {
                            // return res.send(riss.data);
                            // melakukan pembayaran akhir dari pembayaran sebelumnya
                            const idBarang = riss.data.id_pemesanan;
                            const payloadBayar = {
                              jumlah: harga,
                              nomor_wallet_client: walletEcia,
                              referensi: idBarang,
                            };
                            axios
                                .post('https://api-ecia.herokuapp.com/api/transaksi', payloadBayar, config)
                                .then((ross) => {
                                  // final
                                  // return res.send(ross);
                                  if (ross.data.status == 200) {
                                    const todayDate = moment(new Date()).format('YYYY-MM-DD');
                                    const todayTime = moment(new Date()).format('HH:mm:ss');
                                    // console.log(req.uid, req.name, jumlah, todayDate, todayTime);
                                    client.query(
                                        "INSERT INTO history_pembelian(id_user, name, jumlah, waktu, tanggal, emoney, nama_barang) VALUES($1, $2, $3, $4, $5, 'ecia', $6)",
                                        [req.id_user, req.name, harga, todayTime, todayDate, req.body.nama_barang],
                                    );
                                    res.status(200);
                                    return res.json({
                                      status: 200,
                                      message: 'Pembayaran dengan ecia berhasil',
                                    });
                                  }
                                })
                                .catch((error) => {
                                  // res.setHeader('Content-Type', 'application/json');
                                  // res.status(400);
                                  // return res.send(error.response.data);
                                  console.log(error);
                                });
                          })
                          .catch((error) => {
                            // res.setHeader('Content-Type', 'application/json');
                            // res.status(400);
                            // return res.send(error.response.data);
                            console.log(error);
                          });
                    })
                    .catch((error) => {
                      // res.setHeader('Content-Type', 'application/json');
                      // res.status(400);
                      // return res.send(error.response.data);
                      console.log(error);
                    });
              })
              .catch((error) => {
                // res.setHeader('Content-Type', 'application/json');
                // res.status(400);
                // return res.send(error.response.data);
                console.log(error);
              });
        } else if (wallet === 'egil') {
          axios
              .post('https://egilwallet.herokuapp.com/api/login', {
                email: 'coinless@gmail.com',
                password: 'coinless123',
              })
              .then((ress) => {
                egilToken = ress.data.accesToken;
                console.log(egilToken);
                const config = {
                  headers: {Authorization: `Bearer ${egilToken}`},
                };
                const emailEgil = ress.data.email;
                const payload = {                 
                  harga: harga,
                  email: emailEgil,
                };
                axios
                    .post('https://egilwallet.herokuapp.com/api/pembelian', payload, config)
                    .then((riss) => {
                      // res.send(riss.data);
                      // kalau pembarana berhasil
                      if (riss.data.msg === 'Payment Success') {
                        const todayDate = moment(new Date()).format('YYYY-MM-DD');
                        const todayTime = moment(new Date()).format('HH:mm:ss');
                        // console.log(req.uid, req.name, jumlah, todayDate, todayTime);
                        client.query(
                            "INSERT INTO history_pembelian(id_user, name, jumlah, waktu, tanggal, emoney, nama_barang) VALUES($1, $2, $3, $4, $5, 'egil', $6)",
                            [req.id_user, req.name, harga, todayTime, todayDate, req.body.nama_barang],
                        );
                        res.status(200);
                        return res.json({
                          status: 200,
                          message: 'Pembayaran dengan egil berhasil',
                        });
                        // lakukan query disini
                      }
                    })
                    .catch((error) => {
                      res.setHeader('Content-Type', 'application/json');
                      res.status(400);
                      return res.send(error.response.data);
                    });
                // res.cookie('harpay', ress.data.token);
                // return res.send(ress.data);
              })
              .catch((error) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(400);
                return res.send(error.response.data);
              });
            } else {
          res.status(400);
          return res.json({
            status: 400,
            message: 'Emoney tidak tersedia',
          });
        }
      };
    });

    // console.log('harga luar fungsi: ' + harga);
  } catch (error) {
    console.log(error);
    res.status(500);
    return res
        .json(
            {
              status: 500,
              message: 'Server error',
            },
        );
  }
});
// tampilkan histori bayar emoney
router.get('/api/history/pembelian', verifyToken, async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    client.query('SELECT * FROM history_pembelian WHERE id_user = $1', [req.id_user], (error, result) => {
      if (result.rowCount > 0) {
        res.status(200);
        res.json({
          status: 200,
          data: result.rows,
        });
      } else {
        res.status(200);
        return res.json({
          status: 200,
          message: 'Tidak ada history pembelian',
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    return res.json({
      status: 500,
      message: 'Server error',
    });
  }
});

// transfer
router.post('/api/transfer', verifyToken, async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const {tujuan, jumlah} = req.body;
    client.query('SELECT * FROM users WHERE id_user = $1', [tujuan], (error, result) => {
      // cek apakah pengguna ada
      if (result.rowCount <= 0) {
        res.status(400);
        return res.json({
          status: 400,
          message: 'wallet tujuan tidak ada',
        });
      } else {
        // cek apakah uang cukup
        if (req.saldo < jumlah) {
          res.status(400);
          return res.json({
            status: 400,
            message: 'Saldo tidak cukup',
          });
        } else {
          // kurangi uang pengguna
          client.query('UPDATE users SET saldo = saldo - $1 WHERE id_user = $2', [jumlah, req.id_user]);
          // tambah rekening tujuan
          client.query('UPDATE users SET saldo = saldo + $1 WHERE id_user = $2', [jumlah, tujuan]);
          // masukkan proses ke histori transfer
          const todayDate = moment(new Date()).format('YYYY-MM-DD');
          const todayTime = moment(new Date()).format('HH:mm:ss');
          client.query('INSERT INTO histori_transfer(asal, tujuan, jumlah, waktu, tanggal) VALUES($1, $2, $3, $4, $5)', [req.id_user, tujuan, jumlah, todayTime, todayDate], (error1, result1) => {
            if (result1.rowCount <= 0) {
              res.status(400);
              return res.json({
                status: 400,
                message: 'Gagal melakukan transfer',
              });
            } else {
              res.status(200);
              return res.json({
                status: 200,
                message: 'Berhasil melakukan transfer',
              });
            }
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    return res.json({
      status: 500,
      message: 'Server error',
    });
  }
});
// history transfer keluar
router.get('/api/history/transfer/out', verifyToken, async (req, res, next) => {
  try {
    client.query('SELECT * FROM histori_transfer WHERE asal = $1', [req.id_user], (error, result) => {
      if (result.rowCount <= 0) {
        res.status(200);
        return res.json({
          status: 200,
          message: 'tidak ada history transfer',
          data: [],
        });
      } else {
        res.status(200);
        return res.json({
          status: 200,
          data: result.rows,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    return res.json({
      status: 500,
      message: 'Server error',
    });
  }
});
// history transfer masuk
router.get('/api/history/transfer/in', verifyToken, async (req, res, next) => {
  try {
    client.query('SELECT * FROM histori_transfer WHERE tujuan = $1', [req.id_user], (error, result) => {
      if (result.rowCount <= 0) {
        res.status(200);
        return res.json({
          status: 200,
          message: 'Tidak ada history transfer',
          data: [],
        });
      } else {
        res.status(200);
        return res.json({
          status: 200,
          data: result.rows,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    return res.json({
      status: 500,
      message: 'Server error',
    });
  }
});

router.get('/api/item', async (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    client.query('SELECT nama_barang, harga, id_barang FROM barang', (error, result) => {
      if (result.rowCount > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        return res.json({
          status: 200,
          data: result.rows,
        });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        return res.json({
          status: 400,
          message: 'Tidak ada barang',
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .json(
            {
              status: 500,
              message: 'Server error',
            },
        );
  }
});

router.get('/api/item/pembelian/:id', (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {id} = req.params;
    client.query('SELECT nama_barang, harga, id_barang FROM barang WHERE id_barang = $1', [id_barang], (errror, result) => {
      if (result.rowCount > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        return res
            .json(
                {
                  status: 200,
                  data: result.rows[0],
                },
            );
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(400);
        return res
            .json(
                {
                  status: 400,
                  message: 'Barang tidak ditemukan',
                },
            );
      }
    });
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    return res
        .json(
            {
              status: 500,
              message: 'Server error',
            },
        );
  }
});
//end