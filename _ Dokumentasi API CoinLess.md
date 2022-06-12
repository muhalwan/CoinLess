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

## Base URL

`https://coinless.herokuapp.com/`
Method | End-Point | Autorisasi | Deskripsi
--- | --- | --- | ---
`GET` | /api/profile | YES | Mendapatkan data profil seorang user. jika yang mengakses adalah admin, maka mengakses semua data profil user
`POST` | /api/profile | NO | Register akun
`POST` | /api/login | NO | Login Akun
`GET`  | /api/profile | YES | Lihat Profil
`PUT` |  /api/profile/:id | YES | Top up ke user

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
  "user_id": "j3TxKjlwuBNU2TMw",
  "name": "usertester",
  "pass": "usertester",
  "email": "tester@coinless.com",
  "jumlah": "10000.00"
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

