import './App.css';

export default function LabelTextArea({ id, labelText, value, handleChange }) {
  return (
    <div className="mt-4">
      <label htmlFor={id} className="block text-left text-m font-bold mb-1">{labelText}</label>
      <textarea id={id} name={id} value={value} onChange={handleChange} required className="w-full h-full py-2 px-3 rounded border border-blue shadow align-top focus:border-black" />
    </div>
  );
}