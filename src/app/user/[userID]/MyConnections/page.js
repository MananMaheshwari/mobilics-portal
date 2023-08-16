"use client"

import { useEffect, useState } from "react"

const Page = ({ params }) => {
  const { userID } = params;
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [currUser, setCurrUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState(null);
  const [nonConnectedUsers, setNonConnectedUsers] = useState(null);


  const getAllConnections = async () => {
    try {
      const res = await fetch(`/api/user/${userID}/connections`, {
        method: "GET",
      });
      const { result } = await res.json();
      setConnectedUsers(result.connectedUsers);
      console.log("all connected users: ", result.connectedUsers);
    } catch (err) {
      console.log(err);
    }
  }

  //fetch all users [name, email, experiences]
  const getAllUsers = async () => {
    try {
      const res = await fetch(`/api/user`, {
        method: "GET",
      });
      const { users } = await res.json();
      setUsers(users);
      console.log("All users: ", users);
      setShouldUpdate(false);
    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    if (shouldUpdate) {
      getAllConnections();
      getAllUsers();
    }
  }, [shouldUpdate]);

  //update state if made a connection or removed a connection
  useEffect(() => {
    if (connectedUsers && users) {
      const nonConnectedUsers = users.filter(user => !(userID == user._id) && !connectedUsers.some(connectedUser => connectedUser._id == user._id));
      setNonConnectedUsers(nonConnectedUsers);
      const currentUser = users.filter(user => userID==user._id);
      setCurrUser(currentUser[0]);
      console.log("curr user from filter: ", currentUser[0]);
    }
  }, [users, connectedUsers])


  //remove connection from list
  const removeConnection = async (id) => {
    const user = currUser;
    user.connections = currUser.connections.filter(conn => !(conn == id));
    try {
      const res = await fetch(`/api/user/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user
        })
      });
      await res.json();
      setShouldUpdate(true);
    } catch (err) {
      console.log(err);
    }
  }

  //update connection to list
  const addConnection = async (id) => {
    const user = currUser;
    console.log("add connection: ", user);
    if (!user.connections) {
      user.connections = [];
    }
    console.log(user);
    user.connections.push(id);
    console.log("connections array updated: ", user.connections);
    try {
      console.log("to update user: ", user);
      const res = await fetch(`/api/user/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user
        })
      });
      await res.json();
      setShouldUpdate(true);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-full bg-slate-200">
      <div className='relative w-full my-2 rounded-md h-28 p-1 z-10 bg-violet-950 text-white'>
        <h4>My Connections</h4>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 sm:mb-32">
          {connectedUsers && connectedUsers.map((user) => {
            return (
              <div key={user._id} className="rounded-lg  grid grid-cols-1 sm:grid-cols-3 bg-white p-4 gap-2 shadow-lg shadow-gray-500/50">
                <div className="mx-auto my-auto m-4">
                  <img
                    className="h-24 w-24 rounded-full"
                    src={user.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                    alt="profile-image-user"
                  />
                </div>
                <div className=" sm:col-span-2 text-center">
                  <p className="font-bold">{user.name}</p>
                  <p>{user.email}</p>
                  {user.experiences.length > 0 &&
                    <div>
                      <p>{user.experiences[0].role}</p>
                      <p>{user.experiences[0].organisation}</p>
                    </div>
                  }

                </div>
                <div></div>
                <div className="text-center sm:col-span-2">
                  <button onClick={() => removeConnection(user._id)} className="shadow-lg shadow-gray-500/50 outline outline-2 outline-offset-0 outline-purple-500 rounded-3xl bg-purple-400 ww-1/2 sm:w-3/4 text-center">Remove Connection</button>
                </div>
              </div>
            );
          })}

        </div>
      </div>
      {nonConnectedUsers &&
        <div className="p-4">
          <h3 className="font-bold">People you can also connect !</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nonConnectedUsers.map((user) => {
              return (
                <div key={user._id} className="rounded-lg grid grid-cols-1 sm:grid-cols-3 bg-white p-4 gap-2 shadow-lg shadow-gray-500/50">
                  <div className="mx-auto my-auto m-4">
                    <img
                      className="h-24 w-24 rounded-full"
                      src={user.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                      alt="profile-image-user"
                    />
                  </div>
                  <div className=" sm:col-span-2 text-center">
                    <p className="font-bold">{user.name}</p>
                    <p>{user.email}</p>
                    {user.experiences.length > 0 &&
                      <div>
                        <p>{user.experiences[0].role}</p>
                        <p>{user.experiences[0].organisation}</p>
                      </div>
                    }

                  </div>
                  <div></div>
                  <div className="text-center sm:col-span-2">
                    <button onClick={() => addConnection(user._id)} className="shadow-lg shadow-gray-500/50 outline outline-2 outline-offset-0 outline-purple-500 rounded-3xl bg-purple-400 w-2/3 text-center">Connect</button>
                  </div>
                </div>
              );
            })}

          </div>
        </div>}
    </div>
  )
}

export default Page