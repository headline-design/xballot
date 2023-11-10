import { useState, useEffect } from 'react';
import Autolinker from 'autolinker';

interface Props {
  text: string;
  truncate?: number;
}

const defaultProps: Props = {
    truncate: 0,
    text: ''
};

export default function TextAutolinker(props: Props = defaultProps) {
  const [textWithLinks, setTextWithLinks] = useState('');

  useEffect(() => {
    setTextWithLinks(
      Autolinker.link(props.text, {
        truncate: props.truncate,
        sanitizeHtml: true,
      })
    );
  }, [props.text, props.truncate]);

  return <span dangerouslySetInnerHTML={{ __html: textWithLinks }} />;
}




