const mysql = require("mysql");

module.exports = {

    getAdress : async (pool) => {
        let sql = "SELECT * FROM address";
        return await pool.query(sql);
    },

};