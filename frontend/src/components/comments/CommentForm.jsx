import { useState } from 'react';
import { Button } from '../common/Button.jsx';
import { sanitizeLongText } from '../../utils/validators.js';

export function CommentForm({ onSubmit }) {
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={submit} className="comment-form">
      <textarea
        value={text}
        onChange={(e) => setText(sanitizeLongText(e.target.value))}
        placeholder="Ваш коментар..."
      />
      <Button type="submit">Надіслати</Button>
    </form>
  );
}
