import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} from 'graphql';
import Db from './db.js';

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Person object',
    fields: () => {
        return {
            id : {
                type: GraphQLInt,
                resolve(person){
                    return person.id;
                }
            },
            firstName: {
                type: GraphQLString,
                resolve(person){
                    return person.firstName;
                }
            },
            lastName: {
                type: GraphQLString,
                resolve(person){
                    return person.lastName;
                }
            },
            email: {
                type: GraphQLString,
                resolve(person){
                    return person.email;
                }
            },
            posts: {
                type: new GraphQLList(Post),
                resolve(person){
                    return person.getPosts();
                }
            }
        }
    }
});

const Post = new GraphQLObjectType({
    name: 'Post',
    description: 'Post object',
    fields: () => {
        return {
            id : {
                type: GraphQLInt,
                resolve(post){
                    return post.id;
                }
            },
            title: {
                type: GraphQLString,
                resolve(post){
                    return post.title;
                }
            },
            content: {
                type: GraphQLString,
                resolve(post){
                    return post.content;
                }
            },
            person: {
                type: Person,
                resolve(post){
                    return post.getPerson();
                }
            }
        }
    }
});


const AddData = new GraphQLObjectType({
    name: 'AddData',
    description: 'Add Data object',
    fields: () => {
        return {
            addPerson: {
                type: Person,
                args: {
                    firstName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    lastName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(_, args){
                    return Db.models.person.create({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email.toLowerCase()
                    });
                }
            }
        }
    }
});


const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Query object',
    fields: () => {
        return {
            people: {
                type: new GraphQLList(Person),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    email: {
                        type: GraphQLString
                    }
                },
                resolve(root, args){
                    return Db.models.person.findAll({where:args});
                }
            },
            posts: {
                type: new GraphQLList(Post),
                resolve(root, args){
                    Db.models.post.findAll({where: args});
                }
            }, 

        }
    }
});


const Schema = new GraphQLSchema({
    query: Query,
    mutation:  AddData
});

export default Schema;