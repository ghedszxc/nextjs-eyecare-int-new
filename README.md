# Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To run production server:

```bash
npm run build
# and
npm start
```

## Features (App Router or Page router):

To use App router rename \_app folder to app.
App Router Documentation: [https://nextjs.org/docs/app/building-your-application]

To use Page router rename \_page to page.
Page Router Documentation: [https://nextjs.org/docs/pages/building-your-application]

## Widget/Module Creation

1. Create a new react component and put it in /widget folder.
2. All low level components or reusable components will be located inside components folder.
3. Each widgets will have their own viewType. This will correspond to the widget filename.

```javascript
// WidgetGenerator.tsx
const Widgets: Widgets = {
  "Banner": dynamic(() => import("@/app/widgets/Banner")),
}
```

_Key will be equivalent to the viewType and the value will be the filename._

4. We have what we call an adapter, this is a method that will format or restructure the raw response data and assign this value as the prop.

```javascript
export class BannerAdapter extends Adapter<IBanner, Nullable<IBanner>> {
  adapt: (source: any) => Nullable<IBanner> = (source) => {
    if (!source.length) return null;
    const data = source[0];

    return {
      header: data?.title,
      longText: data?.detailText,
    };
  };

  adaptReverse: (source: Nullable<any>) => any = (source) => {
    return source;
  };
}
```

5. And we need to register our new adapter to our WidgetParamAdapterFactory.ts

```javascript
export class WidgetParamAdapterFactory extends Factory<
  GenericWidgetNameModel,
  Nullable<IAdapter>
> {
  instance: (comparator: GenericWidgetNameModel) => Nullable<IAdapter> = (
    comparator
  ) => {
    switch (comparator) {
      case "Banner": // Widget file name
        return new BannerAdapter(); // Adapter
      default:
        return null;
    }
  };
}
```

## Best Practices
1. Always run build ``npm run build`` before pushing update in repository as well as before doing any deployments.
2. Once build is done look for any warnings or errors and it is a must to resolve all of these.