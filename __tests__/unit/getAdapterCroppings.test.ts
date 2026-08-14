import { getAdapterCroppings, ICroppingsRawData } from "@/lib/utilities";

describe("getAdapterCroppings test", () => {
  it("getAdapterCroppings", () => {
    const mock: ICroppingsRawData[] = [
      {
        crops: [
          {
            name: "heroBanner1140",
            minWidth: 1140,
          },
          {
            name: "heroBanner1920",
            minWidth: 1920,
          },
          {
            name: "heroBanner375",
            minWidth: 668,
          },
        ],
        uriTemplate:
          "/caas/v1/media/6472/data/8ec6e2ab6f8595c80683ad821100db29/{cropName}/{width}/photo1.png",
      },
    ];
    const result = getAdapterCroppings(mock);
    const cropNames = Object.keys(result[0].crops);

    expect(result[0].uriTemplate).toEqual(mock[0].uriTemplate);

    for (const name of cropNames) {
      expect(result[0].crops).toHaveProperty(name);
    }
  });
});
