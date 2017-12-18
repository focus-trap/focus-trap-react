declare module "focus-trap-react" {
  import { Options as FocusTrapOptions } from "focus-trap";
  import * as React from "react";

  // Extend AllHTMLAttributes to provide completions on DOM properties wherever
  // React does.
  interface Props extends React.AllHTMLAttributes<any> {
    active?: boolean;
    paused?: boolean;
    tag?: string;
    focusTrapOptions?: FocusTrapOptions;
    // Allow through any properties that weren't picked up
    [x: string]: any;
  }

  class FocusTrap extends React.Component<Props> {}
  namespace FocusTrap {}

  export = FocusTrap;
}
