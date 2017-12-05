import { Options as FocusTrapOptions } from "focus-trap";
import React from "react";

declare module "focus-trap-react" {
  export interface Props {
    active?: boolean;
    paused?: boolean;
    tag?: string;
    focusTrapOptions?: FocusTrapOptions;
  }

  export default class FocusTrap extends React.Component<Props> {}
}
