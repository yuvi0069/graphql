"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApplicationById = exports.deletePropertybyId = exports.getFilterResponseByTenant = exports.updatePropertyById = exports.getPropertybyLandlordUuid = exports.getPropertybyId = exports.getTenantDetails = exports.getTenantbyUuid = exports.getLandlordbyUuid = exports.insertPropertyDetails = exports.updateTentantDetails = exports.getLandlordDetails = exports.updateRoleDetails = exports.deleteUnverifiedUser = exports.updateUserverifiedEmailByUserId = exports.updateUserStatusByUserId = exports.updateUserDetailsByUserId = exports.updatePasswordByUserUuid = exports.getUserByUserId = exports.updateOtpByUserId = exports.checkUserByEmail = exports.getUserClubIdByName = exports.getUserRoleIdByName = exports.updateUserDataByUserId = exports.getUserByEmail = void 0;
exports.insertUser = insertUser;
const pool_1 = require("../../db/pool");
const uuid_1 = require("uuid");
const getUserByEmail = async (email) => {
    try {
        const query = "SELECT * FROM users WHERE email = $1";
        const values = [email];
        const result = await pool_1.pool.query(query, values);
        if (result.rowCount === 0) {
            return {
                code: 0,
                error: 'User not found'
            };
        }
        return result.rows[0];
    }
    catch (error) {
        return { error: error, message: "Internal Server Error", code: 0 };
    }
};
exports.getUserByEmail = getUserByEmail;
const updateUserDataByUserId = async (uuid, jwtToken) => {
    try {
        const query = "UPDATE users SET user_token = $1,last_login_date=now() WHERE uuid = $2 returning *";
        const values = [jwtToken, uuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error("User not found");
        }
        return result.rows[0];
    }
    catch (error) {
        return { error: error, message: "Internal Server Error", code: 0 };
    }
};
exports.updateUserDataByUserId = updateUserDataByUserId;
async function insertUser(data, otp, encryptPassword, roleId) {
    const sql = `insert into users (uuid, first_name, last_name, email, password, mobile, status, role_id, otp,verified_email)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)
      returning *`;
    const values = [
        (0, uuid_1.v4)(),
        data.firstName,
        data.lastName,
        data.email.toLowerCase().trim(),
        encryptPassword,
        data.mobileNo,
        "ACTIVE",
        roleId,
        otp,
        false
    ];
    const { rows } = await pool_1.pool.query(sql, values);
    return rows[0];
}
const getUserRoleIdByName = async (roleName) => {
    try {
        const query = "SELECT id FROM roles WHERE role_name = $1";
        const values = [roleName];
        const result = await pool_1.pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error("No role found");
        }
        return result.rows[0].id;
    }
    catch (error) {
        return { error: error, message: "Internal Server Error", code: 0 };
    }
};
exports.getUserRoleIdByName = getUserRoleIdByName;
const getUserClubIdByName = async (clubName) => {
    try {
        const query = "SELECT id FROM clubs WHERE club_name = $1";
        const values = [clubName];
        const result = await pool_1.pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error("No club found");
        }
        return result.rows[0].id;
    }
    catch (error) {
        return { error: error, message: "Internal Server Error", code: 0 };
    }
};
exports.getUserClubIdByName = getUserClubIdByName;
const checkUserByEmail = async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await pool_1.pool.query(query, values);
    if (result.rowCount === 0) {
        return [];
    }
    return result.rows;
};
exports.checkUserByEmail = checkUserByEmail;
const updateOtpByUserId = async (userUuid, otp) => {
    try {
        const query = "UPDATE users SET otp = $1 WHERE uuid = $2 RETURNING *";
        const values = [otp, userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: "User not found",
                code: 404,
            };
        }
        return {
            message: "User updated successfully!",
            code: 1,
            data: result.rows[0],
        };
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.updateOtpByUserId = updateOtpByUserId;
const getUserByUserId = async (userUuid) => {
    try {
        const query = "SELECT * FROM users WHERE uuid = $1";
        const values = [userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rowCount === 0) {
            return {
                error: `no user found`,
                code: 0
            };
        }
        return result.rows[0];
    }
    catch (error) {
        return { error: error, message: "Internal Server Error", code: 0 };
    }
};
exports.getUserByUserId = getUserByUserId;
const updatePasswordByUserUuid = async (userUuid, password) => {
    try {
        const query = "UPDATE users SET password = $1 WHERE uuid = $2 RETURNING *";
        const values = [password, userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: "User not found",
                code: 404,
            };
        }
        return {
            message: "User updated successfully!",
            code: 1,
            data: result.rows[0],
        };
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.updatePasswordByUserUuid = updatePasswordByUserUuid;
const updateUserDetailsByUserId = async (userUuid, data) => {
    try {
        const query = "UPDATE users SET first_name = $1, last_name = $2,  mobile = $3 WHERE uuid = $4 RETURNING *";
        const values = [data.firstName, data.lastName, data.mobile, userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: "User not found",
                code: 404,
            };
        }
        return {
            message: "User updated successfully!",
            code: 1,
            data: result.rows[0],
        };
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.updateUserDetailsByUserId = updateUserDetailsByUserId;
const updateUserStatusByUserId = async (userUuid, data) => {
    try {
        const query = "UPDATE users SET status = $1 WHERE uuid = $2 RETURNING *";
        const values = [data, userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: "User not found",
                code: 404,
            };
        }
        return {
            message: "status updated successfully!",
            code: 1,
            data: result.rows[0],
        };
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.updateUserStatusByUserId = updateUserStatusByUserId;
const updateUserverifiedEmailByUserId = async (userUuid, data) => {
    try {
        const query = `UPDATE users set otp=$1,verified_email=$2 where uuid=$3`;
        const values = [null, data, userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: "User not found",
                code: 404,
            };
        }
        // const query2=`update users set otp=$2 where uuid=$1`
        // const value2=[userUuid,null];
        // const rsult=await pool.query(query2,value2);
        // console.log(rsult)
        return {
            message: "verified email successfully!",
            code: 1,
            data: result.rows[0],
        };
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.updateUserverifiedEmailByUserId = updateUserverifiedEmailByUserId;
const deleteUnverifiedUser = async (userUuid) => {
    try {
        const query = `delete from users where uuid=$1`;
        const values = [userUuid];
        await pool_1.pool.query(query, values);
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.deleteUnverifiedUser = deleteUnverifiedUser;
const updateRoleDetails = async (userUuid, name, role_id) => {
    try {
        if (role_id === 2) {
            const query = `Insert into landlords(userid,name) values($1,$2) returning *`;
            const values = [userUuid, name];
            const result = await pool_1.pool.query(query, values);
            if (result.rows.length === 0) {
                return {
                    error: "User not inserted",
                    code: 404,
                };
            }
            else {
                return {
                    data: result.rows
                };
            }
        }
        if (role_id == 3) {
            const query = `Insert into tenant(userid,name) values($1,$2) returning *`;
            const values = [userUuid, name];
            const result = await pool_1.pool.query(query, values);
            if (result.rows.length === 0) {
                return {
                    error: "User not found",
                    code: 404,
                };
            }
            else {
                return {
                    data: result.rows
                };
            }
        }
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.updateRoleDetails = updateRoleDetails;
const getLandlordDetails = async () => {
    try {
        const query = `select userid,name,email,mobile,JSON_AGG(jsonb_build_object('property_id', COALESCE(propertydetails.id, NULL))) AS properties from landlords join users on landlords.userid=users.uuid left join propertydetails on landlords.userid=propertydetails.landlordid GROUP BY landlords.userid,name,email,mobile;`;
        const result = await pool_1.pool.query(query);
        if (result.rows.length === 0) {
            return {
                error: "No landlords",
                code: 404,
            };
        }
        else {
            return {
                data: result.rows
            };
        }
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.getLandlordDetails = getLandlordDetails;
const updateTentantDetails = async (data) => {
    try {
        const query = `UPDATE tenant 
      SET state = $1, 
          city = $2, 
          country = $3, 
          zipcode = $4, 
          idnumber = $5, 
          iddocs = $6 
      WHERE userid = $7 
      RETURNING *`;
        const values = [data.state, data.city, data.country, data.zipcode, data.idnumber, data.iddocs, data.userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: "User not found",
                code: 404,
            };
        }
        else {
            return {
                data: result.rows
            };
        }
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.updateTentantDetails = updateTentantDetails;
const insertPropertyDetails = async (userid, data) => {
    try {
        const query = `INSERT INTO propertydetails(
	landlordid,propertyname, address, state, city, country,type, zipcode, number_of_rooms, surfacearea, rentprice, "securityDeposit", "rentalIncrement", rentfrequency,availablefrom,latefees,leaseduration,status,constructionyear,additionalcomments,images)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14,$15,$16,$17,$18,$19,$20,$21) returning *;`;
        const values = [userid, data.propertyname, data.address, data.state, data.city, data.country, data.type, data.zipcode, data.number_of_rooms, data.surfacearea, data.rentprice, data.securityDeposit, data.rentalIncrement, data.rentfrequency, data.availablefrom, data.latefees, data.leaseduration, 'Available', data.constructionyear, data.additionalcomments, data.imageUrls];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: "Property not updated found",
                code: 404,
            };
        }
        else {
            return {
                data: result.rows[0]
            };
        }
    }
    catch (error) {
        console.error("Error updating user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.insertPropertyDetails = insertPropertyDetails;
const getLandlordbyUuid = async (userUuid) => {
    try {
        const query = `select userid,name,email,mobile,JSON_AGG(jsonb_build_object('property_id', COALESCE(propertydetails.id, NULL))) AS properties from landlords join users on landlords.userid=users.uuid left join propertydetails on landlords.userid=propertydetails.landlordid where landlords.userid=$1 GROUP BY landlords.userid,name,email,mobile;`;
        const values = [userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: `landlord not found`,
                code: 0
            };
        }
        else {
            return {
                data: result.rows[0]
            };
        }
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.getLandlordbyUuid = getLandlordbyUuid;
const getTenantbyUuid = async (userUuid) => {
    try {
        const query = `select userid,name,email,mobile,state,city,country,zipcode,idnumber,iddocs,idverified from tenant join users on tenant.userid=users.uuid where userid=$1`;
        const values = [userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: `tenant not found`,
                code: 0
            };
        }
        else {
            return {
                data: result.rows[0]
            };
        }
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.getTenantbyUuid = getTenantbyUuid;
const getTenantDetails = async () => {
    try {
        const query = `select userid,name,email,mobile,state,city,country,zipcode from tenant join users on tenant.userid=users.uuid`;
        const result = await pool_1.pool.query(query);
        if (result.rows.length === 0) {
            return {
                error: `tenant not found`,
                code: 0
            };
        }
        else {
            return {
                data: result.rows
            };
        }
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.getTenantDetails = getTenantDetails;
const getPropertybyId = async (id) => {
    try {
        const query = `select concat(first_name,' ',last_name) as ownername,email,mobile,propertydetails.* from propertydetails join users on propertydetails.landlordid=users.uuid where propertydetails.id=$1;`;
        const values = [id];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: `property not found`,
                code: 0
            };
        }
        else {
            return {
                data: result.rows[0]
            };
        }
    }
    catch (error) {
        console.error("Error fetching propety:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.getPropertybyId = getPropertybyId;
const getPropertybyLandlordUuid = async (userUuid) => {
    try {
        const query = `select concat(first_name,' ',last_name) as ownername,email,mobile,propertydetails.* from propertydetails join users on propertydetails.landlordid=users.uuid where propertydetails.landlordid=$1;`;
        const values = [userUuid];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: `property not found`,
                code: 0
            };
        }
        else {
            return {
                data: result.rows
            };
        }
    }
    catch (error) {
        console.error("Error fetching propety:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.getPropertybyLandlordUuid = getPropertybyLandlordUuid;
const updatePropertyById = async (id, data) => {
    try {
        const query = `select * from propertydetails where id=$1`;
        const values = [id];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: `property not found`,
                code: 0
            };
        }
        else {
            const address = data.address || result.rows[0].address;
            const city = data.city || result.rows[0].city;
            const country = data.country || result.rows[0].country;
            const state = data.state || result.rows[0].state;
            const zipcode = data.zipcode || result.rows[0].zipcode;
            const number_of_rooms = data.number_of_rooms || result.rows[0].number_of_rooms;
            const rentprice = data.rentprice || result.rows[0].rentprice;
            const surfacearea = data.surfacearea || result.rows[0].surfacearea;
            const securityDeposit = data.securityDeposit || result.rows[0].securityDeposit;
            const rentalIncrement = data.rentalIncrement || result.rows[0].address;
            const existingImages = result.rows[0].images || [];
            const newImages = Object.values(data.imageUrls || {});
            const updatedImages = Array.from(new Set([...existingImages, ...newImages]));
            const rentFrequency = data.rentFrequency || result.rows[0].rentfrequency;
            const query1 = `UPDATE propertydetails
	SET  address=$1, state=$2, city=$3, country=$4, zipcode=$5, number_of_rooms=$6, surfacearea=$7, rentprice=$8, "securityDeposit"=$9, "rentalIncrement"=$10, images=$11,rentfrequency=$12
	WHERE id=$13 returning *;`;
            const value1 = [address, state, city, country, zipcode, number_of_rooms, surfacearea, rentprice, securityDeposit, rentalIncrement, updatedImages, rentFrequency, id];
            const result1 = await pool_1.pool.query(query1, value1);
            return {
                data: result1.rows[0]
            };
        }
    }
    catch (error) {
        console.error("Error fetching propety:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.updatePropertyById = updatePropertyById;
const getFilterResponseByTenant = async (data, limit, page) => {
    try {
        let query = `SELECT name, propertydetails.* FROM propertydetails
                   JOIN landlords ON propertydetails.landlordid = landlords.userid
                   WHERE 1 = 1`;
        let countQuery = `SELECT COUNT(*) FROM propertydetails
                   JOIN landlords ON propertydetails.landlordid = landlords.userid
                   WHERE 1 = 1`;
        const queryParams = [];
        const maxDistance = 2;
        const { address, city, country, state, minPrice, maxPrice, number_of_rooms, name } = data;
        if (address) {
            query += ` AND levenshtein(address, $${queryParams.length + 1}) <= ${maxDistance}`;
            countQuery += ` AND levenshtein(address, $${queryParams.length + 1}) <= ${maxDistance}`;
            queryParams.push(address);
        }
        if (city) {
            query += ` AND city = $${queryParams.length + 1}`;
            countQuery += ` AND city = $${queryParams.length + 1}`;
            queryParams.push(city);
        }
        if (state) {
            query += ` AND state = $${queryParams.length + 1}`;
            countQuery += ` AND state = $${queryParams.length + 1}`;
            queryParams.push(state);
        }
        if (country) {
            query += ` AND country = $${queryParams.length + 1}`;
            countQuery += ` AND country = $${queryParams.length + 1}`;
            queryParams.push(country);
        }
        if (minPrice !== undefined) {
            query += ` AND rentprice >= $${queryParams.length + 1}`;
            countQuery += ` AND rentprice >= $${queryParams.length + 1}`;
            queryParams.push(minPrice);
        }
        if (maxPrice !== undefined) {
            query += ` AND rentprice <= $${queryParams.length + 1}`;
            countQuery += ` AND rentprice <= $${queryParams.length + 1}`;
            queryParams.push(maxPrice);
        }
        if (number_of_rooms !== undefined) {
            query += ` AND number_of_rooms = $${queryParams.length + 1}`;
            countQuery += ` AND number_of_rooms = $${queryParams.length + 1}`;
            queryParams.push(number_of_rooms);
        }
        if (name) {
            query += ` AND levenshtein(name, $${queryParams.length + 1}) <= ${maxDistance}`;
            countQuery += ` AND levenshtein(name, $${queryParams.length + 1}) <= ${maxDistance}`;
            queryParams.push(name);
        }
        const countResult = await pool_1.pool.query(countQuery, queryParams);
        const totalRecords = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalRecords / limit);
        query += ` order by propertydetails.id desc`;
        const offset = (page - 1) * limit;
        query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);
        const result = await pool_1.pool.query(query, queryParams);
        const hasNextPage = result.rows.length === limit;
        if (result.rows.length === 0) {
            return {
                detail: `No matching property found`,
                code: 0
            };
        }
        else {
            return {
                detail: `Property found`,
                code: 1,
                filterData: result.rows,
                hasNextPage: hasNextPage,
                nextPage: page + 1,
                totalPages: totalPages,
                totalRecords: totalRecords
            };
        }
    }
    catch (error) {
        console.error("Error fetching property:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.getFilterResponseByTenant = getFilterResponseByTenant;
const deletePropertybyId = async (id) => {
    try {
        const query = `delete  from propertydetails where id=$1 returning *`;
        const values = [id];
        const result = await pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                error: `property not found`,
                code: 0
            };
        }
        else {
            return {
                detail: `property deleted successfully`
            };
        }
    }
    catch (error) {
        console.error("Error fetching propety:", error);
        return { error: "Internal Server Error", code: 0 };
    }
};
exports.deletePropertybyId = deletePropertybyId;
const sendApplicationById = async (data) => {
    try {
    }
    catch (error) {
    }
};
exports.sendApplicationById = sendApplicationById;
//# sourceMappingURL=db.js.map