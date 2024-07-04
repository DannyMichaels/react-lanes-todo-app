import './Input.css';

export default function Input({ onChange = () => {}, ...rest }) {
  return <input className="Input" onChange={onChange} {...rest} />;
}
