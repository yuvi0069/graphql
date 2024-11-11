"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterPropertyType = exports.PropertyType = exports.TenantType = exports.LandlordType = void 0;
const graphql_1 = require("graphql");
const Property = new graphql_1.GraphQLObjectType({
    name: 'Property',
    fields: {
        property_id: { type: graphql_1.GraphQLString },
    }
});
exports.LandlordType = new graphql_1.GraphQLObjectType({
    name: 'Landlord',
    fields: {
        userid: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        mobile: { type: graphql_1.GraphQLString },
        properties: { type: new graphql_1.GraphQLList(Property) }
    }
});
exports.TenantType = new graphql_1.GraphQLObjectType({
    name: 'Tenant',
    fields: {
        userid: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        mobile: { type: graphql_1.GraphQLString },
        state: { type: graphql_1.GraphQLString },
        city: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLString },
        zipcode: { type: graphql_1.GraphQLInt },
        idnumber: { type: graphql_1.GraphQLString },
        iddocs: { type: graphql_1.GraphQLString }
    }
});
exports.PropertyType = new graphql_1.GraphQLObjectType({
    name: 'PropertyAdd',
    fields: {
        landlordid: { type: graphql_1.GraphQLString },
        ownername: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        rentfrequency: { type: graphql_1.GraphQLString },
        type: { type: graphql_1.GraphQLString },
        status: { type: graphql_1.GraphQLString },
        latefees: { type: graphql_1.GraphQLInt },
        leaseduration: { type: graphql_1.GraphQLInt },
        email: { type: graphql_1.GraphQLString },
        mobile: { type: graphql_1.GraphQLString },
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
        availablefrom: { type: graphql_1.GraphQLString },
        propertyname: { type: graphql_1.GraphQLString },
        constructionyear: { type: graphql_1.GraphQLInt },
        additionalcomments: { type: graphql_1.GraphQLString },
        images: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) }
    }
});
exports.FilterPropertyType = new graphql_1.GraphQLObjectType({
    name: 'FilterPropertyResponse',
    fields: {
        id: { type: graphql_1.GraphQLInt },
        name: { type: graphql_1.GraphQLString },
        propertyname: { type: graphql_1.GraphQLString },
        rentfrequency: { type: graphql_1.GraphQLString },
        type: { type: graphql_1.GraphQLString },
        latefees: { type: graphql_1.GraphQLInt },
        leaseduration: { type: graphql_1.GraphQLInt },
        availablefrom: { type: graphql_1.GraphQLString },
        address: { type: graphql_1.GraphQLString },
        landlordname: { type: graphql_1.GraphQLString },
        state: { type: graphql_1.GraphQLString },
        city: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLString },
        zipcode: { type: graphql_1.GraphQLInt },
        number_of_rooms: { type: graphql_1.GraphQLInt },
        surfacearea: { type: graphql_1.GraphQLInt },
        rentprice: { type: graphql_1.GraphQLInt },
        securityDeposit: { type: graphql_1.GraphQLInt },
        rentalIncrement: { type: graphql_1.GraphQLInt },
        status: { type: graphql_1.GraphQLString },
        constructionyear: { type: graphql_1.GraphQLInt },
        additionalcomments: { type: graphql_1.GraphQLString },
        images: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) }
    }
});
//# sourceMappingURL=userschema.js.map