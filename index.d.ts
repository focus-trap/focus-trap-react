declare namespace FocusTrap {
  export interface FocusTrapProps {
    active?: boolean;
    paused?: boolean;
    focusTrapOptions?: FocusTrapOptions;
  }

  export class FocusTrap extends React.Component<FocusTrapProps & React.HTMLAttributes<HTMLDivElement>> {
    render(): JSX.Element;
  }
}

declare module 'focus-trap-react' {
  import E = FocusTrap.FocusTrap;
  export = E;
}