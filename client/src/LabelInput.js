import './App.css';

export default function LabelInput({ id, labelText, type, value, handleChange }) {
    return (
      <div className="mt-4">
        <label htmlFor={id} className="block text-left text-m font-bold mb-1">{labelText}</label>
        <input id={id} type={type} name={id} value={value} onChange={handleChange} required
          className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black" />
      </div>
    );
}