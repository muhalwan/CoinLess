# Dokumentasi API CoinLess

## Anggota Kelompok 12 - Pemrograman Integreatif A

1. Gde Rio Aryaputra Rahadi (5027201063)
2. Muhammad Alwan (5027201019)
3. Muhammad Hanif Fatihurrizqi (5027201068)

> note: bila ada masalah, bisa pc alwan di line/discord

## Fitur-Fitur Utama CoinLess

- Register
- Login
- Topup
- Pembayaran
- Transfer

## Base URL

`https://coinless.herokuapp.com/`
Method | End-Point | Autorisasi | Deskripsi
--- | --- | --- | ---
`GET` | /api/profile | YES | Mendapatkan data profil seorang user. jika yang mengakses adalah admin, maka mengakses semua data profil user
`POST` | /api/profile | NO | Register akun
`POST` | /api/login | NO | Login Akun
`GET`  | /api/profile | YES | Lihat Profil
`PUT` |  /api/profile/:id | YES | Top up ke user
`GET` | /api/history/topup | YES | Melihat history topup
`PUT` | /api/pembelian | YES | Melakukan pembayaran barang
`POST` | /api/pembelian | YES | Pembayaran dengan ewallet coinless
`POST` | /api/transaksi | YES | Pembayaran dengan ewallet lain
`GET` | /api/history/pembelian | YES | Melihat history pembelian
`POST` | /api/transfer | YES | Transfer antar user
`GET` | /api/item | NO | Melihat barang yang dijual

## Demonstrasi Penggunaan Endpoint

### Menampilkan profil user

Contoh

```
GET https://coinless.herokuapp.com/api/profile
Authorization: bearer token

```

Hasil

```json
{
    "id_user": "iFGiTRKzfWnQ5rHw",
    "name": "usertester",
    "pass": "usertester",
    "email": "tester@coinless.com",
    "saldo": "0.00",
    "nomor_wallet": "p9gyw3zMG15nZV89"
}
```

### Registrasi

Contoh

```
POST https://coinless.herokuapp.com/api/profile
Authorization: -

{
  "name": "usertester",
  "email": "tester@coinless.com",
  "pass": "usertester"
}
```

Hasil

```json
{
  status: 200,
  message: 'Pendaftaran Berhasil',
},
```

### Login

Contoh

```
POST https://coinless.herokuapp.com/api/login
Authorization: -

{
    "email": "tester@coinless.com",
    "pass": "usertester"
}
```

Hasil

```json
{
  status: 200,
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlcnRlc3RlciIsImVtYWlsIjoidGVzdGVyQGNvaW5sZXNzLmNvbSIsInJvbGUiOiJ1c2VyIiwic2FsZG8iOiIxMDAwMC4wMCIsInVzZXJfaWQiOiJqM1R4S2psd3VCTlUyVE13IiwiaWF0IjoxNjU0Nzc3NjkyLCJleHAiOjE2NTQ4NjQwOTJ9.GApdPB5bl_EVJNtC8Y1Eo-7hyMWuvWPN5abb5-osMe0"
}
```

### Top up User

Contoh

```
PUT https://coinless.herokuapp.com/api/profile/:id
Authorization: Bearer Token

{
  "jumlah": 1000000
}
```

Hasil

```json
{
  status: 200,
  message: 'Top up berhasil',
}
```


### History Topup

Contoh

```
GET https://coinless.herokuapp.com/api/profile/:id
Authorization: Bearer Token
```

Hasil

```json
{
    "status": 200,
    "data": [
        {
            "id_user": "iFGiTRKzfWnQ5rHw",
            "name": "usertester",
            "jumlah": "1000000.00",
            "tanggal": "2022-06-12T00:00:00.000Z",
            "keterangan": "Top up"
        }
    ]
}
```

### Pembelian

Contoh

```
PUT https://coinless.herokuapp.com/api/pembelian
Authorization: Bearer Token

{
    "jumlah": "420000",
    "id_user": "jEDk2o3M7FFlkPmq",
    "nama_barang": "BLACK MEN'S WATCH"
}
```

Hasil

```json
{
    "status": 200,
    "message": "Pembayaran berhasil"
}
```

### Pembelian Dengan Ewallet lain

Contoh

```
PUT https://coinless.herokuapp.com/api/transaksi
Authorization: Bearer Token

{
    "wallet": "otakupay",
    "id_barang": "1",
    "nama_barang": "BLACK MEN'S WATCH",
    "harga": "420000"
}
```

Hasil

```json
{
    "status": 200,
    "message": "Pembayaran dengan otakupay berhasil"
}
```

### History Pembelian

Contoh

```
GET https://coinless.herokuapp.com/api/history/pembelian
Authorization: Bearer Token
```

Hasil

```json
{
    "id": 16,
    "id_user": "jEDk2o3M7FFlkPmq",
    "name": "user1",
    "jumlah": "69000.00",
    "waktu": "21:33:01",
    "tanggal": "2022-06-13T00:00:00.000Z",
    "emoney": "CoinLess",
    "nama_barang": "BLACK MEN'S WATCH"
}
```

### Transfer

Contoh

```
POST https://coinless.herokuapp.com/api/transfer
Authorization: Bearer Token

{
    "jumlah": "100000",
    "tujuan": "jEDk2o3M7FFlkPmq"
}
```

Hasil

```json
{
    "status": 200,
    "message": "Berhasil melakukan transfer"
}
```

### Barang

Contoh

```
GET https://coinless.herokuapp.com/api/item
Authorization: Bearer Token
```

Hasil

```json
{
    "status": 200,
    "data": [
        {
            "nama_barang": "BLACK MEN'S WATCH",
            "harga": "69000.00",
            "id_barang": 1
        },
        {
            "nama_barang": "BLACK SNEAKZ",
            "harga": "420000.00",
            "id_barang": 2
        }
    ]
}
```