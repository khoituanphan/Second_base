import { PlusIcon, ResetIcon } from '@blocksuite/icons';
import { Button } from '@toeverything/components/button';
import { clsx } from 'clsx';
import type { MessageType } from 'langchain/schema';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { mangle } from 'marked-mangle';
import { type ReactElement, useMemo } from 'react';

import * as styles from './index.css';

marked.use(
  gfmHeadingId({
    prefix: 'affine-',
  })
);

marked.use(mangle());

export interface ConversationProps {
  type: MessageType;
  text: string;
  onInsertAllClick?: (content: string) => void;
}

export const Conversation = (props: ConversationProps): ReactElement => {
  const html = useMemo(() => marked.parse(props.text), [props.text]);

  const handleInsertAllClick = () => {
    const pageElement = document.querySelector("[data-document-content]");
    if (pageElement && 'innerText' in pageElement) {
        const pageContent = (pageElement as HTMLElement).innerText;
        props.onInsertAllClick && props.onInsertAllClick(pageContent);
    }
  };

  return (
    <div
      className={clsx(styles.containerStyle, {
        [styles.avatarRightStyle]: props.type === 'human',
      })}
    >
      <div className={styles.conversationContainerStyle}>
        <div
          className={clsx(styles.conversationStyle, {
            [styles.aiMessageStyle]: props.type === 'ai',
            [styles.humanMessageStyle]: props.type === 'human',
          })}
        >
          {props.type === 'ai' ? (
            <div className={styles.regenerateButtonStyle}>
              <div className={styles.resetIconStyle}>
                <ResetIcon />
              </div>
              Regenerate
            </div>
          ) : null}
          <div
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          ></div>
        </div>
        {props.type === 'ai' ? (
          <div className={styles.insertButtonsStyle}>
            <Button icon={<PlusIcon />} className={styles.insertButtonStyle}>
              Insert list block only
            </Button>
            <Button 
              icon={<PlusIcon />} 
              className={styles.insertButtonStyle}
              onClick={handleInsertAllClick}
            >
              Insert all
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
