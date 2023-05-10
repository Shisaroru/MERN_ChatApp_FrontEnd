import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

import SideNav from "../../components/SideNav/SideNav";

import { GlobalState } from "../../GlobalState";

import styles from "./Search.module.css";

function Search() {
  const [search, setSearch] = useState({
    name: "",
    findBy: "",
  });
  const [users, setUsers] = useState([]);

  const data = useContext(GlobalState);
  const [user, setUser] = data.user;

  const formHandler = (e) => {
    e.preventDefault();
  };

  const addFriend = async (friendId) => {
    try {
      const result = await axios.patch("/api/user/add_friend", {
        id: user._id,
        friendId,
      });

      const newUsersList = users.map((user) => {
        if (user._id === friendId) {
          return {
            ...user,
            friendList: [...user.friendList, user._id],
          };
        }
        return user;
      });

      setUsers(newUsersList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function searchUsers() {
      try {
        if (search.findBy && search.name) {
          const response = await axios.post("/api/user/search", search, {
            headers: {
              Authorization: data.accessToken.current,
            },
          });
          setUsers(response.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (search.name === "") {
      setUsers([]);
    }

    searchUsers();
  }, [search]);

  return (
    <section id={styles.grid_container}>
      <SideNav></SideNav>
      <form action="#" onSubmit={formHandler}>
        <select
          name="findBy"
          id="findBy"
          onChange={(e) => {
            setSearch({ ...search, findBy: e.target.value });
          }}
          required
        >
          <option value="">--Search by: --</option>
          <option value="name">Name</option>
          <option value="phone">Phone number</option>
        </select>
        <label htmlFor="search"></label>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          value={search.name}
          onChange={(e) => {
            setSearch({ ...search, name: e.target.value });
          }}
          required
        />
      </form>
      <div>
        {users.length === 0 && search.name !== ""
          ? "Not found"
          : users.map((foundUser) => {
              return foundUser._id === user._id ? null : (
                <div key={foundUser._id}>
                  <FaRegUserCircle></FaRegUserCircle>
                  <p>{foundUser.name}</p>
                  {foundUser.friendList.includes(user._id) ? (
                    <button type="button">Unfriend</button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        addFriend(foundUser._id);
                      }}
                    >
                      Add friend
                    </button>
                  )}
                </div>
              );
            })}
      </div>
    </section>
  );
}

export default Search;
