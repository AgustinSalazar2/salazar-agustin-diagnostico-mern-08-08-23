import "react";
import { useEffect, useState } from "react";
import "./tareas.css";
import Swal from "sweetalert2";

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState(null);

  const obtenerTareas = async () => {
    try {
      const response = await fetch("http://localhost:4000/task");
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const agregarTarea = async () => {
    try {
      await fetch("http://localhost:4000/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });
      obtenerTareas();
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };


  // const eliminarTarea = async (id) => {

  //   try {
  //     await fetch(`http://localhost:4000/task/${id}`, {
  //       method: "DELETE",
  //     });
  //     obtenerTareas();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const eliminarTarea = async (id) => {
    try {
      Swal.fire({
        title: "Estas seguro?",
        text: "Esta accion es irreversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar ésto!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await fetch(`http://localhost:4000/task/${id}`, {
            method: "DELETE",
          });
          obtenerTareas();

          Swal.fire("Eliminado!", "Tarea eliminada correctamente.", "success");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const mostrarFormularioActualizar = (tarea) => {
    setSelectedTarea(tarea);
    setTitle(tarea.title);
    setDescription(tarea.description);
    setShowUpdateForm(true);
  };

  const limpiarFormulario = () => {
    setSelectedTarea(null);
    setTitle("");
    setDescription("");
    setShowUpdateForm(false);
  };

  const actualizarTarea = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/task/${selectedTarea._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        }
      );

      if (response.ok) {
        obtenerTareas();
        limpiarFormulario();
      } else {
        console.error("Error al actualizar el producto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const cambiarEstado = async (id) => {
  //   try {
  //     await fetch(`http://localhost:4000/task/done/${id}`, {
  //       method: "PUT",
  //     });
  //     obtenerTareas();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const cambiarEstado = async (id) => {
    try {
      Swal.fire({
        title: "Estas seguro?",
        text: "Esta accion es irreversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, completar tarea!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await fetch(`http://localhost:4000/task/done/${id}`, {
            method: "PUT",
          });
          obtenerTareas();

          Swal.fire("Completada!", "Tarea marcada como completa.", "success");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  return (
    <>
      <div>
        <form className="input-container">
          {showUpdateForm ? <h2>Actualizar Tarea</h2> : <h2>Agregar Tarea</h2>}
          <input
            className="input-prod"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Titulo"
          />
          <input
            className="input-prod"
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Descripcion"
          />
          {selectedTarea ? (
            <>
              <button className="boton-prod" onClick={actualizarTarea}>
                Actualizar
              </button>
              <button className="boton-prod" onClick={limpiarFormulario}>
                Cancelar
              </button>
            </>
          ) : (
            <button className="boton-prod" onClick={agregarTarea}>
              {" "}
              Agregar{" "}
            </button>
          )}
        </form>

        <h2>Listado de las Tareas</h2>
        <div className="cards-container">
          {tareas.length > 0 &&
            tareas.map((tarea) => (
              <div className="card" key={tarea._id}>
                <h3>Titulo: {tarea.title}</h3>
                <h4>Descripcion: {tarea.description}</h4>
                <h4>Estado: {!tarea.finished ? "Pendiente" : "Completa"}</h4>
                <div className="button-container">
                  <button onClick={() => eliminarTarea(tarea._id)}>
                    Eliminar
                  </button>

                  {!tarea.finished && (
                    <>
                      <button
                        onClick={() => mostrarFormularioActualizar(tarea)}
                      >
                        Editar
                      </button>
                      <button onClick={() => cambiarEstado(tarea._id)}>
                        Completo
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Tareas;
