var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString, GraphQLList } from 'graphql';
import { connectionDefinitions, mutationWithClientMutationId, connectionArgs, connectionFromPromisedArray } from 'graphql-relay';
function UserSchema(userApp) {
    var userType = new GraphQLObjectType({
        name: 'User',
        fields: () => ({
            id: { type: GraphQLString },
            userName: { type: GraphQLString },
            email: { type: GraphQLString },
            emailConfirmed: { type: GraphQLBoolean },
            displayName: { type: GraphQLString },
            imgUrl: { type: GraphQLString },
            errors: { type: new GraphQLList(GraphQLString) }
        })
    });
    var userConnection = connectionDefinitions({
        name: 'User',
        nodeType: userType
    });
    function getUserConnection() {
        return {
            type: userConnection.connectionType,
            args: connectionArgs,
            resolve: (_, args) => {
                console.log('getting users');
                return connectionFromPromisedArray(userApp.find({}, { limit: args.first }), args);
            }
        };
    }
    function getSaveUserMutation(outputStore) {
        return mutationWithClientMutationId({
            name: 'SaveUser',
            inputFields: {
                id: { type: GraphQLString },
                userName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                displayName: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                errors: { type: new GraphQLList(GraphQLString) }
            },
            outputFields: {
                userEdge: {
                    type: userConnection.edgeType,
                    resolve: (user) => {
                        console.log('ql user', user);
                        return { node: user, cursor: user.id };
                    }
                },
                store: outputStore
            },
            mutateAndGetPayload: function (userArgs) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('saving user:', userArgs);
                        const savedUser = yield userApp.save(userArgs);
                        console.log('saved user:', savedUser);
                        return savedUser;
                    }
                    catch (e) {
                        console.log('Error saving user:', e);
                    }
                });
            }
        });
    }
    return {
        getSaveUserMutation,
        getUserConnection
    };
}
export default UserSchema;
