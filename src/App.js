import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newGuests, setNewGuests] = useState([]);
  const [guestList, setGuestList] = useState([]);
  const [checkBoxValue, setCheckBoxValue] = useState(false);

  const baseUrl = 'http://localhost:4000';

  async function fetchGuestList() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();

    setGuestList(allGuests.results[0]);
  }

  useEffect(() => {
    fetchGuestList().catch(() => {});
  }, []);

  // const response = await fetch(`${baseUrl}/guests`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ firstName: {firstName}, lastName: {lastName} }),
  // });
  // const createdGuest = await response.json();

  // useEffect(() => {
  //   if (guestList) {
  //     document.title = `user profile : ${user.name.first}`;
  //   }
  // }, [user]);

  // if (!user) return <div>is Loading...</div>;

  const handleKeyDown = (event) => {
    console.log('User pressed: ', event.key);

    if (event.key === 'Enter') {
      console.log('Enter key pressed ✅');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    this.state.newGuests.push(this.state.newGuests);

    setFirstName('');
    setLastName('');
  };

  return (
    <div>
      <header>
        <h1>Guest list</h1>
      </header>
      <div id='data-test-id="guest"'>
        <form onSubmit={handleSubmit}>
          {/** input guest details*/}
          <label htmlFor="First name">First name</label>
          <input
            id="First name"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.currentTarget.value);
            }}
            required
          />
          <label htmlFor="Last name">Last name</label>
          <input
            id="Last name"
            value={lastName}
            onChange={(event) => {
              setLastName(event.currentTarget.value);
            }}
            onKeyDown={handleKeyDown}
            required
          />
          <button onClick={() => setNewGuests(`${firstName} ${lastName}`)}>
            Submit
          </button>
        </form>
        <div>
          {newGuests}
          <input
            checked={checkBoxValue}
            type="checkbox"
            onChange={(event) => setCheckBoxValue(event.currentTarget.checked)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
