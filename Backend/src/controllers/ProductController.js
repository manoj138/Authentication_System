const Product = require('../modals/ProductModel');
const User = require('../modals/AuthModel');
const { handle200, handle201, handle204 } = require('../helper/successHandler');
const { handle404, handle500, formatSequelizeError } = require('../helper/errorHandler');

// Get all products (Admin sees all, User sees only their own)
exports.getAllProducts = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        let queryOptions = {
            order: [['createdAt', 'DESC']],
            include: [{ model: User, attributes: ['username', 'email'] }]
        };

        if (role !== 'admin') {
            queryOptions.where = { userId };
        }

        const products = await Product.findAll(queryOptions);
        return handle200(res, products, "Products retrieved successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

// Get product stats
exports.getProductStats = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        const totalProducts = await Product.count();
        const userProducts = await Product.count({ where: { userId } });
        
        return handle200(res, { 
            totalProducts, 
            userProducts,
            isAdmin: role === 'admin'
        }, "Product stats retrieved successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, id: userId } = req.user;
        
        const product = await Product.findByPk(id, {
            include: [{ model: User, attributes: ['username', 'email'] }]
        });

        if (!product) {
            return handle404(res, "Product not found");
        }

        // Check ownership if not admin
        if (role !== 'admin' && product.userId !== userId) {
            return res.status(403).json({ status: false, message: "Unauthorized access to this product" });
        }

        return handle200(res, product, "Product details retrieved successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const userId = req.user.id;

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            userId
        });
        return handle201(res, newProduct, "Product added successfully");
    } catch (error) {
        if (error.name.startsWith('Sequelize')) {
            return formatSequelizeError(res, error);
        }
        return handle500(res, error);
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;
        const { role, id: userId } = req.user;

        const product = await Product.findByPk(id);
        if (!product) {
            return handle404(res, "Product not found");
        }

        // Check ownership if not admin
        if (role !== 'admin' && product.userId !== userId) {
            return res.status(403).json({ status: false, message: "Unauthorized to update this product" });
        }

        await product.update({
            name,
            description,
            price,
            category
        });

        return handle200(res, product, "Product updated successfully");
    } catch (error) {
        if (error.name.startsWith('Sequelize')) {
            return formatSequelizeError(res, error);
        }
        return handle500(res, error);
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, id: userId } = req.user;

        const product = await Product.findByPk(id);
        if (!product) {
            return handle404(res, "Product not found");
        }

        // Check ownership if not admin
        if (role !== 'admin' && product.userId !== userId) {
            return res.status(403).json({ status: false, message: "Unauthorized to delete this product" });
        }

        await product.destroy();
        return handle204(res, "Product removed successfully");
    } catch (error) {
        return handle500(res, error);
    }
};
