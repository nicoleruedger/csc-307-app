import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
      const promise = fetch("http://localhost:8000/users");
      return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function deleteUser(id) {
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE"
    });

    return promise;
  }

  function deleteCharacter(id) {
    deleteUser(id)
      .then((res) => {
        if (res.status === 204) { // Successfully deleted on backend, delete on frontend by id
          setCharacters(characters.filter((character) => character.id !== id));
        } else if (res.status === 404) {
          console.log("Resource not found.");
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json(); // Parse the res body as JSON
        }
        return undefined; // If not 201, do nothing
      })
      .then((newUser) => {
        if (newUser !== undefined) {
          setCharacters([...characters, newUser]);
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    fetchUsers()
  	  .then((res) => res.json())
  	  .then((json) => setCharacters(json["users_list"]))
  	  .catch((error) => { console.log(error); });
  }, [] );

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={deleteCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
