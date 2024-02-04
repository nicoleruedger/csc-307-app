import cors from "cors";
import express from "express";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

function generateRandomId() {
  return Math.floor(Math.random() * 100000).toString(); // Number btwn 0 and 99999
}

const addUser = (user) => {
  const newUser = {
    id: generateRandomId(),
    ...user // Existing properties of user
  };
  users["users_list"].push(newUser);
  return newUser;
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query; // name = req.query.name, job = req.query.job
  let filteredUsers = users["users_list"]

  if (name) { // (name != undefined)
    filteredUsers = filteredUsers.filter((user) => user["name"] === name);
  }
  if (job) {
    filteredUsers = filteredUsers.filter((user) => user["job"] === job);
  }

  if (filteredUsers.length === 0) {
    res.status(404).send("No matching users found");
  } else {
    res.status(200).send({ users_list: filteredUsers });
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  let result = addUser(userToAdd);
  if (result === undefined) {
    res.status(500).send("Unable to add user.")
  } else {
    res.status(201).send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const userToDelete = findUserById(id);
  if (userToDelete === undefined) {
    res.status(404).send("User not found");
  } else {
    const index = users["users_list"].indexOf(userToDelete);
    users["users_list"].splice(index, 1);
    res.status(200).send("User deleted successfully");
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});