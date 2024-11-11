"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpByUserUuid = exports.forgotPassword = exports.verifyUserSignUp = exports.signInUser = exports.logIn = void 0;
const function_1 = require("../helpers/function");
const db_1 = require("../models/db");
const jsonwebtoken_1 = require("jsonwebtoken");
const email_1 = require("../../email");
const graphql_1 = require("graphql");
const authschema_1 = require("../schema/authschema");
exports.logIn = {
    type: new graphql_1.GraphQLObjectType({
        name: 'LogInResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            logInUser: { type: authschema_1.UserLoginType }
        }
    }),
    args: {
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString }
    }, resolve: async (parent, args) => {
        const { email, password } = args;
        const userData = await (0, db_1.getUserByEmail)(email);
        if (!userData.uuid) {
            return {
                code: userData.code,
                detail: userData.error,
                status: "400",
            };
        }
        if (!userData.verified_email) {
            await (0, db_1.deleteUnverifiedUser)(userData.uuid);
            return {
                code: userData.code,
                detail: userData.error,
                status: "400",
            };
        }
        const isPasswordValid = await (0, function_1.comparePassword)(password, userData.password);
        if (!isPasswordValid) {
            return {
                code: 0,
                detail: `Invalid password`,
                status: "400",
            };
        }
        else {
            const jwtToken = (0, jsonwebtoken_1.sign)({ userId: userData.uuid }, "rent-payment");
            const userUpdatedData = await (0, db_1.updateUserDataByUserId)(userData.uuid, jwtToken);
            if (!userUpdatedData) {
                return {
                    code: 0,
                    detail: `User not found`,
                    status: "400",
                };
            }
            else {
                return {
                    detail: 'login sucessfully',
                    code: 1,
                    logInUser: {
                        uuid: userData.uuid,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        email: userData.email,
                        mobile: userData.mobile,
                        token: jwtToken
                    }
                };
            }
        }
    }
};
exports.signInUser = {
    type: new graphql_1.GraphQLObjectType({
        name: 'SignInResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
            signInUser: { type: authschema_1.UserSignUpType }
        }
    }),
    args: {
        firstName: { type: graphql_1.GraphQLString },
        lastName: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        mobileNo: { type: graphql_1.GraphQLString },
        role: { type: graphql_1.GraphQLString },
    },
    resolve: async (parent, args) => {
        const { email, firstName, lastName, password, mobileNo, role } = args;
        const unverifiedUser = await (0, db_1.getUserByEmail)(email);
        if (!unverifiedUser.verified_email) {
            await (0, db_1.deleteUnverifiedUser)(unverifiedUser.uuid);
        }
        const userData = await (0, db_1.checkUserByEmail)(email);
        if (userData.length !== 0) {
            return {
                code: 0,
                detail: `User email already exists..`,
                status: "400",
            };
        }
        const data = args;
        const otp = 123456;
        const userDetail = await (0, function_1.createUserClient)(data, otp);
        if (!userDetail.userId) {
            return {
                code: 0,
                detail: `User Register failed Please try again..`,
                status: "400",
            };
        }
        // const sendEmail = await otpSendEmailSignInVerification(
        //   email,
        //   `${data.firstName + " " + data.lastName}`,
        //   otp
        // );
        // if(sendEmail.success===true)
        {
            return {
                detail: 'signed in sucessfuly',
                code: 1,
                signInUser: { firstName,
                    lastName,
                    email,
                    mobileNo,
                    role,
                }
            };
        }
        // else{
        //   return{
        //     code: 0,
        //     detail: `Email not send`,
        //     status: "400",
        //   };
        // };
    }
};
exports.verifyUserSignUp = {
    type: new graphql_1.GraphQLObjectType({
        name: 'VerifySignInResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLString }
        }
    }),
    args: {
        email: { type: graphql_1.GraphQLString },
        otp: { type: graphql_1.GraphQLString }
    },
    resolve: async (parent, args) => {
        const { email } = args;
        const userData = await (0, db_1.getUserByEmail)(email);
        if (userData.error) {
            return {
                code: userData.code,
                detail: userData.error,
                status: "400",
            };
        }
        else {
            if (Number(userData?.otp) === Number(args.otp)) {
                await (0, db_1.updateUserverifiedEmailByUserId)(userData.uuid, true);
                let name;
                if (userData.last_name === null) {
                    name = userData.first_name;
                }
                name = userData.first_name + " " + userData.last_name;
                await (0, db_1.updateRoleDetails)(userData.uuid, name, userData.role_id);
                return {
                    detail: `otp verfied`,
                    code: 1
                };
            }
            else {
                return {
                    code: 0,
                    detail: `Your OTP not matched`,
                    status: "400",
                };
            }
        }
    }
};
exports.forgotPassword = {
    type: new graphql_1.GraphQLObjectType({
        name: 'ForgotPasswordResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLInt },
        }
    }),
    args: {
        email: { type: graphql_1.GraphQLString }
    },
    resolve: async (parent, args) => {
        const { email } = args;
        const userData = await (0, db_1.getUserByEmail)(email);
        if (!userData.uuid) {
            return {
                code: userData.code,
                detail: userData.error,
                status: "400",
            };
        }
        const otp = Math.floor(100000 + Math.random() * 9000);
        const sendEmail = await (0, email_1.otpSendEmail)(email, `${userData.first_name + " " + userData.last_name}`, otp);
        if (sendEmail.success === true) {
            const data = await (0, db_1.updateOtpByUserId)(userData.uuid, otp);
            if (data.code === 1) {
                return {
                    detail: `otp send successfully`,
                    code: 1
                };
            }
            else {
                return {
                    code: 0,
                    detail: `OTP not send Please try again`,
                    status: "400",
                };
            }
        }
    }
};
exports.verifyOtpByUserUuid = {
    type: new graphql_1.GraphQLObjectType({
        name: 'verifyUserOtpResponse',
        fields: {
            detail: { type: graphql_1.GraphQLString },
            code: { type: graphql_1.GraphQLString },
        }
    }),
    args: {
        userUuid: { type: graphql_1.GraphQLString },
        otp: { type: graphql_1.GraphQLString },
        newPassword: { type: graphql_1.GraphQLString }
    },
    resolve: async (parent, args) => {
        const { userUuid, otp, newPassword } = args;
        const userData = await (0, db_1.getUserByUserId)(userUuid);
        if (!userData.uuid) {
            return {
                code: userData.code,
                detail: userData.error,
                status: "400",
            };
        }
        if (Number(userData?.otp) === Number(otp)) {
            const encryptPassword = await (0, function_1.bcryptPassword)(newPassword);
            const updatePassword = await (0, db_1.updatePasswordByUserUuid)(userUuid, encryptPassword);
            if (updatePassword.data) {
                return {
                    detail: "Password change successfully",
                    code: 1
                };
            }
            return {
                code: 0,
                detail: `Password change failed`,
                status: "400",
            };
        }
        return {
            code: 0,
            detail: `Your OTP not matched`,
            status: "400",
        };
    }
};
//# sourceMappingURL=authresolvers.js.map