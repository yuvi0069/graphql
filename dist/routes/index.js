"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const index_1 = require("../GraphQlApi/index");
const graphql_upload_1 = require("graphql-upload");
const middleware_1 = require("graphql-voyager/middleware");
const routes = async (app) => {
    app.use((0, graphql_upload_1.graphqlUploadExpress)());
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: index_1.schema,
        context: ({ req, res }) => ({ req, res }),
        introspection: true
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: "/api/graphQl", cors: true });
    app.get('/api/graphql', (req, res) => {
        res.send(`
      <html>
        <head>
          <title>GraphiQL</title>
          <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.css" />
          <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/graphiql/graphiql.min.js"></script>
          <style>
            html, body, #graphiql { height: 100%; margin: 0; }
          </style>
        </head>
        <body>
          <div id="graphiql">Loading...</div>
          <script>
            const graphQLFetcher = (graphQLParams) => fetch('/api/graphql', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(graphQLParams),
            }).then(response => response.json()).catch(() => response.text());

            ReactDOM.render(
              React.createElement(GraphiQL, { fetcher: graphQLFetcher }),
              document.getElementById('graphiql'),
            );
          </script>
        </body>
      </html>
    `);
    });
    app.use('/voyager', (0, middleware_1.express)({ endpointUrl: '/api/graphql' }));
};
exports.routes = routes;
//# sourceMappingURL=index.js.map