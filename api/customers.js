const { connectToDatabase, client } = require("../db");

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        await connectToDatabase();
        // extract email from query
        let { email } = req.body;
        let result;

        if (!email) {
            res.status(200).json({
                image_url:"none"
            });
            return;
            // result = (await client.query('SELECT * FROM users')).rows;
            // console.log('Query result:', result);
        } else {
            result = (await client.query(`SELECT * FROM customers where email='${email}'`)).rows;
        }
        result = result[0];

        await client.end();
        // console.log('res:',result);
        if (!result || result.length === 0) {
            res.status(200).json({
             image_url:'No data found'
            });
        } else {
            // do  an intensive op
            let { image_url, ...rest } = result;
            const modified_image =  image_url + 'BLURRED';

            // Disconnect from the database
            await client.end();
            res.status(200).json({
                image_url:modified_image
            });
        }
    } else if (req.method === 'GET') {
        await connectToDatabase();
        // extract email from query
        let { email } = req.query;
        let result;

        if (!email) {
            res.status(200).json({
                image_url:"none"
            });
            return;
            // result = (await client.query('SELECT * FROM users')).rows;
            // console.log('Query result:', result);
        } else {
            result = (await client.query(`SELECT * FROM customers where email='${email}'`)).rows;
        }
        result = result[0];

        await client.end();
        // console.log('res:',result);
        if (!result || result.length === 0) {
            res.status(200).json({
             image_url:'No data found'
            });
        } else {
            // do  an intensive op
            let { image_url, ...rest } = result;
            const modified_image =  image_url + 'BLURRED';

            // Disconnect from the database
            await client.end();
            res.status(200).json({
                image_url:modified_image
            });
        }
    }
}