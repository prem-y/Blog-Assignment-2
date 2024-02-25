const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const mongoose = require('mongoose');

router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const blogs = await Blog.find({ title: { $regex: query, $options: 'i' } });
    res.json(blogs);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newBlog = new Blog({ title, content, category });
    await newBlog.save();
    res.json({ message: 'Blog created successfully' });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content, category } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, content, category },
      { new: true }
    );
    res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    res.json(deletedBlog);
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/get/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/blog-details/:blogId', async (req, res) => {
    try {
        const blogId = new mongoose.Types.ObjectId(req.params.blogId);

        const blogDetails = await Blog.aggregate([
            { $match: { _id: blogId } },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'blogId',
                    as: 'reviews',
                },
            },
            {
                $addFields: {
                    totalReviews: { $size: '$reviews' },
                    averageRating: { $avg: '$reviews.rating' },
                },
            },
        ]);

        res.json(blogDetails);
    } catch (error) {
        console.error('Error fetching blog details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
router.post('/subscribe/:userId/:blogId', async (req, res) => {
  try {
    const { userId, blogId } = req.params;
    await User.findByIdAndUpdate(userId, { $addToSet: { subscriptions: blogId } });
    await Blog.findByIdAndUpdate(blogId, { $addToSet: { subscribers: userId } });
    res.json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Error subscribing user to blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/performance-analysis', async (req, res) => {
  try {
    const result = await Blog.find().explain('executionStats');
    res.json(result);
  } catch (error) {
    console.error('Error performing analysis:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//not working
router.get('/shard-analysis', async (req, res) => {
    try {
      const result = await Blog.find().hint({ _id: 'hashed' }).explain('executionStats');
      res.json(result);
    } catch (error) {
      console.error('Error performing shard analysis:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

const blogCache = {};

router.get('/cached-blog/:blogId', async (req, res) => {
  try {
    const blogId = req.params.blogId;

    if (blogCache[blogId]) {
      res.json(blogCache[blogId]);
    } else {
      const blog = await Blog.findById(blogId);
      blogCache[blogId] = blog;
      res.json(blog);
    }
  } catch (error) {
    console.error('Error fetching blog with caching:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
