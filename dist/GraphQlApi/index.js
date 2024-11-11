"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const userresolvers_1 = require("./resolvers/userresolvers");
const authresolvers_1 = require("./resolvers/authresolvers");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'Query',
    fields: {
        getUserDetailsByUserUuid: userresolvers_1.getUserDetailsByUserUuid,
        getLandlordDetailsByUuid: userresolvers_1.getLandlordDetailsByUuid,
        getTentantDetailsByUuid: userresolvers_1.getTentantDetailsByUuid,
        getPropertyDetailsById: userresolvers_1.getPropertyDetailsById,
        getPropertyDetailsBylandLordUuid: userresolvers_1.getPropertyDetailsBylandLordUuid,
        getfilterPropertyDertails: userresolvers_1.getfilterPropertyDertails,
        getLandlord: userresolvers_1.getLandlord,
        getTenant: userresolvers_1.getTenant
    }
});
const RootMutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signInUser: authresolvers_1.signInUser,
        logIn: authresolvers_1.logIn,
        verifyUserSignUp: authresolvers_1.verifyUserSignUp,
        forgotPassword: authresolvers_1.forgotPassword,
        verifyOtpByUserUuid: authresolvers_1.verifyOtpByUserUuid,
        changePasswordByUserUuid: userresolvers_1.changePasswordByUserUuid,
        updateUserDetails: userresolvers_1.updateUserDetails,
        addPropertyDetails: userresolvers_1.addPropertyDetails,
        addtentantDetails: userresolvers_1.addtentantDetails,
        updatePropertyDetails: userresolvers_1.updatePropertyDetails,
        deletePropertyDetailsbyId: userresolvers_1.deletePropertyDetailsbyId,
        sendTeantApplication: userresolvers_1.sendTeantApplication,
    },
});
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
//# sourceMappingURL=index.js.map