import { useEffect, useState } from "react";

export default function App() {

  const [choreList, setChoreList] = useState([])
  const [newChore, setNewChore] = useState ({
    todo: "",
    due: "",
  })

  const getData = async () => {
    try {
      const response = await fetch("/api/getList")
      const data = await response.json()
      setChoreList(data)
    } catch (error) {
      console.log("Error in GET data", error)
    }
  }

  const putData = async () => {
    const id = 1;
    const newData = {
      todo: "Clean room",
      due: "08/03/2023"
    }
    try {
      const response = await fetch(`/api/updateList/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newData)
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
    try{
      const response = await fetch(`/api/deleteChore${id}`, {
        method: "DELETE"
      })
      const data = await response.json()
      getData()
    }catch(error){
      console.log("Error deleting item", error)
    }
  }

  const placeholder = (event) => {
    setNewChore((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect (() => {

  }, [newChore])

  return (
    <>
      <div>Adult in Training</div>
      <div className="placeholder">
        <input name="todo" className="todo" placeholder="Chore" onChange={placeholder} value={newChore.todo}/>
        <input name="due" className="due" placeholder="Due Data" onChange={placeholder} value={newChore.due}/>
      </div>
      <button onClick={putData}>UPDATE CHORE</button>
      <button onClick={addData}>ADD NEW CHORE</button>
      <button onClick={deleteData}>DELETE CHORE</button>

      <table>
        <thead>
          <tr>
            <th>Chore</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
        {choreList.map((item) => 
          <tr key={item.id}>
            <td>{item.todo}</td>
            <td>{item.due}</td>
            <td><button onClick={() => deleteData(item.id)}>X</button></td>
          </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
