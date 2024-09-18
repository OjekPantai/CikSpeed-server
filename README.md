# CikSpeed API

CikSpeed adalah sebuah aplikasi manajemen antrian servis sepeda motor yang menyediakan API untuk mengelola dan memantau layanan servis sepeda motor. API ini memungkinkan pengguna untuk membuat, membaca, memperbarui, dan menghapus pesanan layanan servis. Selain itu, API ini juga menyediakan fungsionalitas untuk mengelola pengguna dan layanan.

## Fitur API

### 1. **Order Management**

- **Create Order**: Menambahkan pesanan baru.
- **Get All Orders**: Mengambil daftar semua pesanan.
- **Get Order by ID**: Mengambil detail pesanan berdasarkan ID.
- **Update Order Status**: Memperbarui status pesanan.
- **Delete Order**: Menghapus pesanan berdasarkan ID.

### 2. **User Management**

- **Current User Orders**: Mengambil daftar pesanan untuk pengguna yang sedang login.

### 3. **Service Management**

- **Get All Services**: Mengambil daftar semua layanan yang tersedia.
- **Get Service by ID**: Mengambil detail layanan berdasarkan ID.

## Endpoint API

### **Create Order**

- **URL**: `/api/orders`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "motorcycleType": "Yamaha R15",
    "phone": "08123456789",
    "complaintMessage": "Engine noise is loud",
    "address": "Jl. Mawar No.10, Jakarta",
    "services": ["66eb133a3c1edb46f47cf39a", "66eb0acfd847ac5b0e29d745"]
  }
  ```

API DOCUMENTATION = https://documenter.getpostman.com/view/20262290/2sAXqs5gcE
