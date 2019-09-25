const express = require('express');
const {buildSchema} = require('graphql');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//env config
dotenv.config();

//import todo model

const Todo = require('./models/todo');

//creating express app
const app = express();

//graphql schema
const schema = buildSchema(`
    type Query {
        todos(completed: Boolean!) : [Todo]!
        todo(id: ID!) : Todo!
        allTodos : [Todo]!
    }
    type Mutation {
        addTodo(task: String!) : Todo!,
        updateTodo(id: ID!, completed: Boolean!) : Todo!,
        deleteTodo(id: ID!) : Todo!
    }
    type Todo {
        id: ID!,
        task: String!,
        completed: Boolean!
    }
`)

//API resolvers for endpoints
const root = {

    //find todos by completed criteria
    todos: (args) => {
        return Todo.find({completed: args.completed}).then(
            todos => {
                return todos;
            }
        ).catch(
            err => {
                throw err;
            }
        );
    },
    //find all todos
    allTodos: () => {
        return Todo.find({});
    },
    //find todo based on id
    todo: (args) => {
        return Todo.findById(args.id).then(todo => {
            return {...todo._doc, id: todo.id}
        }).catch(err =>{
            console.log(err);
            throw err;
        });
    },
    //add new todo
    addTodo: (args) => {
        const newTodo = new Todo(
            {
                task: args.task,
                completed: false
            }
        );
        return newTodo.save().then(todo => {
            return {...todo._doc, id: todo.id};
        }).catch(err => {
            console.log(err)
            throw err;
        });
    },
    // update todo
    updateTodo: (args) => {
        return Todo.findByIdAndUpdate(args.id, { completed: args.completed}, (err,todo) => {
            if(err) {
                throw err;
            }
            return {...todo._doc, id: todo.id};
        })
    },
    deleteTodo: (args) => {
       return Todo.findByIdAndRemove(args.id).then(
           todo => {
               return {...todo._doc, id: todo.id};
           }
       ).catch(err =>{
           throw err;
       });
    }
}

app.use('/todos', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))
const port = 4001;
mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-7czst.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false})
    .then(() => {
        console.log('Connected to the database');
        //start the server only if connected to a DB
        app.listen(port, () => {
            console.log('GraphQL server started on port ' + port);
        })
    })
    .catch(err => console.log(err));
