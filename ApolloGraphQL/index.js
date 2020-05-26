const { ApolloServer, gql, PubSub } = require("apollo-server");

// type checking
// query vs. mutation
// objects
// arrays
// arguments

// crud

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstLetterOfUsername: String
    age: Int
  }
  type Error {
    field: String!
    message: String!
  }
  type RegisterResponse {
    errors: [Error!]!
    user: User
  }
  input UserInfo {
    username: String!
    password: String!
    age: Int
  }
  type Query {
    hello(name: String): String
    user: User
  }
  type Mutation {
    register(userInfo: UserInfo!): RegisterResponse!
    login(userInfo: UserInfo!): String!
  }
  type Subscription {
    newUser: User!
  }
`;

const NEW_USER = "NEW_USER";

const resolvers = {
    Subscription: {
        newUser: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_USER)
        }
    },
    User: {
        firstLetterOfUsername: parent => {
            return parent.username ? parent.username[0] : null;
        }
    },
    Query: {
        hello: (parent, { name }) => {
            return `hey ${name}`;
        },
        user: () => ({
            id: 1,
            username: "tom"
        })
    },
    Mutation: {
        login: async (parent, { userInfo: { username } }, context) => {
            // check the password
            // await checkPassword(password);
            return username;
        },
        register: (_, { userInfo: { username, age } }, { pubsub }) => {
            const user = {
                id: 1,
                username,
                age
            };

            pubsub.publish(NEW_USER, {
                newUser: user
            });

            return {
                errors: [
                    {
                        field: "username",
                        message: "bad"
                    },
                    {
                        field: "username2",
                        message: "bad2"
                    }
                ],
                user
            };
        }
    }
};

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res, pubsub })
});

server.listen(5000).then(({ url }) => console.log(`server started at ${url}`));