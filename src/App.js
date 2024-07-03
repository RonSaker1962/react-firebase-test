import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movielist, setMovieList] = useState([]);
  const moviesCollRef = collection(db, "movies");
  // add movie
  const [movieTitle, setMovieTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState(0);
  const [recvdOscar, setRecvdOscar] = useState(false);

  // update title
  const [newTitle, setNewTitle] = useState("");
  // upload file
  const [uploadFile, setUploadFile] = useState(null);

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollRef);
      const filterData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filterData);
    } catch (err) {
      console.error(err);
    }
  };
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: newTitle });
    getMovieList();
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitNewMovie = async () => {
    try {
      await addDoc(moviesCollRef, {
        title: movieTitle,
        releaseDay: releaseDate,
        recievedAnOscar: recvdOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
      setMovieTitle("");
      setReleaseDate("");
    } catch (err) {
      console.error(err);
    }
  };

  const uploadNewFile = async () => {
    if (!uploadFile) return;
    const fileFolderRef = ref(storage, `projectFiles/${uploadFile.name}`);
    try {
      await uploadBytes(fileFolderRef, uploadFile);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Auth></Auth>
      <div>
        <input
          placeholder="Title....."
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release Date....."
          type="number"
          value={releaseDate}
          onChange={(e) => setReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={recvdOscar}
          onChange={(e) => setRecvdOscar(e.target.checked)}
        />
        <label>Reacieved an Oscar</label>
        <button onClick={onSubmitNewMovie}>Submit Movie</button>
      </div>
      <div>
        {movielist.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.recievedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>date: {movie.releaseDay}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
            <input
              placeholder="New Title..."
              onChange={(e) => setNewTitle(e.target.value)}
            ></input>
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update Title
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          type="file"
          onChange={(e) => setUploadFile(e.target.files[0])}
        ></input>
        <button onClick={uploadNewFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
