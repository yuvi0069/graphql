"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTeantApplication = exports.getTenant = exports.getLandlord = exports.deletePropertyDetailsbyId = exports.getfilterPropertyDertails = exports.updatePropertyDetails = exports.getPropertyDetailsBylandLordUuid = exports.getPropertyDetailsById = exports.getTentantDetailsByUuid = exports.getLandlordDetailsByUuid = exports.addtentantDetails = exports.addPropertyDetails = exports.updateUserDetails = exports.getUserDetailsByUserUuid = exports.changePasswordByUserUuid = void 0;
const function_1 = require("../helpers/function");
const db_1 = require("../models/db");
const graphql_1 = require("graphql");
const auth_1 = require("../../middleware/auth");
const authschema_1 = require("../schema/authschema");
const userschema_1 = require("../schema/userschema");
const graphql_upload_1 = require("graphql-upload");
const function_2 = require("../helpers/function");
// import imageUploadQueue from "../redis/imageQueue";
// import { resolve } from "path";
const index_1 = require("../../email/index");
// import Stripe from 'stripe';
// const stripe = new Stripe("sk_test_51QF8pMGVR3TEoY4WTMGiRC87vcluSFXpMBqJwoF6G9uF68Dc1qpD5se1bI5aE8irx2VW95sC7Lqujis2QawAUAUF00awxR4OfG");
exports.changePasswordByUserUuid = {
    type: new graphql_1.GraphQLObjectType({
        name: 'ChangePasswordResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
        }
    }),
    args: {
        oldPassword: { type: graphql_1.GraphQLString },
        newPassword: { type: graphql_1.GraphQLString },
        userUuid: { type: graphql_1.GraphQLString },
    }, async resolve(parent, args, context) {
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        req.params = { userUuid: args.userUuid };
        await (0, auth_1.verifyUser)(() => { })(parent, args, context);
        const { userUuid, oldPassword, newPassword } = args;
        const userData = await (0, db_1.getUserByUserId)(userUuid);
        if (userData.error) {
            return {
                detail: userData.error,
                code: userData.code
            };
        }
        const isPasswordValid = await (0, function_1.comparePassword)(oldPassword, userData.password);
        if (!isPasswordValid) {
            return {
                code: 0,
                detail: `Invalid old password`,
                status: "400",
            };
        }
        const encryptPassword = await (0, function_1.bcryptPassword)(newPassword);
        const updatePassword = await (0, db_1.updatePasswordByUserUuid)(userUuid, encryptPassword);
        if (updatePassword.data) {
            return {
                detail: "Password change successfully",
                code: 1,
            };
        }
        return {
            code: 0,
            detail: `Password change failed`,
            status: "400",
        };
    }
};
exports.getUserDetailsByUserUuid = {
    type: new graphql_1.GraphQLObjectType({
        name: 'getUserDetailsResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLString },
            userData: { type: authschema_1.UserLoginType }
        }
    }),
    args: {
        userUuid: { type: graphql_1.GraphQLString }
    },
    resolve: async (parent, args, context) => {
        const { userUuid } = args;
        const userData = await (0, db_1.getUserByUserId)(userUuid);
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        if (!userData.uuid) {
            return {
                detail: userData.error,
                code: userData.code
            };
        }
        return {
            detail: "User details retrieved successfully",
            code: "1",
            userData
            //   {useruuid:userData.uuid,
            //     firstName:userData.first_name,
            //     lastName:userData.last_name,
            //     email:userData.email,
            //     mobileNo:userData.mobile,
            //   role:userData.role_id}
            // };
        };
    }
};
exports.updateUserDetails = {
    type: new graphql_1.GraphQLObjectType({
        name: 'UpdateUserDetailsResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLString },
            updatedData: { type: authschema_1.UserLoginType }
        }
    }),
    args: {
        userUuid: { type: graphql_1.GraphQLString },
        firstName: { type: graphql_1.GraphQLString },
        lastName: { type: graphql_1.GraphQLString },
        mobileNo: { type: graphql_1.GraphQLString }
    },
    resolve: async (parent, args, context) => {
        const { userUuid } = args;
        const userData = await (0, db_1.getUserByUserId)(userUuid);
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const { req } = context;
        req.params = { userUuid: args.userUuid };
        await (0, auth_1.verifyUser)(() => { })(parent, args, context);
        const bodyData = args;
        if (!userData.uuid) {
            return {
                detail: userData.error,
                code: userData.code
            };
        }
        const updateData = await (0, db_1.updateUserDetailsByUserId)(userUuid, bodyData);
        if (!updateData.data) {
            return {
                code: 0,
                detail: `User data not updated`,
                status: "400",
            };
        }
        return {
            detail: "User details update successfully",
            code: 1,
            updatedData: {
                uuid: updateData.data.uuid,
                first_name: updateData.data.first_name,
                last_name: updateData.data.last_name,
                email: updateData.data.email,
                mobile: updateData.data.mobile,
            }
        };
    }
};
// export const landlordAddDetails={
//   type:new GraphQLObjectType({
//     name:'landLordResponse',
//     fields:{
//       detail:{type:GraphQLString},
//       code:{type:GraphQLInt},
//       landlordData:{type:LandlordType}
//     }
//   }),
//   args:{userUuid:{type:GraphQLString}},
//   resolve:async(parent:any,args:any)=>{
//     const {userUuid}=args;
//       const userData=await getUserByUserId(userUuid);
//       if(!userData){
//         throw new ApiError({
//           code: 0,
//           detail: `User not found`,
//           status: "400",
//         });
//       }
//       if (userData.role_id!==2){
//         throw new ApiError({
//           code: 0,
//           detail: `User not a landlord`,
//           status: "400",
//         });
//       }
//       const name=userData.first_name+userData.last_name;
//       const landLordData=await insertLandlordDetails(userData.uuid,name);
//       if (!landLordData.data) {
//         throw new ApiError({
//           code: 0,
//           detail: `User status not updated`,
//           status: "400",
//         });
//       }
//       return{
//         detail: "User status update successfully",
//         code: 1,
//          landlordData:{
//           userid:landLordData.data[0].userid,
//           name:landLordData.data[0].name
//          }
//       };
//   }
//   };
exports.addPropertyDetails = {
    type: new graphql_1.GraphQLObjectType({
        name: 'PropertyResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            propertyData: { type: userschema_1.PropertyType }
        }
    }),
    args: {
        userUuid: { type: graphql_1.GraphQLString },
        address: { type: graphql_1.GraphQLString },
        state: { type: graphql_1.GraphQLString },
        city: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLString },
        zipcode: { type: graphql_1.GraphQLInt },
        number_of_rooms: { type: graphql_1.GraphQLInt },
        surfacearea: { type: graphql_1.GraphQLInt },
        rentprice: { type: graphql_1.GraphQLInt },
        securityDeposit: { type: graphql_1.GraphQLInt },
        rentalIncrement: { type: graphql_1.GraphQLInt },
        name: { type: graphql_1.GraphQLString },
        rentfrequency: { type: graphql_1.GraphQLString },
        type: { type: graphql_1.GraphQLString },
        latefees: { type: graphql_1.GraphQLInt },
        leaseduration: { type: graphql_1.GraphQLInt },
        availablefrom: { type: graphql_1.GraphQLString },
        propertyname: { type: graphql_1.GraphQLString },
        constructionyear: { type: graphql_1.GraphQLInt },
        additionalcomments: { type: graphql_1.GraphQLString },
        images: { type: new graphql_1.GraphQLList(graphql_upload_1.GraphQLUpload) }
    },
    resolve: async (parent, args, context) => {
        const { userUuid, images } = args;
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const userData = await (0, db_1.getUserByUserId)(userUuid);
        if (!userData) {
            return {
                code: 0,
                detail: `User not found`,
                status: "400",
            };
        }
        if (userData.role_id !== 2) {
            return {
                code: 0,
                detail: `User not a landlord`,
                status: "400",
            };
        }
        let imageUrls = [];
        if (images) {
            imageUrls = await Promise.all(images.map(async (image) => {
                const { createReadStream, filename } = await image;
                const stream = await createReadStream();
                const url = await (0, function_2.saveImageToFirebase)(stream, filename);
                return url;
            }));
            // const imageUrls = await Promise.all(images.map(async (image:any) => {
            //   const { createReadStream, filename } = await image;
            //   const stream = await createReadStream();
            // const chunks = [];
            //   for await (const chunk of stream) {
            //     chunks.push(chunk);
            //   }
            //   const imageBuffer = Buffer.concat(chunks);
            //   const url = await saveImageLocally(stream, filename); 
            //   return url;
            // }));
            //   const imageUrls1 = await Promise.all(images.map(async (image: any) => {
            //       const {createReadStream,filename } = await image;
            //       // Get the stream directly
            // const stream=await createReadStream();
            //       // Pass the stream directly to the job without converting to a buffer
            //       const buffer = await new Promise<Buffer>((resolve, reject) => {
            //         const chunks: Buffer[] = [];
            //         stream.on('data', (chunk: Buffer) => {
            //           chunks.push(chunk);
            //         });
            //         stream.on('end', () => {
            //           const combinedBuffer = Buffer.concat(chunks);
            //           console.log(`Created buffer of length: ${combinedBuffer.length}, type: ${Buffer.isBuffer(combinedBuffer) ? 'Buffer' : typeof combinedBuffer}`);
            //           // If combinedBuffer is an object and not a Buffer, convert it
            //           if (typeof combinedBuffer === 'object') {
            //             const jsonString = JSON.stringify(combinedBuffer);
            //             const bufferFromObject = Buffer.from(jsonString);
            //             resolve(bufferFromObject); // Resolve with the new Buffer
            //           } else {
            //             resolve(combinedBuffer); // Resolve with the original Buffer
            //           }
            //         });
            //         stream.on('error', reject);
            //       });
            //       const job = await imageUploadQueue.add("uploadImage", {
            //         userUuid,
            //         filename,
            //         buffer, // Pass the stream directly
            //       });
            //       return job.id; // Return job ID to track progress
            //     }))
        }
        const propertyData = await (0, db_1.insertPropertyDetails)(userData.uuid, { ...args, imageUrls });
        if (!propertyData.data) {
            return {
                code: 0,
                detail: `Property not added succesfully`,
                status: "400",
            };
        }
        return {
            detail: "Property added succesfully",
            code: 1,
            propertyData: propertyData.data
            //     propertyData:{
            // landlordid:propertyData.data.landlordid,
            // name:propertyData.data.name,
            // address:propertyData.data.address, 
            // state: propertyData.data.state,
            // city: propertyData.data.city,
            // country: propertyData.data.country,
            // zipcode:propertyData.data.zipcode,
            // number_of_rooms:propertyData.data.number_of_rooms,
            // surfacearea:propertyData.data.surfacearea,
            // rentprice:propertyData.data.rentprice,
            // securityDeposit:propertyData.data.securityDeposit,
            // rentalIncrement:propertyData.data.rentalIncrement,
            // rentfrequency:propertyData.data.rentfrequency,
            // images:imageUrls
            //      }
        };
    }
};
exports.addtentantDetails = {
    type: new graphql_1.GraphQLObjectType({
        name: 'TentantResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            tenantData: { type: userschema_1.TenantType }
        }
    }),
    args: {
        userUuid: { type: graphql_1.GraphQLString },
        state: { type: graphql_1.GraphQLString },
        city: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLString },
        zipcode: { type: graphql_1.GraphQLInt },
        idnumber: { type: graphql_1.GraphQLString },
        iddocs: { type: graphql_1.GraphQLString },
    },
    resolve: async (parent, args, context) => {
        const { userUuid } = args;
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const userData = await (0, db_1.getUserByUserId)(userUuid);
        if (!userData) {
            return {
                code: userData.code,
                detail: userData.error,
                status: "400",
            };
        }
        if (userData.role_id !== 3) {
            return {
                code: 0,
                detail: `User not a tentant`,
                status: "400",
            };
        }
        const tenantData = await (0, db_1.updateTentantDetails)(args);
        if (!tenantData.data) {
            return {
                code: 0,
                detail: `User status not updated`,
                status: "400",
            };
        }
        return {
            detail: "User status update successfully",
            code: 1,
            tenantData: {
                userid: tenantData.data[0].userid,
                name: tenantData.data[0].name,
                city: tenantData.data[0].city,
                state: tenantData.data[0].state,
                country: tenantData.data[0].country,
                zipcode: tenantData.data[0].zipcode,
                idnumber: tenantData.data[0].idnumber,
                iddocs: tenantData.data[0].iddocs
            }
        };
    }
};
exports.getLandlordDetailsByUuid = {
    type: new graphql_1.GraphQLObjectType({
        name: 'GetLandLordDataByUseruuidResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            landLordData: { type: userschema_1.LandlordType }
        }
    }),
    args: {
        userUuid: { type: graphql_1.GraphQLString }
    },
    resolve: async (parent, args, context) => {
        const { userUuid } = args;
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const landLordData = await (0, db_1.getLandlordbyUuid)(userUuid);
        if (landLordData.error) {
            return {
                detail: landLordData.error,
                code: 0
            };
        }
        return {
            detail: `LandLord Found successfully`,
            code: 1,
            landLordData: landLordData.data
        };
    }
};
exports.getTentantDetailsByUuid = { type: new graphql_1.GraphQLObjectType({
        name: 'GetTenantDataByUseruuidResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            tenantData: { type: userschema_1.TenantType }
        }
    }),
    args: {
        userUuid: { type: graphql_1.GraphQLString }
    },
    resolve: async (parent, args, context) => {
        const { userUuid } = args;
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const tenantData = await (0, db_1.getTenantbyUuid)(userUuid);
        if (!tenantData.data) {
            return {
                detail: `tenant not found`,
                code: 0
            };
        }
        return {
            detail: `Tenant Found successfully`,
            code: 1,
            tenantData: {
                userid: tenantData.data.userid,
                name: tenantData.data.name,
                city: tenantData.data.city,
                state: tenantData.data.state,
                country: tenantData.data.country,
                zipcode: tenantData.data.zipcode,
                idnumber: tenantData.data.idnumber,
                iddocs: tenantData.data.iddocs
            }
        };
    }
};
exports.getPropertyDetailsById = {
    type: new graphql_1.GraphQLObjectType({
        name: 'PropertyResponseForId',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            propertyData: { type: userschema_1.PropertyType }
        }
    }),
    args: {
        id: { type: graphql_1.GraphQLInt }
    },
    resolve: async (parent, args, context) => {
        const { id } = args;
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const propertyData = await (0, db_1.getPropertybyId)(id);
        if (!propertyData.data) {
            return {
                code: 0,
                detail: `Property not founded`,
                status: "400",
            };
        }
        return {
            detail: "Property found successfully",
            code: 1,
            propertyData: propertyData.data
        };
    }
};
exports.getPropertyDetailsBylandLordUuid = {
    type: new graphql_1.GraphQLObjectType({
        name: 'PropertyResponseForLandlordId',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            propertyData: { type: new graphql_1.GraphQLList(userschema_1.PropertyType) }
        }
    }),
    args: {
        userUuid: { type: graphql_1.GraphQLString },
    },
    resolve: async (parent, args, context) => {
        const { userUuid } = args;
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const propertyData = await (0, db_1.getPropertybyLandlordUuid)(userUuid);
        if (!propertyData.data) {
            return {
                code: 0,
                detail: propertyData.error,
                status: "400",
            };
        }
        return {
            detail: "Property found successfully",
            code: 1,
            propertyData: propertyData.data,
        };
    }
};
exports.updatePropertyDetails = {
    type: new graphql_1.GraphQLObjectType({
        name: 'UpdatePropertyResponseForId',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            propertyData: { type: userschema_1.PropertyType }
        }
    }),
    args: {
        id: { type: graphql_1.GraphQLInt },
        userUuid: { type: graphql_1.GraphQLString },
        address: { type: graphql_1.GraphQLString },
        state: { type: graphql_1.GraphQLString },
        city: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLString },
        zipcode: { type: graphql_1.GraphQLInt },
        number_of_rooms: { type: graphql_1.GraphQLInt },
        surfacearea: { type: graphql_1.GraphQLInt },
        rentprice: { type: graphql_1.GraphQLInt },
        securityDeposit: { type: graphql_1.GraphQLInt },
        rentalIncrement: { type: graphql_1.GraphQLInt },
        name: { type: graphql_1.GraphQLString },
        rentfrequency: { type: graphql_1.GraphQLInt },
        type: { type: graphql_1.GraphQLString },
        availablefrom: { type: graphql_1.GraphQLString },
        propertyname: { type: graphql_1.GraphQLString },
        images: { type: new graphql_1.GraphQLList(graphql_upload_1.GraphQLUpload) }
    },
    resolve: async (parent, args, context) => {
        const { id } = args;
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        req.params = { userUuid: args.userUuid };
        await (0, auth_1.verifyUser)(() => { })(parent, args, context);
        let imageUrls;
        if (args.images) {
            imageUrls = await Promise.all(args.images.map(async (image) => {
                const { createReadStream, filename } = await image;
                const stream = await createReadStream();
                const url = await (0, function_2.saveImageToFirebase)(stream, filename);
                return url;
            }));
        }
        const propertyData = await (0, db_1.updatePropertyById)(id, { ...args, imageUrls });
        if (propertyData.error) {
            return {
                detail: propertyData.error,
                code: propertyData.code
            };
        }
        return {
            detail: "Property updated successfully",
            code: 1,
            propertyData: propertyData.data
            //        propertyData:{
            //   address:propertyData.data.address, 
            //   state: propertyData.data.state,
            //   city: propertyData.data.city,
            //   country: propertyData.data.country,
            //   zipcode:propertyData.data.zipcode,
            //   number_of_rooms:propertyData.data.number_of_rooms,
            //   surfacearea:propertyData.data.surfacearea,
            //   rentprice:propertyData.data.rentprice,
            //   securityDeposit:propertyData.data.securityDeposit,
            // rentalIncrement:propertyData.data.rentalIncrement,
            //   images:propertyData.data.images
            //        }
        };
    }
};
exports.getfilterPropertyDertails = {
    type: new graphql_1.GraphQLObjectType({
        name: "filterPropertyResponse",
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLString },
            totalrecords: { type: graphql_1.GraphQLInt },
            totalpages: { type: graphql_1.GraphQLInt },
            filterData: { type: new graphql_1.GraphQLList(userschema_1.FilterPropertyType) },
            hasNextPage: { type: graphql_1.GraphQLBoolean },
            nextPage: { type: graphql_1.GraphQLInt }
        }
    }),
    args: {
        address: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        state: { type: graphql_1.GraphQLString },
        city: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLString },
        number_of_rooms: { type: graphql_1.GraphQLInt },
        minPrice: { type: graphql_1.GraphQLInt },
        maxPrice: { type: graphql_1.GraphQLInt },
        page: { type: graphql_1.GraphQLInt }
    },
    resolve: async (parent, args, context) => {
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const limit = args.limit || 5;
        const page = args.page || 1;
        const filteredData = await (0, db_1.getFilterResponseByTenant)(args, limit, page);
        if (!filteredData || typeof filteredData.hasNextPage === 'undefined') {
            return {
                detail: `No matching found`,
                code: 0
            };
        }
        else {
            return {
                detail: `Property found`,
                code: 1,
                totalrecords: filteredData.totalRecords,
                totalpages: filteredData.totalPages,
                filterData: filteredData.filterData,
                hasNextPage: filteredData.hasNextPage,
                nextPage: filteredData.nextPage
            };
        }
    }
};
exports.deletePropertyDetailsbyId = {
    type: new graphql_1.GraphQLObjectType({
        name: "deletePropertyResponse",
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLString },
        }
    }),
    args: {
        id: { type: graphql_1.GraphQLInt },
        userUuid: { type: graphql_1.GraphQLString }
    },
    resolve: async (parent, args, context) => {
        const { id } = args;
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        req.params = { userUuid: args.userUuid };
        await (0, auth_1.verifyUser)(() => { })(parent, args, context);
        const filteredData = await (0, db_1.deletePropertybyId)(id);
        if (filteredData.error) {
            return {
                detail: filteredData.error,
                code: 0
            };
        }
        else {
            return {
                detail: filteredData.detail,
                code: 1,
            };
        }
    }
};
exports.getLandlord = {
    type: new graphql_1.GraphQLObjectType({
        name: 'LandLordsResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            landlordData: { type: new graphql_1.GraphQLList(userschema_1.LandlordType) }
        }
    }),
    resolve: async (parent, args, context) => {
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const landlordData = await (0, db_1.getLandlordDetails)();
        const userData = await (0, db_1.getUserByUserId)(req.user);
        if (userData.role_id === 2 || userData.role_id === 3) {
            return {
                code: 0,
                detail: 'Not allowed to access'
            };
        }
        if (landlordData.error) {
            return {
                detail: landlordData.error,
                code: landlordData.code
            };
        }
        return {
            detail: 'Landlords Details',
            code: 1,
            landlordData: landlordData.data
        };
    }
};
exports.getTenant = {
    type: new graphql_1.GraphQLObjectType({
        name: 'TenantsResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            tenantData: { type: new graphql_1.GraphQLList(userschema_1.TenantType) }
        }
    }),
    resolve: async (parent, args, context) => {
        const { req } = context;
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const tenantData = await (0, db_1.getTenantDetails)();
        const userData = await (0, db_1.getUserByUserId)(req.user);
        // if(userData.role_id===2 || userData.role_id===3){
        //   return{
        //     code:0,
        //     detail:'Not allowed to access'
        //   }
        // }
        if (tenantData.error) {
            return {
                detail: tenantData.error,
                code: tenantData.code
            };
        }
        return {
            detail: 'Tenant Details',
            code: 1,
            tenantData: tenantData.data
        };
    }
};
exports.sendTeantApplication = {
    type: new graphql_1.GraphQLObjectType({
        name: 'SendTeantResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLString }
        }
    }),
    args: {
        propertyId: { type: graphql_1.GraphQLInt },
        tenantId: { type: graphql_1.GraphQLString },
        occupation: { type: graphql_1.GraphQLString },
        income: { type: graphql_1.GraphQLInt },
    },
    resolve: async (parent, args, context) => {
        await (0, auth_1.withVerifyToken)(() => { })(parent, args, context);
        const propertyData = await (0, db_1.getPropertybyId)(args.propertyId);
        const tenantData = await (0, db_1.getTenantbyUuid)(args.tenantId);
        if (!tenantData.data.idverified) {
            return {
                code: 0,
                detail: `please verify the id detils with us`
            };
        }
        const sendData = await (0, index_1.sendApplicationEmail)(propertyData.data.email, propertyData.data.ownername, tenantData.data.name, args.occupation, args.income, tenantData.data.idnumber, tenantData.data.iddocs);
        if (sendData.success === true) {
            return {
                code: 1,
                detail: `Application send Successfully`
            };
        }
        else {
            return {
                code: 0,
                detail: `Application not send Successfully`
            };
        }
    }
};
const RentPaymentResponseType = new graphql_1.GraphQLObjectType({
    name: 'RentPaymentResponse',
    fields: {
        detail: { type: graphql_1.GraphQLString },
        clientSecret: { type: graphql_1.GraphQLString },
        code: { type: graphql_1.GraphQLInt },
    },
});
// export const initiateRentPayment = {
//   type: RentPaymentResponseType,
//   args: {
//     tenantUuid: { type: GraphQLString },
//     tenantName: { type: GraphQLString },
//     landlordUuid: { type: GraphQLString },
//     paymentMethodId:{type:GraphQLString},
//     amount: { type: GraphQLInt }, 
//   },
//   resolve: async (parent: any, args: any, context: any) => {
//     const { req } = context;
//     await withVerifyToken(() => {})(parent, args, context); 
//     const { tenantUuid, tenantName, landlordUuid, amount,paymentMethodId} = args;
//     try {
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount,
//         currency: 'usd',
//         payment_method: paymentMethodId,
//             payment_method_types: ['card'],
//             automatic_payment_methods: {
//                 enabled: false,
//             },
//             confirm: true,
//         metadata: {
//           tenantUuid,
//           tenantName,
//           landlordUuid,
//         },
//       });
//       if (paymentIntent.status === 'succeeded') {
//         return {
//           detail: "Rent payment completed successfully",
//           clientSecret: paymentIntent.client_secret,
//           code: 1,
//         };
//       }
//       return {
//         detail: "Rent payment initiated, please confirm payment on frontend",
//         clientSecret: paymentIntent.client_secret,
//         code: 1,
//       };
//     } catch (error: any) {
//       console.error("Stripe Error:", error);
//       return {
//         detail: "Failed to initiate rent payment",
//         code: 0,
//       };
//     }
//   },
// };
//# sourceMappingURL=userresolvers.js.map