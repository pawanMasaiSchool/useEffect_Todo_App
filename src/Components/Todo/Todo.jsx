import { useEffect, useState } from "react";
import TodoElement from "../TodoElement/TodoElement";
import styling from "./Todo.module.css";

export default function Todo() {
  const [data, setData] = useState([]);
  const [inp, setInp] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);

  const onClickCallback = (value) => {
    setPage(value);
  };

  const Pagination = ({ totalPages, currentPage, onClickCallback }) => {
    const pages = new Array(totalPages).fill(0).map((a, i) =>
      i + 1 === currentPage ? (
        <button disabled style={{ background: "olive" }} key={i}>
          {i + 1}
        </button>
      ) : (
        <button onClick={() => onClickCallback(i + 1)} key={i}>
          {i + 1}
        </button>
      )
    );
    return <div style={{ display: "flex", gap: "1rem" }}>{pages}</div>;
  };

  const handlePostRequest = (task) => {
    return fetch(`https://pawans-first-json-heroku.herokuapp.com/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(task)
    });
  };

  const handleAddTask = () => {
    setIsLoading(true);
    const payload = {
      title: inp,
      status: "false"
    };
    handlePostRequest(payload);
  };

  const getDataFromHeroku = () => {
    return fetch(
      `https://pawans-first-json-heroku.herokuapp.com/posts?_page=${page}&_limit=3`
    ).then((res) => res.json());
  };

  const handleDeleteTask = (id) => {
    setIsLoading(true);
    return fetch(`https://pawans-first-json-heroku.herokuapp.com/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(getDataFromHeroku());
  };

  useEffect(() => {
    getDataFromHeroku()
      .then((res) => {
        setIsLoading(false);
        setIsError(false);
        setData(res);
        console.log(res);
      })
      .catch((err) => {
        setIsError(true);
        console.log(err);
      });
    return () => {
      console.log("cleaning");
    };
  }, [isLoading, page]);

  return (
    <>
      <div className={styling.myinp}>
        <input
          value={inp}
          placeholder="Add Something"
          onChange={(e) => setInp(e.target.value)}
        />
        <button onClick={handleAddTask}>ADD</button>
      </div>

      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        data.map((item) => (
          <TodoElement
            key={item.id}
            title={item.title}
            status={item.status}
            id={item.id}
            handleDelete={handleDeleteTask}
          />
        ))
      )}
      {isError ? (
        <h1>Something Went Wrong</h1>
      ) : (
        <h2>
          -------------------------------------------------------------------------------------
        </h2>
      )}
      <div>
        <Pagination
          totalPages={3}
          currentPage={page}
          onClickCallback={onClickCallback}
        />
      </div>
    </>
  );
}
