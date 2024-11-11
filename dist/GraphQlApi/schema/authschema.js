"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginType = exports.UserSignUpType = void 0;
const graphql_1 = require("graphql");
exports.UserSignUpType = new graphql_1.GraphQLObjectType({
    name: 'UserSignUp',
    fields: {
        useruuid: { type: graphql_1.GraphQLString },
        firstName: { type: graphql_1.GraphQLString },
        lastName: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        mobileNo: { type: graphql_1.GraphQLInt },
        role: { type: graphql_1.GraphQLString },
    },
});
exports.UserLoginType = new graphql_1.GraphQLObjectType({
    name: 'UserLogin',
    fields: {
        uuid: { type: graphql_1.GraphQLString },
        first_name: { type: graphql_1.GraphQLString },
        last_name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        mobile: { type: graphql_1.GraphQLString },
        role_id: { type: graphql_1.GraphQLString },
        token: { type: graphql_1.GraphQLString }
    },
});
//# sourceMappingURL=authschema.js.map