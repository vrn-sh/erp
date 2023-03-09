import React, { useState } from "react";

type BillingSettings = {
  cardNumber: string;
  cardHolderName: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
};

const initialSettings: BillingSettings = {
  cardNumber: "",
  cardHolderName: "",
  expirationMonth: 1,
  expirationYear: new Date().getFullYear() + 1,
  cvv: "",
};

export default function SettingBilling() {
  const [settings, setSettings] = useState<BillingSettings>(initialSettings);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSettings((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    const { value } = event.target;
    setSettings((prevState) => ({ ...prevState, [field]: parseInt(value) }));
  };

  const handleReset = () => {
    setSettings(initialSettings);
  };

  const handleSave = () => {
    // Call API or update local storage
    console.log(settings);
    alert("Settings saved");
  };

  return (
    <div>
      <h1>Billing Settings</h1>
      <div>
        <label>
          Card number:
          <input
            type="text"
            name="cardNumber"
            value={settings.cardNumber}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Cardholder name:
          <input
            type="text"
            name="cardHolderName"
            value={settings.cardHolderName}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Expiration date:
          <select
            name="expirationMonth"
            value={settings.expirationMonth}
            onChange={(event) => handleSelectChange(event, "expirationMonth")}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            name="expirationYear"
            value={settings.expirationYear}
            onChange={(event) => handleSelectChange(event, "expirationYear")}
          >
            {Array.from({ length: 10 }, (_, i) => i + new Date().getFullYear()).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
        </label>
      </div>
      <div>
        <label>
          CVV:
          <input
            type="text"
            name="cvv"
            value={settings.cvv}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};
