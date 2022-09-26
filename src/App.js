import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const layout = css`
  text-align: center;
  background-color: #136f63;
  width: 100%;
  height: 700px;
  margin: 0 auto;
  color: white;
  padding-top: 24px;
`;

const headline = css`
  font-size: 40px;
  font-family: serif;
  letter-spacing: 3px;
`;

const label = css`
  padding-right: 20px;
  padding-left: 20px;
  font-weight: bold;
`;

const button = css`
  background-color: #041b15;
  border: 0;
  border-radius: 20px;
  width: 100px;
  height: 30px;
  color: white;
  margin-left: 20px;
  margin-bottom: 5px;
`;

const names = css`
  font-weight: bold;
`;

const attending = css`
  margin-left: 20px;
  margin-right: 10px;
  font-style: italic;
`;

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(true);

  const baseUrl = 'http://localhost:4000';

  {
    /** Fetch API */
  }
  async function fetchGuestList() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();

    setGuestList(allGuests);
  }

  useEffect(() => {
    fetchGuestList().catch(() => {});
  }, []);

  useEffect(() => {
    function fetchGuestsInfo() {
      fetch(`${baseUrl}/guests`)
        .then((res) => res.json())
        .then(
          (result) => {
            setLoading(false);
            setInputDisabled(false);
            setGuestList(result);
            console.log('done');
          },

          (err) => {
            setLoading(false);
            setInputDisabled(false);
            console.log(err);
          },
        );
    }
    console.log('Loading');
    fetchGuestsInfo();
  }, []);

  {
    /** Push Guests to API */
  }
  async function addGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    fetchGuestList().catch(() => {});
  }

  {
    /** Remove Guests from API */
  }

  async function removeGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const newGuestList = guestList.filter(
      (guest) => guest.id !== deletedGuest.id,
    );
    setGuestList(newGuestList);
  }

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

    setFirstName('');
    setLastName('');
  };

  console.log(guestList);

  {
    /** Checkbox, tick for each item*/
  }
  async function guestAttendance(id, checked) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: checked }),
    });

    const updatedGuest = await response.json();
    const newGuestList = guestList.map((guest) => {
      if (guest.id === updatedGuest.id) {
        return updatedGuest;
      } else {
        return guest;
      }
    });
    setGuestList(newGuestList);
  }

  return (
    <div css={layout}>
      <header css={headline}>
        <h1>Guest list</h1>
        <hr />
      </header>
      <div id='data-test-id="guest"'>
        <form onSubmit={handleSubmit}>
          {/** input guest details*/}
          <label css={label} htmlFor="First name">
            First name
          </label>
          <input
            id="First name"
            disabled={inputDisabled ? 'disabled' : ''}
            value={firstName}
            onChange={(event) => {
              setFirstName(event.currentTarget.value);
            }}
            required
          />
          <label css={label} htmlFor="Last name">
            Last name
          </label>
          <input
            id="Last name"
            disabled={inputDisabled ? 'disabled' : ''}
            value={lastName}
            onChange={(event) => {
              setLastName(event.currentTarget.value);
            }}
            onKeyDown={handleKeyDown}
            required
          />
          <button css={button} onClick={() => addGuest()}>
            Add Guest
          </button>
        </form>
        {/** Call Guests */}
        <p>{loading ? 'Loading...' : ''}</p>
        <div>
          {guestList.map((guest) => {
            return (
              <div key={guest.id}>
                <span
                  css={names}
                >{`${guest.firstName} ${guest.lastName}`}</span>
                <span css={attending}>Attending:</span>
                <input
                  aria-label="attending"
                  checked={guest.attending}
                  type="checkbox"
                  onChange={(event) =>
                    guestAttendance(guest.id, event.currentTarget.checked)
                  }
                />
                <button
                  css={button}
                  aria-label="Remove"
                  onClick={() => removeGuest(guest.id)}
                >
                  Delete Guest
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
