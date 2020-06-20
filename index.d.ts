import { Options as FocusTrapOptions } from 'focus-trap';
import * as React from 'react';

export = FocusTrap;

declare namespace FocusTrap {
  export interface Props extends React.AllHTMLAttributes<any> {
    children: React.ReactNode;
    active?: boolean;
    paused?: boolean;
    focusTrapOptions?: FocusTrapOptions;
  }
}

declare class FocusTrap extends React.Component<FocusTrap.Props> { }
