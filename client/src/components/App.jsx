
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Home from "./Home"
import styled from "styled-components"

const Container = styled.form`
    display: flex;
    flex-direction: column;
    padding: 2em;
    gap: 1.5em;
    width: 300px;

    label {
    display: flex;
    flex-direction: column;
    }
    
    input {
      padding: 0.5em;
    }

    button {
      padding: 0.5em;
    }
`

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/">
          <Form />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;


function Form() {

  return (
    <Container action="/home">
      <label htmlFor="firstname">First Name
        <input name="firstname" type="text" />
      </label>
      <label htmlFor="lastname">Last Name
        <input name="lastname" type="text" />
      </label>
      <label htmlFor="email">Email
        <input name="email" type="text" />
      </label>
      <button>Submit</button>
    </Container>
  )
}