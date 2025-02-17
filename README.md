# **To-Do List Backend**

### **A simple backend for a To-Do List application**  

## **⚡ Features**  
- ✅ User Authentication (JWT)  
- ✅ Create, Read, Update, and Delete (CRUD) tasks  
- ✅ MongoDB for persistent storage  
- ✅ RESTful API using Express.js  
- ✅ Error handling and validation
- ✅ Email Notification

## **🛠 Tech Stack**  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT
- **Notification:** Nodemailer, node-cron 

## **🚀 Installation & Setup**  

### **1. Clone the repository**  
```sh
git clone https://github.com/yasharyasaxena/To-Do.git
cd To-Do/backend
```

### **2. Install dependencies**  
```sh
npm install
```

### **3. Set up environment variables**  
Create a `.env` file in the root and add:  
```env
PORT=your_port_number
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### **4. Run the development server**  
```sh
npm run dev
```

## **📌 API Routes**  
| Method | Route | Description |
|--------|-------|-------------|
| **POST** | `/register` | Register a new user |
| **POST** | `/login` | User login |
| **GET** | `/tasks` | Get all tasks |
| **POST** | `/tasks` | Create a new task |
| **PUT** | `/tasks/:id` | Update a task |
| **DELETE** | `/tasks/:id` | Delete a task |

## **📧 Contact & Acknowledgments**  
- **Yash Arya Saxena** – [LinkedIn](https://www.linkedin.com/in/yash-arya-saxena-834021331) 
