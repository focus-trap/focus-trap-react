declare module "focus-trap-react" {
  import { Options as FocusTrapOptions } from "focus-trap";
  import * as React from "react";

  // Extend AllHTMLAttributes to provide completions on DOM properties wherever
  // React does.
  export interface Props extends React.AllHTMLAttributes<any> {
    active?: boolean;
    paused?: boolean;
    tag?: string;
    focusTrapOptions?: FocusTrapOptions;
    // Allow through any properties that weren't picked up
    [x: string]: any;
  }

  export default class FocusTrap extends React.Component<Props> {}
}
