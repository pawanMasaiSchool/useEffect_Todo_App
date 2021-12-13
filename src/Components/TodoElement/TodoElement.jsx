import styling from "./TodoElement.module.css";

export default function TodoElement({ title, status, id, handleDelete }) {
  return (
    <div className={styling.Ele}>
      {title} --------- Status: {status}
      <button
        onClick={() => {
          handleDelete(id);
        }}
      >
        X
      </button>
    </div>
  );
}
