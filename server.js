const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Create an Express application
const app = express();

// Placeholder data for the To-Do list
let todos = [
  { id: 1, task: "Learn GraphQL", completed: false },
  { id: 2, task: "Build a To-Do API", completed: false }
];

// GraphQL Schema
const schema = buildSchema(`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
  }

  type Query {
    getTodos: [Todo]
    getTodoById(id: ID!): Todo
  }

  input TodoInput {
    task: String!
    completed: Boolean
  }

  type Mutation {
    createTodo(input: TodoInput): Todo
    updateTodo(id: ID!, input: TodoInput): Todo
    deleteTodo(id: ID!): String
  }
`);

// Resolvers (root handlers)
const root = {
  getTodos: () => todos,
  getTodoById: ({ id }) => todos.find(todo => todo.id == id),

  createTodo: ({ input }) => {
    const newTodo = {
      id: todos.length + 1,
      task: input.task,
      completed: input.completed || false
    };
    todos.push(newTodo);
    return newTodo;
  },

  updateTodo: ({ id, input }) => {
    const todoIndex = todos.findIndex(todo => todo.id == id);
    if (todoIndex === -1) throw new Error('Todo not found');
    todos[todoIndex] = { ...todos[todoIndex], ...input };
    return todos[todoIndex];
  },

  deleteTodo: ({ id }) => {
    const todoIndex = todos.findIndex(todo => todo.id == id);
    if (todoIndex === -1) throw new Error('Todo not found');
    todos.splice(todoIndex, 1);
    return `Todo with ID ${id} deleted`;
  }
};

// Set up GraphQL HTTP Server Middleware
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Use GraphiQL GUI
}));

// Start the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
