import { SendIcon } from '@blocksuite/icons';
import { IconButton } from '@toeverything/components/button';
import { useAtomValue, useSetAtom } from 'jotai';
import type { ReactElement } from 'react';
import { Suspense, useCallback, useState } from 'react';
import type { SetStateAction, Dispatch } from 'react';
import { ConversationList } from '../core/components/conversation-list';
import { FollowingUp } from '../core/components/following-up';
import { openAIApiKeyAtom, useChatAtoms } from '../core/hooks';
import {
  detailContentActionsStyle,
  detailContentStyle,
  sendButtonStyle,
  textareaStyle,
} from './index.css';

type BaseMessage = any; // Placeholder type, replace with actual type if available

interface ActionsProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

const Actions: React.FC<ActionsProps> = ({ input, setInput }) => {
  const { conversationAtom, followingUpAtoms } = useChatAtoms();
  const call = useSetAtom(conversationAtom);
  const questions = useAtomValue(followingUpAtoms.questionsAtom);
  const generateFollowingUp = useSetAtom(followingUpAtoms.generateChatAtom);
  return (
    <>
      <FollowingUp questions={questions} />
      <div className={detailContentActionsStyle}>
        <textarea
          className={textareaStyle}
          value={input}
          placeholder="Prompt please"
          onChange={e => {
            setInput(e.target.value);
          }}
        />
        <IconButton
          className={sendButtonStyle}
          onClick={useCallback(() => {
            call(input)
              .then(() => generateFollowingUp())
              .catch(e => {
                console.error(e);
              });
          }, [call, generateFollowingUp, input])}
        >
          <SendIcon />
        </IconButton>
      </div>
    </>
  );
};

const DetailContentImpl = () => {
  const { conversationAtom } = useChatAtoms();
  const conversations = useAtomValue(conversationAtom);
  const [input, setInput] = useState('');

  const handleInsertAllClick = (content: string) => {
    setInput(content);
  };

  return (
    <div className={detailContentStyle}>
      <ConversationList conversations={conversations} onInsertAllClick={handleInsertAllClick} />  // Modify this line
      <Suspense fallback="generating follow-up question">
        <Actions input={input} setInput={setInput} />
      </Suspense>
    </div>
  );
};

export const DetailContent = (): ReactElement => {
  const key = useAtomValue(openAIApiKeyAtom);
  if (!key) {
    return <span>Please set OpenAI API Key in the debug panel.</span>;
  }
  return <DetailContentImpl />;
};
