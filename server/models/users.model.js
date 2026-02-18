import pool from "../config/db.config.js";

export const getUserByIdentifier = async (identifier) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $1",
      [identifier],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error getting user by identifier:", error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error getting user by id:", error);
    throw error;
  }
};

export const storeNewUser = async (user) => {
  const identifier = user.role === "landlord" ? "email" : "username";
  const status = user.role === "landlord" ? "active" : "pending";
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //store user. status for tenant is set to pending since tenants need to set their password
    const result = await client.query(
      `INSERT INTO users (${identifier}, hashed_password, user_role, status)
         VALUES ($1, $2, $3, $4) RETURNING user_id`,
      [user.identifier, user.hashedPassword, user.role, status],
    );
    const newUserId = result.rows[0].user_id;

    //then, store user based on role
    if (user.role === "landlord") {
      await client.query("INSERT INTO landlord (user_id) VALUES ($1)", [
        newUserId,
      ]);
    } else if (user.role === "tenant") {
      await client.query(
        "INSERT INTO tenant (user_id, first_name, last_name) VALUES ($1, $2, $3)",
        [newUserId, user.firstName, user.lastName],
      );
    }

    await client.query("COMMIT");

    return newUserId;
  } catch (error) {
    console.error("Error in storeNewLandlord function:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateUserPassword = async (id, hashedPassword) => {
  try {
    await pool.query(
      "UPDATE users SET hashed_password = $1, status = 'active' WHERE user_id = $2",
      [hashedPassword, id],
    );
  } catch (error) {
    console.error("Error in updateUserPassword function:", error);
    throw error;
  }
};
