import { GenericWidgetValueModel } from "../../models/IGenericWidgetValue.interface";
import { Nullable } from "../../models/Nullable.interface";
import { Adapter } from "./Adapter";

export class StaticPathsAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<any>
> {
  adapt: (source: any) => Nullable<any> = (source) => {
    if (!source?.data?.content?.site?.root) return null;
    const root = source?.data?.content?.site?.root;
    const children = root?.children;

    const locale = root?.segment.replace(/eyi-/g, "");
    const paths: any[] = [];

    const checkChildren = (data: any) => {
      return !!data?.children && !!data?.children?.length;
    };

    paths.push({
      params: {
        page: [],
      },
      locale: locale,
      modificationDate: root?.modificationDate,
      hiddenInSitemap: root?.hiddenInSitemap || false,
    });

    children?.forEach((data: any) => {
      // Root
      const rootParams = {
        params: {
          page: [data?.segment],
        },
        locale: locale,
        modificationDate: data?.modificationDate || "",
        hiddenInSitemap: data?.hiddenInSitemap || false,
      };
      paths.push(rootParams);

      // Level 1
      if (checkChildren(data)) {
        const childPaths = data?.children;
        const parentSegment = data?.segment;

        childPaths.forEach((child: any) => {
          const segment = child.segment;
          const param1 = {
            params: {
              page: [parentSegment, segment],
            },
            locale: locale,
            modificationDate: child?.modificationDate || "",
            hiddenInSitemap: child?.hiddenInSitemap || false,
          };
          paths.push(param1);

          // Level 2
          if (checkChildren(child)) {
            child?.children?.forEach((child2: any) => {
              const segment = child.segment;
              const param2 = {
                params: {
                  page: [parentSegment, segment, child2.segment],
                },
                locale: locale,
                modificationDate: child2?.modificationDate || "",
                hiddenInSitemap: child2?.hiddenInSitemap || false,
              };
              paths.push(param2);

              // Level 3
              if (checkChildren(child2)) {
                child?.children?.forEach((child3: any) => {
                  const segment = child.segment;
                  const param3 = {
                    params: {
                      page: [parentSegment, segment, child3.segment],
                    },
                    locale: locale,
                    modificationDate: child3?.modificationDate || "",
                    hiddenInSitemap: child3?.hiddenInSitemap || false,
                  };
                  paths.push(param3);

                  // Level 4
                  if (checkChildren(child3)) {
                    child?.children?.forEach((child4: any) => {
                      const segment = child.segment;
                      const param4 = {
                        params: {
                          page: [parentSegment, segment, child4.segment],
                        },
                        locale: locale,
                        modificationDate: child4?.modificationDate || "",
                        hiddenInSitemap: child4?.hiddenInSitemap || false,
                      };
                      paths.push(param4);
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    return paths;    
  };

  adaptReverse: (source: Nullable<any>) => any = (source) => {
    return source;
  };
}
