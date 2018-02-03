import { Options as FocusTrapOptions } from 'focus-trap';
import * as React from 'react';

export = FocusTrap;

declare namespace FocusTrap {
  export interface Props extends React.AllHTMLAttributes<any> {
    active?: boolean;
    paused?: boolean;
    tag?: string;
    focusTrapOptions?: FocusTrapOptions;
    // Allow through any properties that weren't picked up
    [prop: string]: any;
  }
}

declare class FocusTrap extends React.Component<FocusTrap.Props> {}
