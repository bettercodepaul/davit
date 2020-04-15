import "styled-components";

/**
 * This interface is needed as a workaround for Typescript to use 'Styled'.
 * https://styled-components.com/docs/api#typescript
 *
 * All style types have to be declared here, befor we can use them.
 */
declare module "styled-components" {
  export interface DefaultTheme {
    backgroundcolor: string;
    text: string;
    fontFamily: string;

    color: {
      primary: string;
      secondary: string;
    };

    borderRadius: {
      popup: string;
    };

    textAlin: {
      left: string;
      right: string;
      center: string;
      start: string;
      end: string;
      matchParent: string;
    };
  }
}