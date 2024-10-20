import { Options as FocusTrapOptions } from 'focus-trap';
import * as React from 'react';

declare namespace FocusTrap {
  export interface Props extends React.AllHTMLAttributes<any> {
    children?: React.ReactNode;
    active?: boolean;
    paused?: boolean;
    focusTrapOptions?: FocusTrapOptions;
    containerElements?: Array<HTMLElement>;
  }
}

export declare class FocusTrap extends React.Component<FocusTrap.Props> { }
