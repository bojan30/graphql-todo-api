const express = require('express');
const {buildSchema} = require('graphql');
const graphqlHTTP = require('express-graphql');

//creating express app
const app = express();

//dummy todos array

let todos = [
    {id: "1", task: 'Todo task one', completed: false},
    { id: "2", task: 'Todo task two', completed: false },
    { id: "3", task: 'Todo task three', completed: false },
    { id: "4", task: 'Todo task four', completed: false}
]

//graphql schema

const schema = buildSchema(`
    type Query {
        todos(completed: Boolean!) : [Todo]!
        todo(id: ID!) : Todo!
    }
    type Mutation {
        addTodo(id: ID!, task: String!) : Todo!,
        updateTodo(id: ID!, completed: Boolean!) : Todo!,
        deleteTodo(id: ID!) : [Todo]!
    }
    type Todo {
        id: ID!,
        task: String!,
        completed: Boolean!
    }
`)

//API resolvers for endpoints
const root = {
    todos: (args) => {
        return todos.filter(todo => todo.completed === args.completed);
    },
    todo: (args) => {
        return todos.find(todo => todo.id === args.id);
    },
    addTodo: (args) => {
        const newTodo = {
            id: args.id,
            task: args.task,
            completed: false
        };
        todos.push(newTodo);
        return newTodo;
    },
    updateTodo: (args) => {
        todos.map(todo => {
            if(todo.id === args.id){
                todo.completed = args.completed;
                return todo;
            }
            return todo;
        })
        return todos.find(todo => todo.id === args.id);
    },
    deleteTodo: (args) => {
        todos = todos.filter(todo => todo.id !== args.id);
        return todos;
    }
}

app.use('/todos', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))
const port = 4001;

app.listen(port, () => {

    console.log('GraphQL server started on port '+port);

})