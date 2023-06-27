import React, { useState } from 'react';

const InputMessage = () => {
  const [value, setValue] = useState('');

  const handler = (event) => {
    setValue(event.target.value);
  };

  let text = '';
  const handleClick = () => {
    console.log(value);
    text = value;
  };

  return (
    <>
      <p>{value}</p>
      <input
        value={value}
        type="text"
        placeholder="enter message here"
        onChange={handler}
      />
      <div
        style={{
          backgroundColor: 'black',
          margin: 5,
          padding: 5,
          height: 10,
          width: 10,
          borderRadius: 25,
        }}
        onClick={handleClick}
      >
        {text}
      </div>
    </>
  );
};

export default InputMessage;
