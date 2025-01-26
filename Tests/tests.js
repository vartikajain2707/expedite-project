const { getProduct,deleteProduct, createProduct, updateProduct } =require('../handler');
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const handler = {
    getProduct:(event)=>getProduct(event),
    createProduct:(event)=>createProduct(event),
    updateProduct:(event)=>updateProduct(event),
    deleteProduct:(event)=>deleteProduct(event)
};

// Helper function
function runTest(description, testFn) {
    try {
        testFn();
        console.log(`${description} passed`);
    } catch (error) {
        console.error(`${description} failed: ${error.message}`);
    }
}


//Test cases for createProduct
runTest('createProduct', async () => {
    const product = await handler.createProduct({
        productId: '124',
        name: 'Laptop',
        description: 'New Mac laptop with 16.5 inch screen',
        price: 1000,
        category: 'Electronics',
        stock: 100,
    });

    console.assert(product.productId === '124', 'productId should be 124');
    console.assert(product.name === 'Laptop', 'Name should be Laptop');
});


//Test cases for updateProduct
runTest('updateProduct', async () => {
    const product = await handler.updateProduct({
        productId: '124',
        updates: { price: 35.99 }
    });
    console.assert(product.error === false, 'No errors');
    console.assert(product.message === 'The Product has been updated', 'The Product has been updated');
});


//Test cases for getProduct
runTest('getProduct', async () => {
    const product = await handler.getProduct({ productId: '124' });
    console.log({})
    console.assert(product.productId === '124', 'Product id should 124');
    console.assert(product.name=== 'Laptop', 'Product is a Laptop');
});

//Test cases for deleteProduct
runTest('deleteProduct', async () => {
    const product = await handler.deleteProduct({ productId: '124' });
    console.assert(product.error === false, 'No errors');
    console.assert(product.message === 'The Product has been deleted', 'The Product has been deleted');
});