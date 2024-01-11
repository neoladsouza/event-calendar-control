import './App.css';

export default function Form({ children, handleSubmit }) {
    return (
      <form onSubmit={handleSubmit} className="text-center bg-white shadow-md rounded-xl px-8 pt-6 pb-8 w-full h-max border border-blue">
        {children}
      </form>
    );
}