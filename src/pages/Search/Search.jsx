import { useEffect, useState, useContext } from "react";
import axios from "axios";

import SideNav from "../../components/SideNav/SideNav";
import SearchResultTile from "../../components/SearchResultTile/SearchResultTile";

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
                <SearchResultTile
                  key={foundUser._id}
                  resultUser={foundUser}
                ></SearchResultTile>
              );
            })}
      </div>
    </section>
  );
}

export default Search;
