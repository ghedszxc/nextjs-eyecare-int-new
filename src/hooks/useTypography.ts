type TTypography = "h1" | "h2" | "h3" | "caption" | "body";
type TBreakpoints = "xs" | "sm" | "md" | "lg" | "md" | "xl" | "initial";
type TBreakpointProps = {
  [key in TBreakpoints]?: [TTypography, "desktop" | "mobile"];
};

type TClassList = {
  [key in TTypography]: {
    desktop: { [key in TBreakpoints]: string };
    mobile: { [key in TBreakpoints]: string };
  };
};

const useTypography = () => {
  /**
   * This blabla
   */
  const setSize = ({ xs, sm, md, lg, xl, initial }: TBreakpointProps) => {
    const classObj: TClassList = {
      h1: {
        desktop: {
          xl: "xl:text-d-h1",
          lg: "lg:text-d-h1",
          md: "md:text-d-h1",
          sm: "sm:text-d-h1",
          xs: "xs:text-d-h1",
          initial: "text-d-h1",
        },
        mobile: {
          xl: "xl:text-m-h1",
          lg: "lg:text-m-h1",
          md: "md:text-m-h1",
          sm: "sm:text-m-h1",
          xs: "xs:text-m-h1",
          initial: "text-m-h1",
        },
      },
      h2: {
        desktop: {
          xl: "xl:text-d-h2",
          lg: "lg:text-d-h2",
          md: "md:text-d-h2",
          sm: "sm:text-d-h2",
          xs: "xs:text-d-h2",
          initial: "text-d-h2",
        },
        mobile: {
          xl: "xl:text-m-h2",
          lg: "lg:text-m-h2",
          md: "md:text-m-h2",
          sm: "sm:text-m-h2",
          xs: "xs:text-m-h2",
          initial: "text-m-h2",
        },
      },
      h3: {
        desktop: {
          xl: "xl:text-d-h3",
          lg: "lg:text-d-h3",
          md: "md:text-d-h3",
          sm: "sm:text-d-h3",
          xs: "xs:text-d-h3",
          initial: "text-d-h3",
        },
        mobile: {
          xl: "xl:text-m-h3",
          lg: "lg:text-m-h3",
          md: "md:text-m-h3",
          sm: "sm:text-m-h3",
          xs: "xs:text-m-h3",
          initial: "text-m-h3",
        },
      },
      body: {
        desktop: {
          xl: "xl:text-d-body",
          lg: "lg:text-d-body",
          md: "md:text-d-body",
          sm: "sm:text-d-body",
          xs: "xs:text-d-body",
          initial: "text-d-body",
        },
        mobile: {
          xl: "xl:text-m-body",
          lg: "lg:text-m-body",
          md: "md:text-m-body",
          sm: "sm:text-m-body",
          xs: "xs:text-m-body",
          initial: "text-m-body",
        },
      },
      caption: {
        desktop: {
          xl: "xl:text-d-caption",
          lg: "lg:text-d-caption",
          md: "md:text-d-caption",
          sm: "sm:text-d-caption",
          xs: "xs:text-d-caption",
          initial: "text-d-caption",
        },
        mobile: {
          xl: "xl:text-m-caption",
          lg: "lg:text-m-caption",
          md: "md:text-m-caption",
          sm: "sm:text-m-caption",
          xs: "xs:text-m-caption",
          initial: "text-m-caption",
        },
      },
    };

    let classResult = "";

    if(initial) {
      classResult += `${classObj[initial[0]][initial[1]].initial}`;
    }
    if (xs) {
      classResult += ` ${classObj[xs[0]][xs[1]].xs}`;
    }
    if (sm) {
      classResult += ` ${classObj[sm[0]][sm[1]].sm}`;
    }
    if (md) {
      classResult += ` ${classObj[md[0]][md[1]].md}`;
    }
    if (lg) {
      classResult += ` ${classObj[lg[0]][lg[1]].lg}`;
    }
    if (xl) {
      classResult += ` ${classObj[xl[0]][xl[1]].xl}`;
    }

    return classResult;
  };

  return setSize;
};

export default useTypography;
