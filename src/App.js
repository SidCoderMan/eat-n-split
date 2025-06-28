import { useState } from "react";
const App = () => {
  const [openF, setOpenF] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [bill, setBill] = useState(0);
  const [exp, setExp] = useState(0);
  const [paying, setPaying] = useState("you");

  const handleSubmit = (e) => {
    e.preventDefault();
    selectedFriend.balance =
      paying === "you"
        ? selectedFriend.balance + (bill - exp)
        : selectedFriend.balance - exp;
    handleSelectedFriend(selectedFriend);
  };

  const handleOpenF = () => {
    setOpenF((openF) => !openF);
  };

  const handleSetBill = (amount) => {
    setBill((bill) => amount);
  };

  const handleSetExp = (amount) => {
    setExp((exp) => amount);
  };

  const handleSetPaying = (amount) => {
    setPaying((paying) => amount);
  };

  const handleSelectedFriend = (friend) => {
    setSelectedFriend((f) => (f?.id === friend.id ? null : friend));
    setOpenF(false);
  };

  const handleSetFriendsList = (friend) => {
    setFriendsList((friends) => [...friends, friend]);
  };

  return (
    <div className="container">
      <div className="heading-wrapper">
        <DotGroup />
        <Header />
        <DotGroup />
      </div>

      <div className="app">
        <div className="sidebar">
          <FriendsList
            friendsList={friendsList}
            onSelectedFriend={handleSelectedFriend}
            selectedFriend={selectedFriend}
          />
          {openF && <FormAddFriend onSetFriendsList={handleSetFriendsList} />}
          <Button onOpenPanel={handleOpenF}>
            {!openF ? "Add Friend" : "Close"}
          </Button>
        </div>
        {selectedFriend && (
          <FormSplitBill
            friend={selectedFriend}
            bill={bill}
            onSetBill={handleSetBill}
            exp={exp}
            onSetExp={handleSetExp}
            paying={paying}
            onSetPaying={handleSetPaying}
            onHandleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <h1>EAT 'N SPLIT</h1>
    </header>
  );
};

const DotGroup = () => {
  return (
    <div className="dot-group">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  );
};

const FriendsList = ({ friendsList, onSelectedFriend, selectedFriend }) => {
  return (
    <>
      <ul>
        {friendsList.length === 0 ? (
          <p>Don't wait! Add friends today!</p>
        ) : (
          friendsList.map((friend) => (
            <Friend
              name={friend?.name}
              image={friend?.image}
              balance={friend?.balance}
              onSelectedFriend={() => onSelectedFriend(friend)}
              selectedFriend={selectedFriend}
              id={friend?.id}
              key={friend?.id}
            ></Friend>
          ))
        )}
      </ul>
    </>
  );
};

const Friend = ({
  name,
  image,
  balance,
  onSelectedFriend,
  selectedFriend,
  id,
}) => {
  const isSelected = selectedFriend?.id === id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <h3>{name}</h3>
      <img src={image} alt="friend"></img>
      <p className={balance > 0 ? "green" : balance < 0 ? "red" : ""}>
        {balance > 0
          ? `${name} owes you ${Math.abs(balance)}$`
          : balance < 0
          ? `You owe ${name} ${Math.abs(balance)}$ `
          : `You and ${name} are even.`}
      </p>
      <Button onOpenPanel={onSelectedFriend}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};

const Button = ({ children, onOpenPanel }) => {
  return (
    <button className="button" onClick={onOpenPanel}>
      {children}
    </button>
  );
};

const FormAddFriend = ({ onSetFriendsList }) => {
  const IMAGE_URL = "https://ui-avatars.com/api/?name=";
  const [name, setName] = useState("");
  const [image, setImage] = useState(IMAGE_URL);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${IMAGE_URL}${name}`,
      balance: 0,
      id: id,
    };
    onSetFriendsList(newFriend);
    setName("");
    setImage(`${IMAGE_URL}`);
    console.log(image);
  };
  return (
    <>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>😀 Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button> Add </Button>
      </form>
    </>
  );
};

const FormSplitBill = ({
  friend,
  bill,
  onSetBill,
  exp,
  onSetExp,
  paying,
  onSetPaying,
  onHandleSubmit,
}) => {
  return (
    <form className="form-split-bill" onSubmit={onHandleSubmit}>
      <h2> SPLIT A BILL WITH {friend?.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => onSetBill(Number(e.target.value))}
      ></input>
      <label>💵 Your expense</label>
      <input
        type="text"
        value={exp}
        onChange={(e) =>
          onSetExp(Number(e.target.value) > bill ? exp : Number(e.target.value))
        }
      ></input>
      <label>
        💵
        {friend?.name.substring(0, 1).toUpperCase() + friend?.name.substring(1)}
        's expense
      </label>
      <input type="text" value={bill - exp}></input>
      <label>🤑 Who is paying the bill?</label>
      <select value={paying} onChange={(e) => onSetPaying(e.target.value)}>
        <option value="you" type="text">
          You
        </option>
        <option value="friend" type="text">
          {friend?.name}
        </option>
      </select>
      <Button> Split Bill </Button>
    </form>
  );
};
export default App;
