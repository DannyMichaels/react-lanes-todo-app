import useSound from 'use-sound';
import buttonPressedSfx from '../../../assets/sounds/button-pressed.mp3';
import './Button.css';

export default function Button({ onClick, children, ...rest }) {
  const [playButtonPressed] = useSound(buttonPressedSfx, {
    volume: 0.5,
    interrupt: true,
  });

  return (
    <button
      onClick={onClick}
      onMouseDown={playButtonPressed}
      onMouseUp={playButtonPressed}
      className="Button"
      {...rest}>
      {children}
    </button>
  );
}
