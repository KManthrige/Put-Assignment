import { useEffect, useState } from "react";
import './styles.css';

export default function App() {

  // const [updateChore, setUpdateChore] = useState({})
  const [choreList, setChoreList] = useState([]);
  const [newChore, setNewChore] = useState({
    todo: "",
    due: ""
  });
  // const[updateChoreList, setUpdataChoreList] = useState({
  //   todo: "",
  //   due: ""
  // })

  const getData = async () => {
    try {
      const response = await fetch("/api/getList")
      const data = await response.json()
      setChoreList(data)
    } catch (error) {
      console.log("Error in GET data", error)
    }
  }

  const putData = async (id) => {
    try {
      const choreToUpdate = choreList.find((item) => item.id === id);
      const response = await fetch(`/api/updateList/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(choreToUpdate)
      });
      const data = await response.json();
      console.log("new data", data);
    } catch (error) {
      console.log("Error in PUT data")
    }
  }

  const addData = async () => {
    try {
      const response = await fetch("/api/addNew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChore)
      })
      const data = await response.json()
      console.log("POST data", data)
      getData()
    } catch (error) {
      console.log("Error in POST data", error)
    }
  }

  const deleteData = async (id) => {
    try {
      const response = await fetch(`/api/deleteChore${id}`, {
        method: "DELETE"
      })
      const data = await response.json()
      console.log(data)
      getData()
    } catch (error) {
      console.log("Error deleting item", error)
    }
  }

  const placeholder = (event) => {
    setNewChore((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  // const handleEdit = (event) => {
  //   console.log("something changed", event.target.value)
  //   setUpdataChoreList((prevState) => ({
  //     ...prevState,
  //     [event.target.name]: event.target.value
  //   }))
  // }
  const handleEdit = (rowIndex, field, value) => {
    console.log("rowIndex", rowIndex)
    setChoreList((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
      return updatedData;
    });
  };


  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {

  }, [newChore])


  return (
    <>
      <div className="app">
        <div className="title">Adult in Training</div>
        <div className="placeholder">
          <input name="todo" className="todo" placeholder="Chore" onChange={placeholder} value={newChore.todo} />
          <input name="due" className="due" placeholder="Due Data" onChange={placeholder} value={newChore.due} />
          <button className="addData" onClick={addData}>ADD NEW CHORE</button>
        </div>

        <table className="table">
          <thead className="thead">
            <tr>
              <th>Chore</th>
              <th>Edit</th>
              <th>Due Date</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {choreList.map((item, index) =>
              <tr key={item.id}>
                {/* <td>{item.todo}</td> */}
                <td contentEditable
                  onBlur={(event) => handleEdit(index, "todo", event.target.innerText)}>{item.todo}</td>
                <td contentEditable
                  onBlur={(event) => handleEdit(index, "due", event.target.innerText)}>{item.due}</td>
                {/* <td>
              <input placeholder="Edit Chore" onChange={(event) => handleEdit(event)}/>
            </td> */}
                {/* <td>{item.due}</td> */}
                {/* <td>
              <input placeholder="Edit Due Date" onChange={(event) => handleEdit(event)}/>
            </td> */}
                <td><button onClick={() => deleteData(item.id)}>X</button></td>
                <td><button onClick={() => putData(item.id)}>Edit</button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
