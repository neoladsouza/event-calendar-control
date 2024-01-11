import './App.css';

export default function LabelOptions({ id, labelText, value, handleChange, categories }) {
  return (
    <div className="mt-4">
      <label htmlFor={id} className="block text-left text-m font-bold mb-1">{labelText}</label>
      <select id={id} name={id} value={value} onChange={handleChange} required
        className="mx-auto w-full bg-white border border-black px-3 py-2 rounded shadow leading-tight focus:border-black">
        {
          categories.map((value, index) => (
            <option key={index} value={value} required>{value}</option>
          ))
        }
      </select>
    </div>
  );
}
