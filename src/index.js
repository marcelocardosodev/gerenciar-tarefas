const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  
  const {username} = request.headers;

  const user = users.find((user) => user.username === username);
   
  if(!user){

    return response.status(400).send({error: "user not found"});
  }
  
  request.user = user;

  return next();
  
}

app.post('/users', (request, response) => {
   const { name, username} = request.body;

   const user = { 
      id: uuidv4(),
      name, 
      username, 
      todos: []
  }

  users.push(user);
   return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  
  const { user}  = request;
  
  return response.status(200).send(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const { user} = request;

  const {title, deadline } = request.body;

  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline + " 00:00"), 
    created_at: new Date()
  }
  
  user.todos.push(todo);

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  
  const { user } = request;

  const { id } = request.params;
  
  const {title, deadline } = request.body;

  user.todos = user.todos.map((todo) => todo.id === id ? {...todo, title, deadline: new Date(deadline + " 00:00")} : todo);
  
  return response.status(201).send(user.todos);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
  const { user } = request;

  const { id } = request.params;
  
 
  user.todos = user.todos.map((todo) => todo.id === id ? {...todo, done: true } : todo);

  

  return response.status(201).send(user.todos);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
  const { user } = request;

  const { id } = request.params;
  
  const {title, deadline } = request.body;

  user.todos.splice(user.todos.findIndex(todo => todo.id === id), 1);
  
  return response.status(201).send(user.todos);

});

module.exports = app;

//app.listen(3333)