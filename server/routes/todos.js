const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');
const router = express.Router();


router.use(auth);


router.get('/', async (req, res) => {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
});


router.post('/', async (req, res) => {
    const todo = new Todo({ ...req.body, user: req.user._id });
    await todo.save();
    res.json(todo);
}); 



router.delete('/:id', async (req, res) => {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Deleted' });
});

module.exports = router;
