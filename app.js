const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');


const app = express();

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static('public'));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Route to fetch images for a specific category
app.get('/category/:type', (req, res) => {
    const category = req.params.type; // e.g., dresses, tops, pants, accessories
    const categoryPath = path.join(__dirname, 'public/images', category);

    // Check if the folder exists
    if (!fs.existsSync(categoryPath)) {
        return res.status(404).send('Category not found');
    }

    // Read all image files from the folder
    fs.readdir(categoryPath, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading category folder');
        }

        // Filter only image files (e.g., .jpg, .png)
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        // Send the list of image URLs
        const imageUrls = images.map(file => `/images/${category}/${file}`);
        res.json(imageUrls);
    });
});

// Routes for categories
app.get('/dresses', (req, res) => {
    res.render('dresses');
});

app.get('/tops', (req, res) => {
    res.render('tops');
});

app.get('/pants', (req, res) => {
    res.render('pants');
});

app.get('/accessories', (req, res) => {
    res.render('accessories');
});


const user = {
    name: "John Doe",
    email: "john@example.com",
    age: 25,
    bio: "Web developer and tech enthusiast.",
    avatar: "https://i.pravatar.cc/150?img=3"
};

// Route to profile page
app.get('/profile', (req, res) => {
    res.render('profile', { user });
});



// Route to orders page
app.get('/orders', (req, res) => {
    res.render('orders', { orders });
});

// Mock orders data
const orders = [
    {
        id: 101,
        item: "tshirt",
        date: "2025-04-01",
        amount: "$99.99",
        status: "Shipped"
    },
    {
        id: 102,
        item: "pants",
        date: "2025-04-10",
        amount: "$149.00",
        status: "Processing"
    },
    {
        id: 103,
        item: "Dresses",
        date: "2025-04-20",
        amount: "$39.99",
        status: "Delivered"
    }
];


// Route to wishlist page
app.get('/wishlist', (req, res) => {
    res.render('wishlist', { wishlist });
});

// Mock wishlist data
const wishlist = [
    {
        id: 201,
        item: "Noise Cancelling Headphones",
        price: "$129.99",
        image: "https://via.placeholder.com/100",
    },
    {
        id: 202,
        item: "Gaming Mouse",
        price: "$49.99",
        image: "https://via.placeholder.com/100",
    },
    {
        id: 203,
        item: "4K Monitor",
        price: "$299.99",
        image: "https://via.placeholder.com/100",
    }
];


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Upload route
app.post('/upload-selfie', upload.single('selfie'), (req, res) => {
    const imagePath = `/uploads/${req.file.filename}`;
    res.redirect(`/virtual-try-on?image=${encodeURIComponent(imagePath)}`);
});

// Virtual Try-On route
app.get('/virtual-try-on', (req, res) => {
    const imagePath = req.query.image;
    res.render('virtual-try-on', { imagePath });
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
