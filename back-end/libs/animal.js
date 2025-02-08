const mysql = require("mysql");

module.exports = {
  getProfile: async (pool) => {
    let sql = "SELECT * FROM profile";
    return await pool.query(sql);
  },
  addProfile: async (pool, animal) => {
    let sql = `
      INSERT INTO profile (image, name, lastname, birthmark, description, birthday, gender, animal_type, address_id, owner_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await pool.query(sql, [
      animal.image,
      animal.name,
      animal.lastname,
      animal.description,
      animal.birthday,
      animal.gender,
      animal.birthmark,
      animal.animal_type,
      animal.address_id,
      animal.owner_id,
    ]);
  },
  deleteProfile: async (pool, id) => {
    let sql = "DELETE FROM profile WHERE id = ?";
    return await pool.query(sql, [id]);
  },
  updateProfile: async (pool, animal) => {
    let sql = `
        UPDATE profile
        SET image = ?, name = ?, lastname = ?, description = ?, birthday = ?, gender = ?, birthmark = ?,
            animal_type = ?, address_id = ?, owner_id = ?
        WHERE id = ?
    `;
    return await pool.query(sql, [
      animal.image,
      animal.name,
      animal.lastname,
      animal.description,
      animal.birthday,
      animal.gender,
      animal.birthmark,
      animal.animal_type,
      animal.address_id,
      animal.owner_id,
      animal.id,
    ]);
  },
};
