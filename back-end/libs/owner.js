const mysql = require("mysql");

module.exports = {

    getOwner: async (pool) => {
        let sql = "SELECT * FROM owner";
        return await pool.query(sql);
    },

};