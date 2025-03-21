import type { BlockHub } from '@blocksuite/blocks';
import type { Atom } from 'jotai';
import { useAtomValue } from 'jotai';
import type { HTMLAttributes, ReactElement } from 'react';
import { useEffect, useRef } from 'react';

export interface BlockHubProps extends HTMLAttributes<HTMLDivElement> {
  blockHubAtom: Atom<Readonly<BlockHub> | null>;
}

export const BlockHubWrapper = (props: BlockHubProps): ReactElement => {
  const blockHub = useAtomValue(props.blockHubAtom);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const div = ref.current;
      if (blockHub) {
        if (div.hasChildNodes()) {
          div.removeChild(div.firstChild as ChildNode);
        }
        div.appendChild(blockHub);
      }
    }
  }, [blockHub]);
  return <div ref={ref} data-testid="block-hub" />;
};
