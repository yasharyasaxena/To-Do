require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const { userSchema } = require('./models/user')
const { taskSchema } = require('./models/task')
const { genPassword, validPassword, genToken, connectDB } = require('./utils/utils');
const { sendMail } = require('./utils/sendMail');
const cron = require('node-cron');

const JWTVerify = (req, res, next) => {
    const token = req.header('auth-token')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

connectDB();

const Tasks = mongoose.model('Tasks', taskSchema);
const Users = mongoose.model('Users', userSchema);

cron.schedule('30 */1 * * *', async () => {
    const tasks = await Tasks.find({ status: 'Pending' });
    tasks.forEach(async task => {
        const dueDate = new Date(task.dueDate);
        let currdate = new Date(Date.now())
        console.log(dueDate.toISOString(), currdate.toISOString());
        if (dueDate <= currdate.setHours(currdate.getHours() + 1)) {
            const subject = 'Task Reminder';
            const text = `Task: ${task.title} is due in 1 hour`;
            const user = await Users.findById(task.author);
            const sent = await sendMail(user.email, subject, text);
            if (sent) {
                console.log('Email sent to:', user.email);
            }
            else {
                console.log('Email failed to send to:', user.email);
            }
        }
    })
});

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app
    .post("/register", async (req, res) => {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please enter all fields'
            })
        }

        const user = await Users.findOne({ email: email })

        if (!user) {
            await Users.create({
                name,
                email,
                ...genPassword(password)
            })
            return res.status(201).json({
                message: 'User created successfully',
            })
        }
        else {
            return res.status(409).json({
                message: 'User already exists',
                user: user
            })
        }
    })

app
    .route("/login")
    .post(async (req, res) => {
        const email = req.body.email
        const password = req.body.password

        if (!email || !password) {
            return res.status(400).json({
                message: 'Please enter all fields'
            })
        }

        const user = await Users.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        else if (!validPassword(password, user.hash, user.salt)) {
            return res.status(401).json({
                message: 'Incorrect password'
            })
        }
        else if (validPassword(password, user.hash, user.salt)) {
            return res.status(200).json({
                message: 'Login successful',
                token: genToken({ id: user._id }, process.env.JWT_SECRET),
            })
        }
    })

app
    .route('/tasks')
    .get(async (req, res) => {
        try {
            const tasks = await Tasks.find();
            res.status(200).json(tasks);
        } catch (err) {
            res.status(400).json({ message: err });
        }
    })
    .post(JWTVerify, async (req, res) => {
        if (!req.body.title || !req.body.dueDate) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        if (new Date(req.body.dueDate) < new Date(Date.now())) {
            return res.status(400).json({ message: 'Due date should be in the future' });
        }
        const task = new Tasks({
            title: req.body.title,
            author: req.user.id,
            description: req.body.description,
            dueDate: req.body.dueDate,
            status: req.body.status ? req.body.status : 'Pending'
        });

        try {
            const savedTask = await task.save();
            res.status(201).json(savedTask);
        } catch (err) {
            res.status(400).json({ message: err });
        }
    })

app
    .route('/tasks/:id')
    .get(async (req, res) => {
        try {
            const task = await Tasks.findById(req.params.id);
            res.status(200).json(task);
        } catch (err) {
            res.status(400).json({ message: err });
        }
    })
    .put(JWTVerify, async (req, res) => {
        try {
            const updatedTask = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(updatedTask);
        } catch (err) {
            res.status(400).json({ message: err });
        }
    })
    .delete(JWTVerify, async (req, res) => {
        try {
            const deletedTask = await Tasks.findByIdAndDelete(req.params.id);
            res.status(200).json(deletedTask);
        } catch (err) {
            res.status(400).json({ message: err });
        }
    })

app
    .route('/author/tasks')
    .get(JWTVerify, async (req, res) => {
        try {
            const tasks = await Tasks.find({ author: req.user.id });
            res.status(200).json(tasks);
        } catch (err) {
            res.status(400).json({ message: err });
        }
    })


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
