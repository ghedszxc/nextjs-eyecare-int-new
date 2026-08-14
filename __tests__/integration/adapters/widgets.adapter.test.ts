/**
 * @jest-environment node
 */

// Types
import { ILayoutModel } from '@/models/ILayout.interface';
import { Nullable } from '@/models/Nullable.interface';
import { TTestCMSWidgetMapping } from '@/models/tests/TestWidgets.interface';

// Helpers
import { cmsRepo } from '@/graphql/CMSRepo';
import { jsonToLayoutAdapter } from '@/coremedia-integration/adapters/JsonToLayoutAdapter';

// Variables
const locale = process.env.NEXT_PUBLIC_GRAPHQL_TEST_LOCALE;
const path = process.env.NEXT_PUBLIC_GRAPHQL_TEST_PATH;
let response: Nullable<ILayoutModel>;

// Functions
const getWidgetData = (viewtype: string) => {
   return response?.widgets?.find((widget) => widget.widgetName === viewtype)?.widgetValue;
};

const testCMSWidgetMapping = (viewtype: string, mapper: TTestCMSWidgetMapping) => {
   const widgetData = getWidgetData(viewtype);

   // Check if properties exists in response
   const propArr = Object.keys(mapper);
   const cmPropArr = Object.values(mapper);

   propArr.forEach((_, key) => {
      const cmProp = cmPropArr[key] as string;
      expect(widgetData?.[0]).toHaveProperty(cmProp);
   });
};

describe('Widget adapter integrations', () => {
   /**
    * Initialize data
    */
   beforeAll(async () => {
      /**
       * Use if not running NextJS environment
       * to directly call GraphQL queries
       */
      const cmsResp = await cmsRepo.getLayoutData(locale || 'eyi-', path || '/');
      response = jsonToLayoutAdapter.adapt(cmsResp);
      return;

      /**
       * Use if running NextJS environment
       * for the API route to work
       */
      // response = (await fetch(
      //   `http://localhost:3000/api/fetchPageData/?lang=${locale}&path=${path}`,
      //   { cache: "force-cache" }
      // ).then((res) => res.json())) as ILayoutModel;
   });

   /**
    * Start testing
    */
   it('Layout data widgets exists', () => {
      expect(response).toHaveProperty('widgets');
      expect(response?.widgets.length).toBeGreaterThanOrEqual(0);
   });

   // Manual CM properties distributions
   it('KeyFigures properties maps with CMS response as expected', () => {
      const widgetData = getWidgetData('KeyFigures');

      for (let i = 0; i < widgetData.length; i++) {
         expect(widgetData?.[i]).toHaveProperty('teaserText');
         expect(widgetData?.[i]).toHaveProperty('teaserTitle');
      }
   });

   it('PhotoList3 properties maps with CMS response as expected', () => {
      const widgetData = getWidgetData('PhotoList3');

      expect(widgetData?.[0]).toHaveProperty('items[0].data.uri');
      expect(widgetData?.[0]).toHaveProperty('items[0].title');
      expect(widgetData?.[0]).toHaveProperty('items[0].detailText');
      expect(widgetData?.[0]).toHaveProperty('collectionTitle');
      expect(widgetData?.[0]).toHaveProperty('collectionSubTitle');
   });

   it('LRDynamicText properties maps with CMS response as expected', () => {
      const widgetData = getWidgetData('LRDynamicText');

      expect(widgetData?.[0]).toHaveProperty('viewtype');
      expect(widgetData?.[0]).toHaveProperty('teaserTitle');
      expect(widgetData?.[0]).toHaveProperty('title');
      expect(widgetData?.[0]).toHaveProperty('detailText');
      expect(widgetData?.[0]).toHaveProperty('pictures[0]');
      expect(widgetData?.[0]).toHaveProperty('videos[0]');
   });

   it('TextColumn properties maps with CMS response as expected', () => {
      const widgetData = getWidgetData('LRDynamicText');

      expect(widgetData?.[0]).toHaveProperty('title');
      expect(widgetData?.[0]).toHaveProperty('detailText');
   });

   /**
    * Clean up optional
    */
   afterAll(async () => {
      response = null;
   });
});
