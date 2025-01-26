const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.getProduct = async (event) => {
    const { productId } = event;
    const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Key: { productId },
    };
    try {
        const result = await dynamoDB.get(params).promise();
        return result.Item;
    } catch (error) {
        console.error(error);
        throw new Error('Could not fetch product');
    }
};

module.exports.createProduct = async (event) => {
    const { productId, name, description, price, category, stock } = event;

    const params = {
        TableName: process.env.PRODUCTS_TABLE,
        Item: {
            productId,
            name,
            description,
            price,
            category,
            stock,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    };

    try {
        await dynamoDB.put(params).promise();
        return params.Item;
    } catch (error) {
        console.error(error);
        throw new Error('Could not create product');
    }
};


module.exports.updateProduct = async (event) => {
        try {
            const { productId, updates } = event

            if (!productId) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Product ID is required" }),
                };
            }
            let updateExpression = "set";
            const expressionAttributeNames = {};
            const expressionAttributeValues = {};

            Object.keys(updates).forEach((key, index) => {
                const attributeName = `#${key}`;
                const attributeValue = `:${key}`;

                updateExpression += ` ${attributeName} = ${attributeValue}`;
                if (index !== Object.keys(updates).length - 1) {
                    updateExpression += ","; // Add comma unless it's the last key
                }

                expressionAttributeNames[attributeName] = key;
                expressionAttributeValues[attributeValue] = updates[key];
            });

            const params = {
                TableName: process.env.PRODUCTS_TABLE,
                Key: { productId },
                UpdateExpression: updateExpression,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues
            };

            await dynamoDB.update(params).promise();

            return {
                error: false,
                message: 'The Product has been updated'
            };
        } catch (error) {
            console.error("Error updating product:", error);
            return {
                error: true,
                message: `The Product has not been updated, please check the error, ${error.message}`
            };
        }
};


module.exports.deleteProduct = async (event) =>{
        try {
            const { productId } = event
            const params = {
                TableName: process.env.PRODUCTS_TABLE,
                Key: { productId },
            };
            await dynamoDB.delete(params).promise();
            return {
                error: false,
                message: 'The Product has been deleted'
            };
        } catch (error) {
            console.error("Error deleting product:", error);
            return {
                error: true,
                message: error.message
            };
        }
}