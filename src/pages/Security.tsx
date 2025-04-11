import { Navbar } from "@/components/Navbar";
import React, { useState, useRef } from "react";

function Security() {
  // Store the PIN as an array of 4 digits.
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  // Handle input change for each box.
  const handleChange = (e, index) => {
    const value = e.target.value;
    // Only allow a single digit.
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      // If a digit was entered and this isn't the last box, move focus to the next.
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle key down events to manage backspace behavior.
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newPin = [...pin];
      // If the current box is not empty, clear it.
      if (newPin[index] !== "") {
        newPin[index] = "";
        setPin(newPin);
      } else if (index > 0) {
        // If the current box is empty, move focus to the previous box and clear it.
        inputRefs.current[index - 1].focus();
        newPin[index - 1] = "";
        setPin(newPin);
      }
    }
  };

  // Save function to verify that all 4 digits are entered.
  const handleSave = () => {
    const joinedPin = pin.join("");
    if (joinedPin.length === 4 && /^\d{4}$/.test(joinedPin)) {
      console.log("Saving PIN:", joinedPin);
      alert("PIN saved!");
    } else {
      alert("Please enter a valid 4-digit PIN.");
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Navbar />
      <div className="flex flex-col items-center h-screen">
        {/* <h1 className="text-2xl font-bold text-gray-900 mb-6 mt-3 dark:text-white">
          Security Settings
        </h1> */}
        <div className=" p-4 flex flex-col mt-3 w-full rounded-lg">
          <h1 className="text-lg font-workSans font-bold text-gray-900 dark:text-white border-b-2 w-full border-gray-600">
            PIN Verification
          </h1>
          <h2 className="text-sm font-workSans text-gray-900 dark:text-white mb-4 pl-2">
            In order to complete transactions securely, please enter a four
            digit pin
          </h2>
          <div className="flex space-x-2 mb-4 flex item-center justify-center">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(ref) => (inputRefs.current[index] = ref)}
                // Auto-focus the first input when the component mounts.
                autoFocus={index === 0}
                className="w-8 h-8 text-center border border-gray-300 rounded dark:text-black"
              />
            ))}
          </div>
          <button
            onClick={handleSave}
            className="bg-primary text-black font-workSans text-sm font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Security;
